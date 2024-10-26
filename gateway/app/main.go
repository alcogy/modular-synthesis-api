package main

import (
	"context"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

func getClient() *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "", // No password set
		DB:       0,  // Use default DB
		Protocol: 2,  // Connection protocol
	})
}

func GetModuleURL(service string) string {
	db := getClient()
	ctx := context.Background()

	url, err := db.Get(ctx, service).Result()
	if err != nil {
		panic(err)
	}

	return url
}

func RunReverseProxy(ctx *gin.Context) {
	// Get service name from url.
	service := ctx.Param("service")
	// Get service info from db (redis)
	if service == "" {
		ctx.IndentedJSON(http.StatusNotFound, gin.H{"message": service + " is not found."})
	}

	// Get and confirm service info
	module := GetModuleURL(service)

	// for URL.
	remote, err := url.Parse(module)
	if err != nil {
		ctx.IndentedJSON(http.StatusInternalServerError, gin.H{"message": service + " is failed."})
	}

	// Make reverce proxy director.
	rp := httputil.NewSingleHostReverseProxy(remote)
	rp.Director = func(req *http.Request) {
		req.Header = ctx.Request.Header
		req.Host = remote.Host
		req.URL.Scheme = remote.Scheme
		req.URL.Host = remote.Host
		req.URL.Path = ctx.Param("param")
	}

	// go to module.
	rp.ServeHTTP(ctx.Writer, ctx.Request)
}

func MakeRouting(router *gin.Engine) *gin.Engine {
	router.GET("/:service/*param", RunReverseProxy)
	router.POST("/:service/*param", RunReverseProxy)
	router.PUT("/:service/*param", RunReverseProxy)
	router.DELETE("/:service/*param", RunReverseProxy)

	return router
}

func main() {
	router := gin.Default()
	router = MakeRouting(router)
	router.Run(":9000")
}

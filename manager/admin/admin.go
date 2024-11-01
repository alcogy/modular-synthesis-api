package admin

import (
	"manager/admin/handler"

	"github.com/jmoiron/sqlx"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/pkg/browser"
)

func Serve(mysql *sqlx.DB) {
	e := echo.New()
	
	e.Use(middleware.Logger())
  e.Use(middleware.Recover())

	// Static files.
	e.Static("/", "admin/public")
	e.GET("/", handler.GetIndexHtml)

	// API.
	e.GET("/api/containers", handler.GetAllContainers)
	e.POST("/api/container", handler.PostContainer)
	e.GET("/api/tables", func (c echo.Context) error {
		return handler.GetAllTables(c, mysql)
	})
	
	go func() {
		browser.OpenURL("http://localhost:5500")
	}()

	e.Logger.Fatal(e.Start(":5500"))
	
}
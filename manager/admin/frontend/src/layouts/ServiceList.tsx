import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import Paper from "@mui/material/Paper";
import ModuleTitle from "../components/ModuleTitle";
import AddIcon from "@mui/icons-material/Add";
import { useRecoilState, useRecoilValue } from "recoil";
import { loadingState, serviceListState } from "../state/atoms";
import {
  API_SERVICE_START,
  API_SERVICE_STOP,
  API_SERVICE_REMOVE,
  API_GET_SERVICES,
} from "../common/constants";
import { useEffect, useState } from "react";
import { Service } from "../state/models";
import CircleIcon from "@mui/icons-material/Circle";

export default function SearviceList() {
  const serviceList = useRecoilValue(serviceListState);
  const [_, setIsLoading] = useRecoilState(loadingState);
  const [services, setServices] = useState<Service[]>();

  // Click start container handler.
  const onClickStart = async (containerID: string) => {
    setIsLoading(true);
    await fetch(API_SERVICE_START + containerID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .catch((e) => {
        console.error(e);
        alert("Sorry you got error.");
      })
      .finally(() => {
        setIsLoading(false);
      });
    // TODO update service list on recoil.
  };

  // Click stop container handler.
  const onClickStop = async (containerID: string) => {
    setIsLoading(true);
    await fetch(API_SERVICE_STOP + containerID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .catch((e) => {
        console.error(e);
        alert("Sorry you got error.");
      })
      .finally(() => {
        setIsLoading(false);
      });
    // TODO update service list on recoil.
  };

  // Click remove container handler.
  const onClickRemove = async (service: string) => {
    setIsLoading(true);
    await fetch(API_SERVICE_REMOVE + service, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .catch((e) => {
        console.error(e);
        alert("Sorry you got error.");
      })
      .finally(() => {
        setIsLoading(false);
      });
    // TODO update service list on recoil.
  };

  const topUpper = (str: string): string => {
    const top = str[0].toUpperCase();
    const rest = str.slice(1).toLowerCase();
    return top + rest;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(API_GET_SERVICES);
      const data = await response.json();
      setServices(data as Service[]);
    };
    fetchData().catch((e) => console.error(e));
  }, []);

  return (
    <Paper elevation={8} sx={{ padding: 3 }}>
      <ModuleTitle label="Service Manager" />
      <Box sx={{ marginBottom: 1 }}>
        <Button variant="contained" startIcon={<AddIcon />} href="/#/service">
          Service
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services?.map((value) => (
              <TableRow key={value.id}>
                <TableCell>{value.id}</TableCell>
                <TableCell>{value.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <CircleIcon
                      color={value.state === "running" ? "success" : "disabled"}
                      fontSize="small"
                    />
                    <Typography variant="body2">
                      {topUpper(value.state)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ width: "1%", whiteSpace: "nowrap" }}>
                  <ButtonGroup
                    variant="contained"
                    aria-label="Basic button group"
                  >
                    <IconButton
                      onClick={() => onClickStart(value.id)}
                      disabled={value.state === "running"}
                    >
                      <PlayArrowIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => onClickStop(value.id)}
                      disabled={value.state !== "running"}
                    >
                      <StopIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => onClickRemove(value.name)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

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
import { useRecoilValue } from "recoil";
import { serviceListState } from "../state/atoms";
import {
  API_SERVICE_START,
  API_SERVICE_STOP,
  API_SERVICE_REMOVE,
} from "../common/constants";

export default function SearviceList() {
  const serviceList = useRecoilValue(serviceListState);

  const onClickStart = async (containerID: string) => {
    await fetch(API_SERVICE_START + containerID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // TODO update service list on recoil.
  };

  const onClickStop = async (containerID: string) => {
    await fetch(API_SERVICE_STOP + containerID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // TODO update service list on recoil.
  };

  const onClickRemove = async (service: string) => {
    await fetch(API_SERVICE_REMOVE + service, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // TODO update service list on recoil.
  };

  return (
    <Paper elevation={8} sx={{ padding: "24px" }}>
      <ModuleTitle label="Service Manager" />
      <Box sx={{ marginBottom: 1 }}>
        <Button variant="contained" startIcon={<AddIcon />} href="/service">
          Service
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Port</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {serviceList.map((value) => (
              <TableRow key={value.id}>
                <TableCell>{value.id}</TableCell>
                <TableCell>{value.name}</TableCell>
                <TableCell>{value.port}</TableCell>
                <TableCell>{value.status}</TableCell>
                <TableCell sx={{ width: "1%", whiteSpace: "nowrap" }}>
                  <ButtonGroup
                    variant="contained"
                    aria-label="Basic button group"
                  >
                    <IconButton onClick={() => onClickStart(value.id)}>
                      <PlayArrowIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => onClickStop(value.id)}>
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

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
import ListAltIcon from "@mui/icons-material/ListAlt";
import EditNoteIcon from "@mui/icons-material/EditNote";
import Paper from "@mui/material/Paper";
import ModuleTitle from "../components/ModuleTitle";
import AddIcon from "@mui/icons-material/Add";
import { useRecoilValue } from "recoil";
import { tableListState } from "../state/atoms";
import { API_TABLE_DELETE } from "../common/constants";

export default function TableList() {
  const tableList = useRecoilValue(tableListState);

  const onClickRemove = async (table: string) => {
    await fetch(API_TABLE_DELETE + table, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((e) => {
      console.error(e);
      alert("Sorry you got error.");
    });
    // TODO update table list on recoil.
  };

  return (
    <Paper elevation={8} sx={{ padding: "24px" }}>
      <ModuleTitle label="Table Manager" />
      <Box sx={{ marginBottom: "8px" }}>
        <Button variant="contained" startIcon={<AddIcon />} href="/table">
          Table
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Table name</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableList.map((value, index) => (
              <TableRow key={index}>
                <TableCell>{value.name}</TableCell>
                <TableCell sx={{ width: "1%", whiteSpace: "nowrap" }}>
                  <ButtonGroup
                    variant="contained"
                    aria-label="Basic button group"
                  >
                    <IconButton href={`/table/${value.name}`}>
                      <ListAltIcon fontSize="small" />
                    </IconButton>
                    <IconButton>
                      <EditNoteIcon fontSize="small" />
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

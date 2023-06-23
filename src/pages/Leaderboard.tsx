import { Box, Button, Container, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SnakeBoard, { BoardState } from "../SnakeBoard";
import WasmInput from "./play/WasmInput";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
import Timestamp from "../Timestamp";
import { EventEnvelope } from "../event";
import EventsDisplay from "../EventsDisplay";
import HistoryTable, { HistoryItem, WinResult } from "../HistoryTable";
import { TextField } from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';

export type SnakeVm = typeof import("snake_vm") | null;

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return { name, calories, fat, carbs, protein };
}

export default function LeaderboardPage() {

  const rows = [
    {
      place: "1st",
      program: "Bucatini V3",
      author: "lukesteensen",
      date: "June 9, 2023",
      file: "bucatini_v3.wasm"
    },
    {
      place: "2nd",
      program: "Worm",
      author: "DominicBurkart",
      date: "June 9, 2023",
      file: "worm.wasm"
    },
    {
      place: "3rd",
      program: "Iroquois Pliskin",
      author: "neuronull",
      date: "June 9, 2023",
      file: "iroquois_pliskin.wasm"
    }
  ];

  return <>
  <Box display="flex"
            justifyContent="center"
            alignItems="center">
    <Box style={{margin: 40}}>
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left"></TableCell>
            <TableCell align="left">Program</TableCell>
            <TableCell align="left">Author</TableCell>
            <TableCell align="left">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.place}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left" style={{width: 0}}>
                {row.place}
              </TableCell>
              <TableCell align="left">
                <a href={`/wasm_files/${row.file}`}>{row.program}</a>
              </TableCell>
              <TableCell align="left">
                <a href={`https://github.com/${row.author}`}>{row.author}</a>
              </TableCell>
              <TableCell align="left">{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Typography sx={{margin: 3}}>Read about how to make it on the leaderboard <a href="/docs/leaderboard.html">here</a></Typography>

    </Box>
  </Box>
    
  </>;
}
import { Box, Button, Container, Paper, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FileInput from "../../FileInput";
import SnakeBoard, { BoardState } from "../../SnakeBoard";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
// import ReactVirtualizedTable from "../../ReactVirutalizedTable";
import Timestamp from "../../Timestamp";
import { EventEnvelope, Event } from "../../event";
import EventsDisplay from "../../EventsDisplay";
import { Link } from "react-router-dom";

export type SnakeVm = typeof import("snake_vm") | null;


export default function DocsPage() {
  return <>
  {/* <Container> */}
    <Box style={{display: "flex", justifyContent: "flex-start"}}>

        {/* navigation */}
        <Box style={{flexGrow: 1}}>
            <Paper sx={{backgroundColor: 'grey.800', margin: 2, padding: 1}}>
                <ul style={{listStyleType: "none"}}>
                    <li><Link to={"/test"}>section 1</Link></li>
                    <li>section 2</li>
                </ul>
                <h1>navigation</h1>
            </Paper>
        </Box>
        {/* navigation */}
        <Box style={{flexGrow: 5}}>
            <Paper sx={{backgroundColor: 'grey.800', margin: 2, padding: 1}}>
                <h1>content</h1>
            </Paper>
        </Box>
    </Box>
    
  </>;
}
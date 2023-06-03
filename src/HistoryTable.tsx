import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


export interface HistoryTableProps {
  items: HistoryItem[],
  setSeed: any,
}

export enum WinResult {
    Red,
    Blue,
    Tie
}

export interface HistoryItem {
    seed: number,
    winner: WinResult,
    reason: string
}

export default function HistoryTable(props: HistoryTableProps) {

    let redWins = 0;
    let blueWins = 0;
    let ties = 0;

    for (let i = 0; i<props.items.length; i += 1) {
        let winner = props.items[i].winner;
        if (winner === WinResult.Red) {
            redWins += 1;
        }
        if (winner === WinResult.Blue) {
            blueWins += 1;
        }
        if (winner === WinResult.Tie) {
            ties += 1;
        }
    }

    return <Box>
    <Box style={{display: "flex", justifyContent: "center"}}>
        <h1 style={{color: "#ff8888", marginLeft: 10, marginRight: 10}}>{redWins}</h1>
        <h1 style={{color: "#424242"}}>|</h1>
        <h1 style={{color: "white", marginLeft: 10, marginRight: 10}}>{ties}</h1>
        <h1 style={{color: "#424242"}}>|</h1>
        <h1 style={{color: "#8888ff", marginLeft: 10, marginRight: 10}}>{blueWins}</h1>
    </Box>
    <TableContainer component={Paper} style={{width: 800, margin: 'auto'}}>
        <Table aria-label="simple table">
        <TableHead>
            <TableRow>
            <TableCell>Seed</TableCell>
            <TableCell>Winner</TableCell>
            <TableCell>Reason</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {props.items.map((row, i) => {
                let winner;

                if (row.winner === WinResult.Tie) {
                    winner = <p style={{color: "white"}}>TIE</p>
                } else if (row.winner === WinResult.Blue) {
                    winner = <p style={{color: "#8888ff", margin: 0}}>BLUE</p>;
                } else {
                    winner = <p style={{color: "#ff8888", margin: 0}}>RED</p>;
                }
                

                return <TableRow
                    key={i}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    style={{height: 20}}
                >
                    <TableCell style={{display:"flex", alignItems: "center"}}>
                        <Button variant="contained" style={{backgroundColor: "#595959"}} sx={{ m: 1 }} onClick={() => {
                            props.setSeed(row.seed);
                        }}>
                            <PlayArrowIcon color="success" />
                        </Button>
                        <p style={{margin: 0}}>{row.seed}</p>
                    </TableCell>
                    <TableCell>{winner}</TableCell>
                    <TableCell><p style={{margin: 0}}>{row.reason}</p></TableCell>
                </TableRow>;
            })}
        </TableBody>
        </Table>
    </TableContainer>
  </Box>;  
}
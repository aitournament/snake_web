import { Box, Button, Container, Paper, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FileInput from "../../FileInput";
import SnakeBoard, { BoardState } from "../../SnakeBoard";
import WasmInput from "./WasmInput";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReplayIcon from '@mui/icons-material/Replay';
// import ReactVirtualizedTable from "../../ReactVirutalizedTable";
import Timestamp from "../../Timestamp";
import { EventEnvelope, Event } from "../../event";
import EventsDisplay, { getSnakeDiedReason } from "../../EventsDisplay";
import HistoryTable, { HistoryItem, WinResult } from "../../HistoryTable";
import { TextField } from "@mui/material";
import CasinoIcon from '@mui/icons-material/Casino';

export type SnakeVm = typeof import("snake_vm") | null;


interface WasmFile {
  filename: string,
  bytes: Uint8Array | null,
}

enum State {
  SelectWasm,
  Play,
}

function getWinReason(events: EventEnvelope[]): string {
  for(let i = 0; i<events.length; i += 1) {
    let event = events[i].event;
    if (event.type == "SNAKE_DIED") {
      return getSnakeDiedReason(event.data);
    }
  }
  return "unknown";
}

export default function PlayPage() {
  const CPU_CYCLES_PER_SEC = 60000;

  let [snakeVm, setSnakeVm] = useState<SnakeVm>(null);
  let [boardState, setBoardState] = useState<BoardState>({
    food: [],
    poison: [],
    snakes: [],
    winner: { type: "pending" },
    timestamp: {
      tick: 0,
      cycleInTick: 0
    }
  });

  let [wasm1, setWasm1] = useState<WasmFile | null>(null);
  let [wasm2, setWasm2] = useState<WasmFile | null>(null);
  let [state, setState] = useState<State>(State.SelectWasm);
  let [running, setRunning] = useState(false);
  let [speed, setSpeed] = useState(1);
  let [events, setEvents] = useState<EventEnvelope[]>([]);
  let [seed, setSeed] = useState<number>(Math.floor(Math.random() * 4294967295));
  let [history, setHistory] = useState<HistoryItem[]>([]);

  function resetBoard() {
    snakeVm!.reset(seed);
    setEvents([]);
    setRunning(false);

    snakeVm!.add_starting_snake(wasm1!.bytes!, 0);
    snakeVm!.add_starting_snake(wasm2!.bytes!, 1);
    setBoardState(snakeVm?.get_state());
    setState(State.Play);

  }

  useEffect(() => {
    let readyToPlay = Boolean(wasm1?.bytes && wasm2?.bytes);
    setHistory([]);
    switch (state) {
      case State.SelectWasm: {
        if (readyToPlay) {
          resetBoard();
        }
        break;
      }
    }
  }, [wasm1, wasm2]);

  useEffect(() => {
    if (snakeVm && wasm1 && wasm2) {
      resetBoard();
    }
  }, [seed, snakeVm, wasm1, wasm2])

  useEffect(() => {
    import('snake_vm').then((snakeVm) => {
      setSnakeVm(snakeVm);

      // for debugging only
      (global as any).snakeVm = snakeVm;
    })
  }, []);

  (global as any).onEvent = (event: EventEnvelope) => {
    // console.log("New event:", event);
    setEvents((prevEvents => [event, ...prevEvents]));
  }



  useEffect(() => {
    let interval: any = null;
    if (running) {
      let refreshDelayMs = 50;
      interval = setInterval(() => {
        let cyclesToRun = (CPU_CYCLES_PER_SEC / (1000 / refreshDelayMs)) * speed;
        snakeVm!.step(cyclesToRun);
        setBoardState(snakeVm!.get_state());

      }, refreshDelayMs);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    }
  }, [running, speed]);

  // Game ended
  useEffect(() => {
    if (boardState.winner.type !== "pending") {
      let winnerId = boardState.winner.type === "tie" ? 0 : boardState.winner.data;
      setRunning(false);

      setHistory((prev) => {
        for(let i = 0; i<prev.length; i += 1) {
          if (prev[i].seed == seed) {
            return prev;
          }
        }

        let new_history = {
          seed: seed,
          winner: boardState.winner.type === "tie" ? WinResult.Tie : winnerId === 0 ? WinResult.Red : WinResult.Blue,
          reason: getWinReason(events)
        };
        return [new_history, ...prev];
      });

    }
  }, [boardState.winner.type]);

  if (!snakeVm) {
    return <Typography>
      Loading Webassembly Module.
    </Typography>
  }

  function setWasm(id: number, filename: string, bytes: Uint8Array | null) {
    setState(State.SelectWasm);
    if (id === 1) {
      setWasm1({ filename: filename, bytes: bytes });
    } else {
      setWasm2({ filename: filename, bytes: bytes });
    }
  }

  let gameIsOver = boardState.winner.type !== "pending";

  return <>
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          m: 5
        }}
      >
        <WasmInput
          editable={true}
          snake_vm={snakeVm}
          color='#ff8888'
          onChange={(filename, bytes) => {
            setWasm(1, filename, bytes);
          }} />
        <Typography
          variant='h5'
          sx={{
            color: 'secondary.main',
            mx: 5
          }}
        >
          VS
        </Typography>
        <WasmInput
          editable={true}
          snake_vm={snakeVm}
          color='#8888ff'
          onChange={(filename, bytes) => {
            setWasm(2, filename, bytes);
          }} />
      </Box>
      {state === State.SelectWasm && <Box>
        <Typography variant="h6" style={{margin: 20}}>Select two WebAssembly files</Typography>
        {/* <hr/> */}
        <Typography variant="body1">Don't have one yet? Try out <a href="https://aitournament.github.io/snake_example/snake_example.wasm">snake_demo.wasm</a></Typography>
        <Typography variant="body1">or read the <a href="/docs">docs</a> to learn how to make your own.</Typography>
        
      </Box>}

      {state === State.Play && <Box>
        <SnakeBoard state={boardState} />
        {boardState.winner.type !== "pending" && <Box sx={{ my: 3 }}>
          {boardState.winner.type === "tie" && <Typography variant="h5">TIE</Typography>}
          {boardState.winner.type === "win" && boardState.winner.data === 0 && <Typography variant="h4" style={{ color: '#ff8888' }}>RED WON</Typography>}
          {boardState.winner.type === "win" && boardState.winner.data === 1 && <Typography variant="h4" style={{ color: '#8888ff' }}>BLUE WON</Typography>}
        </Box>}
        <Box sx={{ my: 3 }}>

          <Button variant="contained" sx={{ m: 1 }} onClick={() => {
            resetBoard();
          }}>
            <ReplayIcon color="info" />
          </Button>
          {!running && !gameIsOver && <Button variant="contained" sx={{ m: 1 }} onClick={() => { setRunning(true); }}>
            <PlayArrowIcon color="success" />
          </Button>}

          {running && <Button variant="contained" sx={{ m: 1 }} onClick={() => { setRunning(false); }}>
            <PauseIcon color="warning" />
          </Button>}

          <ToggleButtonGroup
            value={speed.toString()}
            exclusive
            onChange={(_, speed) => {
              setSpeed(parseInt(speed));
            }}
            aria-label="text alignment"
            size="small"
            sx={{ backgroundColor: "primary.main", m: 1 }}
          >
            <ToggleButton value="1" aria-label="left aligned" style={{ textTransform: 'lowercase' }}>
              <Typography>x1</Typography>
            </ToggleButton>
            <ToggleButton value="2" aria-label="left aligned" style={{ textTransform: 'lowercase' }}>
              <Typography>x2</Typography>
            </ToggleButton>
            <ToggleButton value="5" aria-label="left aligned" style={{ textTransform: 'lowercase' }}>
              <Typography>x5</Typography>
            </ToggleButton>
            <ToggleButton value="10" aria-label="left aligned" style={{ textTransform: 'lowercase' }}>
              <Typography>x10</Typography>
            </ToggleButton>
            <ToggleButton value="25" aria-label="left aligned" style={{ textTransform: 'lowercase' }}>
              <Typography>x25</Typography>
            </ToggleButton>
          </ToggleButtonGroup>

          <Timestamp timestamp={boardState.timestamp} />

          <Box 
          style={{margin: 24}}
          display="flex"
          justifyContent="center"
          alignItems="center"
          >

          <TextField
            id="outlined-basic"
            label="Seed"
            variant="outlined"
            size="small"
            color="secondary"
            value={seed}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              let parsed = parseInt(event.target.value || "0", 10);
              if (!isNaN(parsed) && parsed <= 4294967295) {
                setSeed(parsed);
              }
            }}
            disabled={running}
          />
          <Button
            variant="contained"
            sx={{ m: 1 }}
            style={{display: running ? "none" : "flex"}}
            onClick={() => {
              setSeed(Math.floor(Math.random() * 4294967295))
            }
          }>
            <CasinoIcon color="secondary" />
          </Button>
        </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              m: 5
            }}>
            <EventsDisplay eventEnvelopes={events} />
          </Box>
          <Box>
            <HistoryTable items={history} setSeed={setSeed}/>
          </Box>


        </Box>

      </Box>}





    </Container>
  </>;
}
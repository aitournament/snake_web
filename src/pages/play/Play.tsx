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
import EventsDisplay from "../../EventsDisplay";

export type SnakeVm = typeof import("snake_vm") | null;


interface WasmFile {
  filename: string,
  bytes: Uint8Array | null,
}

enum State {
  SelectWasm,
  Play,
}



export default function PlayPage() {
  const CPU_CYCLES_PER_SEC = 60000;

  let [snakeVm, setSnakeVm] = useState<SnakeVm>(null);
  let [boardState, setBoardState] = useState<BoardState>({
    food: [],
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
  // let [vmClock, setVmClock] = useState(0);
  let [speed, setSpeed] = useState(1);
  let [events, setEvents] = useState<EventEnvelope[]>([]);

  // let readyForStart = Boolean(wasm1 && wasm2);
  function resetBoard() {
    snakeVm!.reset(0);
    setEvents([]);
    setRunning(false);

    snakeVm!.add_starting_snake(wasm1!.bytes!, 0);
    snakeVm!.add_starting_snake(wasm2!.bytes!, 1);
    setBoardState(snakeVm?.get_state());
    setState(State.Play);

  }

  useEffect(() => {
    let readyToPlay = Boolean(wasm1?.bytes && wasm2?.bytes);
    switch (state) {
      case State.SelectWasm: {
        if (readyToPlay) {
          //TODO: allow setting the seed
          resetBoard();
        }
        break;
      }

    }
  }, [wasm1, wasm2]);


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

  useEffect(() => {
    if (boardState.winner.type !== "pending") {
      // console.log("STOP RUNNING: game over: ", boardState.winner);
      setRunning(false);
    }
  }, [boardState]);


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
          color='red'
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
          color='blue'
          onChange={(filename, bytes) => {
            setWasm(2, filename, bytes);
          }} />
      </Box>


      {/* {readyForStart && <Button variant="contained"
        component="label"
        color="secondary"
        sx={{
          fontSize: "30px",
          borderRadius: 2
        }}
        onClick={() => {
          snakeVm?.add_starting_snake(wasm1!.bytes!, 0);
          snakeVm?.add_starting_snake(wasm1!.bytes!, 1);
          setState(State.Play);
          setBoardState(snakeVm?.get_state());
        }}
      >
        START
      </Button>} */}


      {state === State.Play && <Box>
        <SnakeBoard state={boardState} />
        {boardState.winner.type !== "pending" && <Box sx={{ my: 3 }}>
          {boardState.winner.type === "tie" && <Typography variant="h5">TIE</Typography>}
          {boardState.winner.type === "win" && boardState.winner.data === 0 && <Typography variant="h4" style={{ color: 'red' }}>RED WON</Typography>}
          {boardState.winner.type === "win" && boardState.winner.data === 1 && <Typography variant="h4" style={{ color: 'blue' }}>BLUE WON</Typography>}
        </Box>}
        <Box sx={{ my: 3 }}>

          <Button variant="contained" sx={{ m: 1 }} onClick={() => {
            resetBoard();
          }}>
            <ReplayIcon color="info" />
          </Button>
          {!running && <Button variant="contained" sx={{ m: 1 }} onClick={() => { setRunning(true); }}>
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
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              m: 5
            }}>
            <EventsDisplay eventEnvelopes={events} />
          </Box>


        </Box>

      </Box>}





    </Container>
  </>;
}


{/* {snakeVm && numSnakes < 2 &&
          <div>
            <FileInput onChange={(filename, buffer) => {
              try {
                snakeVm?.add_starting_snake(new Uint8Array(buffer), numSnakes);
                setNumSnakes(numSnakes + 1);
                setBoardState(snakeVm?.get_state());

              } catch (e) {
                console.log("Error:", e);
              }
            }}>
              Player {numSnakes + 1} WASM
            </FileInput>
          </div>
        }
        {snakeVm && numSnakes >= 2 && <div>
          <SnakeBoard
            state={boardState}
          />
          <br />
          <Button
            variant='contained'
            onClick={() => {
              // for (let i = 0; i < 60000; i++) {
              snakeVm?.step(60000);
              // }
              setBoardState(snakeVm?.get_state())
            }}
          >
            Play
          </Button>
        </div>} */}
import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Button} from "@material-ui/core";
import FileInput from "./FileInput";
import SnakeBoard, {BoardState} from "./SnakeBoard";

type SnakeVm = typeof import("snake_vm") | null;


function App() {
  let [snakeVm, setSnakeVm] = useState<SnakeVm>(null);
  let [numSnakes, setNumSnakes] = useState(0);
  let [boardState, setBoardState] = useState<BoardState>({
    food: [],
    snakes: [],
  });
  useEffect(() => {
    import('snake_vm').then((snakeVm) => {
      setSnakeVm(snakeVm);
      (global as any).snakeVm = snakeVm;
    })
  }, []);

  return (
      <div className="App">
        {!snakeVm &&
        <div>
          Loading WASM module...
        </div>
        }
        {snakeVm && numSnakes < 2 &&
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
          <br/>
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
        </div>}
      </div>
  );
}

export default App;

import { Box, Container, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FileInput from "./FileInput";
import SnakeBoard, { BoardState } from "./SnakeBoard";
type SnakeVm = typeof import("snake_vm") | null;

export default function PlayPage() {


    let [snakeVm, setSnakeVm] = useState<SnakeVm>(null);
    let [numSnakes, setNumSnakes] = useState(0);
    let [boardState, setBoardState] = useState<BoardState>({
        food: [],
        snakes: [],
    });

    useEffect(() => {
        import('snake_vm').then((snakeVm) => {
            setSnakeVm(snakeVm);

            // for debugging only
            (global as any).snakeVm = snakeVm;
        })
    }, []);


    if (!snakeVm) {
        return <Typography>
            Loading Webassembly Module.
        </Typography>
    }

    return <Container>
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
                m: 5
            }}
        >
            <Box
                sx={{
                    border: 2,
                    borderColor: 'grey.500',
                    borderStyle: "asdf",
                    borderRadius: 3,
                    px: 3,
                    py: 1
                }}>
                <Typography
                    variant='h5'>
                    Player 1
                </Typography>
                <FileInput
                    sx={{m: 2}}
                    onChange={(filename, buffer) => {
                        // try {
                        //     snakeVm?.add_starting_snake(new Uint8Array(buffer), numSnakes);
                        //     setNumSnakes(numSnakes + 1);
                        //     setBoardState(snakeVm?.get_state());

                        // } catch (e) {
                        //     console.log("Error:", e);
                        // }
                    }}>
                    Select WASM File
                </FileInput>
            </Box>
            <Typography
                variant='h5'
                sx={{
                    color: 'secondary.main',
                    mx: 5
                }}
            >
                VS
            </Typography>
            <Typography
                variant='h5'>
                Player 2
            </Typography>
        </Box>

    </Container>;
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
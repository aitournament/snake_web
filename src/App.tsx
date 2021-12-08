import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
// import {Button} from "@material-ui/core";
import FileInput from "./FileInput";
import SnakeBoard, { BoardState } from "./SnakeBoard";
import { AppBar, Box, Button, Container, createTheme, Divider, IconButton, Menu, MenuItem, SvgIcon, Tab, Tabs, ThemeProvider, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoIcon from './img/aitournament.svg';
import { Link } from 'react-router-dom';

type SnakeVm = typeof import("snake_vm") | null;



function App() {
  const theme = createTheme({
    palette: {
      // mode: 'dark',
      primary: {
        // Purple and green play nicely together.
        main: '#2c2c2c',
        dark: '#000000',
        light: '#000000'
      },
      // secondary: {
      //   // This is green.A700 as hex.
      //   main: '#11cb5f',
      // },
    },
  });

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
  const pages = [
    {
      link: "play",
      name: "Play"
    },
    {
      link: "docs",
      name: "Docs"
    },
  ];
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (

    <div className="App">
      <ThemeProvider theme={theme}>
        <AppBar position="static">

          {/* <Container maxWidth="xl"> */}
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: 'flex' }}
            >

              {/* <Box sx={{ flexGrow: 1, display: 'flex' }}> */}
              <svg width="250" height="30">
                <image href="img/aitournament_long_light.svg" width="250" height="30" />
              </svg>
              {/* </Box> */}
            </Typography>

            {/* <Divider orientation="vertical" variant = "middle" flexItem sx={{ borderColor: 'grey.800' }} /> */}
            {pages.map((page) => (
              <Box sx={{
                display: 'flex',
                '& hr': {
                  mx: 3,
                },
              }}>
                <Divider orientation="vertical" variant="middle" flexItem sx={{ borderColor: 'grey.800' }} />
                <Link to={page.link} style={{textDecoration: 'none'}}>
                  <Button
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    <Typography variant="h6">{page.name}</Typography>
                  </Button>
                </Link>

              </Box>
            ))}

          </Toolbar>
          {/* </Container> */}
        </AppBar>
        {!snakeVm &&
          <div>
            Loading WASM module...
          </div>
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
      </ThemeProvider>
    </div>

  );
}

export default App;

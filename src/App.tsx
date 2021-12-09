import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
// import {Button} from "@material-ui/core";
import FileInput from "./FileInput";
import { AppBar, Box, Button, Container, createTheme, Divider, IconButton, Menu, MenuItem, SvgIcon, Tab, Tabs, ThemeProvider, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoIcon from './img/aitournament.svg';
import { Link, Route, Routes } from 'react-router-dom';
import PlayPage from './Play';

// type SnakeVm = typeof import("snake_vm") | null;



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
      secondary: {
        main: '#62B17F'
      },
      text: {
        primary: "#ffffff",
        secondary: "#ffffff",
        disabled: "#ffffff"
      },
    },
    typography: {
      allVariants: {
        color: '#ffffff'
      }
    }
  });

  


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
              <Link to="/" style={{ textDecoration: 'none' }}>
                <svg width="250" height="30">
                  <image href="img/aitournament_long_tea.svg" width="250" height="30" />
                </svg>
              </Link>

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
                <Link to={page.link} style={{ textDecoration: 'none' }}>
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
        <Routes>
          <Route path="/" element={<Typography>HOME</Typography>} />
          <Route path="/play" element={<PlayPage/>} />
          <Route path="/docs" element={<Typography>DOCS</Typography>} />
        </Routes>

        {/* {!snakeVm &&
          <div>
            Loading WASM module...
          </div>
        } */}


        
      </ThemeProvider>
    </div>

  );
}

export default App;

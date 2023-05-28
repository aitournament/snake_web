import React, { useEffect, useState } from 'react';
import './App.css';
import FileInput from "./FileInput";
import { alpha, AppBar, Box, Button, Container, createTheme, Divider, IconButton, Menu, MenuItem, rgbToHex, SvgIcon, Tab, Tabs, ThemeProvider, Toolbar, Typography } from '@mui/material';
import { Link, Route, Routes } from 'react-router-dom';
import PlayPage from './pages/play/Play';

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#404040',
        dark: '#ff0000',
        light: '#ff0000'
      },
      secondary: {
        main: '#62B17F'
      },
      text: {
        primary: "#ffffff",
        secondary: "#ffffff",
        disabled: "#ffffff"
      },
      action: {
        selectedOpacity: 0.25,
        disabled: alpha("#fff", 0.2),
        disabledOpacity: 1.0,
        disabledBackground: alpha("#fff", 0.1),
      }
    },
    typography: {
      allVariants: {
        color: '#ffffff'
      }
    }
  });

  
  const pages = [
    {
      link: "/docs",
      name: "Docs"
    },
  ];

  return (

    <div className="App">
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ mr: 2, display: 'flex' }}
            >
              <Link to="/" style={{ textDecoration: 'none' }}>
                <svg width="250" height="30">
                  <image href="img/aitournament_long_tea.svg" width="250" height="30" />
                </svg>
              </Link>
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
                <a href={page.link} style={{ textDecoration: 'none' }}>
                  <Button
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    <Typography variant="h6">{page.name}</Typography>
                  </Button>
                </a>

              </Box>
            ))}

          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<PlayPage/>} />
        </Routes>        
      </ThemeProvider>
    </div>

  );
}

export default App;

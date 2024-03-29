import React from 'react'
import './App.css'
import CarList from './components/CarList'

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <div className="App">
      <AppBar position="static" className="app-bar">
        <Toolbar>
          <Typography variant="h6" component="div">
            Carshop
          </Typography>
        </Toolbar>
      </AppBar>
      <CarList />
    </div>
  );
}

export default App

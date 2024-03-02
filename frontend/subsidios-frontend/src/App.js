import logo from './logo.svg';
import './App.css';
import React from 'react';
import Registro from './Registro';
import Login from './Login';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
            <h1>Registro</h1>
            <Registro />
            <h1>Login</h1>
            <Login />
        </div>
      </header>
    </div>
  );
}

export default App;

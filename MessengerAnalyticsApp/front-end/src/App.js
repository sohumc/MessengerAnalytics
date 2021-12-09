import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';


function App() {
  const [placeholder, setPlaceholder] = useState('Hi');

  useEffect(() => {
    
    fetch('/api/contentType/theforgereturns_7kjmx7d_da').then(res => res.json()).then(
      data => {
      setPlaceholder(JSON.stringify(data));
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p>Flask says {placeholder}</p>
      </header>
    </div>
  );
}

export default App;

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter } from "react-router-dom";
import {AppRouter} from "./Router"
import axios from "axios";
import { Button } from '@mui/material';

function App() {
  const [count, setCount] = useState(0);

  const handleDownloadReport = async() => {
    try{
      const response = await axios.get("http://localhost:3000/report/sdownload")
      const blob = response.data;
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url
      a.download = "reporte_pagos.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.appendChild(a);
    }catch(error){
      console.error(error);
    }
  }

  return (
    <>
    {/* <BrowserRouter>
      <AppRouter/>
    </BrowserRouter>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
      <Button onClick={handleDownloadReport}>Descargar reporte</Button>
    </>
  )
}

export default App

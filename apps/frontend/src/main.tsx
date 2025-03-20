import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import {BrowserRouter} from "react-router-dom"
import {QueryProvider} from "./lib/queries.tsx"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
      <App />
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>,
)

import React from 'react'
import Timer from './components/Timer'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

function App() {
  return (
    <ThemeProvider>
      <Timer/>
    </ThemeProvider>
  )
}

export default App

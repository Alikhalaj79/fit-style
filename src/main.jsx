import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import "./styles/index.css"
import "./styles/fonts.css"
import { ThemeProvider } from '@mui/material'
import theme from './mui/theme'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
  <ThemeProvider theme={theme}>
    <App />
  </ThemeProvider>
  </>,
)

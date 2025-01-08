import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoute from './routes/AppRoutes'

function App() {
  return (
    <Router>
      <AppRoute />
    </Router>
  )
}

export default App

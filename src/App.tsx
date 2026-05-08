import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import './App.css'

import { AppShell } from './layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route
            index
            element={<Navigate to="/dashboard" replace />}
          />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

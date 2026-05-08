import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import 'ag-grid-community/styles/ag-theme-balham.css'

import App from './App.tsx'
import './index.css'

ModuleRegistry.registerModules([AllCommunityModule])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

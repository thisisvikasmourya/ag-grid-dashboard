import { useEffect, useRef, useState } from 'react'

import type { DashboardRow } from '../data/dashboardRows'
import { DASHBOARD_ROW_DATA } from '../data/dashboardRows'

import { applyLiveSampleTick } from '../lib/liveRowSimulation'

const DEFAULT_INTERVAL_MS = 1200

export function useLiveDashboardRows(intervalMs = DEFAULT_INTERVAL_MS): {
  rowData: DashboardRow[]
  lastUpdated: Date
  currentTick: number
  updatesPerMinute: number
} {
  const [rowData, setRowData] = useState<DashboardRow[]>(() =>
    DASHBOARD_ROW_DATA.map((r) => ({ ...r })),
  )
  const [lastUpdated, setLastUpdated] = useState(() => new Date())
  const [currentTick, setCurrentTick] = useState(0)
  const tickRef = useRef(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      tickRef.current += 1
      setCurrentTick(tickRef.current)
      setRowData((prev) => applyLiveSampleTick(prev, tickRef.current))
      setLastUpdated(new Date())
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])

  return {
    rowData,
    lastUpdated,
    currentTick,
    updatesPerMinute: Math.round(60_000 / intervalMs),
  }
}

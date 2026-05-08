import type { GridApi, GridReadyEvent } from 'ag-grid-community'
import type { CSSProperties } from 'react'
import { useEffect, useRef } from 'react'

import { AgGridReact } from 'ag-grid-react'

import type { DashboardRow } from '../data/dashboardRows'

import { useDashboardGridModel } from '../hooks/useDashboardGridModel'

const gridContainerStyle = {
  width: '100%',
  height: '100%',
} satisfies CSSProperties

type DashboardGridProps = {
  rowData: DashboardRow[]
  quickFilterText: string
  gridThemeClass: 'ag-theme-quartz-dark' | 'ag-theme-quartz' | 'ag-theme-balham-dark'
}

export function DashboardGrid({
  rowData,
  quickFilterText,
  gridThemeClass,
}: DashboardGridProps) {
  const { columnDefs, defaultColDef, gridOptions } = useDashboardGridModel()

  const gridApiRef = useRef<GridApi<DashboardRow> | null>(null)

  useEffect(() => {
    const onResize = () => gridApiRef.current?.sizeColumnsToFit()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onGridReady = (event: GridReadyEvent<DashboardRow>) => {
    gridApiRef.current = event.api
    event.api.sizeColumnsToFit()
  }

  return (
    <div
      className={`${gridThemeClass} dash-grid-wrap`}
      role="presentation"
    >
      <AgGridReact<DashboardRow>
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowData={rowData}
        quickFilterText={quickFilterText}
        gridOptions={gridOptions}
        containerStyle={gridContainerStyle}
        onGridReady={onGridReady}
      />
    </div>
  )
}

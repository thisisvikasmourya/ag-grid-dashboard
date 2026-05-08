import { useMemo } from 'react'

import type { ColDef, GridOptions } from 'ag-grid-community'

import type { DashboardRow } from '../data/dashboardRows'

const usdWhole = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatUsd(value: number): string {
  return usdWhole.format(value)
}

const mediumDate = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

function formatIsoDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(d.getTime())) return isoDate
  return mediumDate.format(d)
}

function buildColumnDefs(): ColDef<DashboardRow>[] {
  return [
    {
      colId: 'selection',
      width: 52,
      maxWidth: 52,
      pinned: 'left',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      suppressNavigable: true,
      sortable: false,
      filter: false,
      floatingFilter: false,
      resizable: false,
    },
    {
      field: 'accountName',
      headerName: 'Account',
      minWidth: 200,
      flex: 2,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'segment',
      headerName: 'Segment',
      minWidth: 130,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'region',
      headerName: 'Region',
      minWidth: 110,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'revenueYtdUsd',
      headerName: 'Revenue YTD',
      filter: 'agNumberColumnFilter',
      minWidth: 140,
      type: 'rightAligned',
      valueFormatter: (p) =>
        typeof p.value === 'number' ? formatUsd(p.value) : '',
    },
    {
      field: 'growthPct',
      headerName: 'YoY growth',
      filter: 'agNumberColumnFilter',
      minWidth: 130,
      type: 'rightAligned',
      valueFormatter: (p) =>
        typeof p.value === 'number'
          ? `${p.value >= 0 ? '+' : ''}${p.value.toFixed(1)}%`
          : '',
    },
    {
      field: 'lastInvoiceDate',
      headerName: 'Last invoice',
      filter: 'agTextColumnFilter',
      minWidth: 145,
      valueFormatter: (p) =>
        typeof p.value === 'string' ? formatIsoDate(p.value) : '',
      comparator: (a, b) => {
        const ta =
          typeof a === 'string' ? new Date(`${a}T00:00:00`).getTime() : 0
        const tb =
          typeof b === 'string' ? new Date(`${b}T00:00:00`).getTime() : 0
        return ta - tb
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
      filter: 'agTextColumnFilter',
      cellClassRules: {
        'dash-cell-status--active': (p) => p.data?.status === 'Active',
        'dash-cell-status--risk': (p) => p.data?.status === 'At risk',
        'dash-cell-status--churned': (p) => p.data?.status === 'Churned',
        'dash-cell-status--pending': (p) => p.data?.status === 'Pending',
      },
    },
  ]
}

function getDashboardRowId(params: { data: DashboardRow }): string {
  return params.data.id
}

/** Grid options tuned for client-side datasets: pagination reduces DOM work per view. */
const baseGridOptions: GridOptions<DashboardRow> = {
  animateRows: true,
  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [10, 20, 50, 100],
  rowSelection: 'multiple',
  suppressRowClickSelection: true,
  enableCellTextSelection: true,
  ensureDomOrder: true,
  getRowId: getDashboardRowId,
}

export function useDashboardGridModel(): {
  columnDefs: ColDef<DashboardRow>[]
  defaultColDef: ColDef<DashboardRow>
  gridOptions: GridOptions<DashboardRow>
} {
  const columnDefs = useMemo(() => buildColumnDefs(), [])

  const defaultColDef = useMemo(
    (): ColDef<DashboardRow> => ({
      sortable: true,
      filter: true,
      resizable: true,
      floatingFilter: true,
      enableCellChangeFlash: true,
      minWidth: 140,
    }),
    [],
  )

  const gridOptions = useMemo((): GridOptions<DashboardRow> => {
    return { ...baseGridOptions }
  }, [])

  return {
    columnDefs,
    defaultColDef,
    gridOptions,
  }
}

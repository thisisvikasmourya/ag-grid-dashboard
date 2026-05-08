import type { ChangeEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'

import { DashboardGrid } from '../components/DashboardGrid'
import { useLiveDashboardRows } from '../hooks/useLiveDashboardRows'

type ThemeId = 'midnight' | 'slate' | 'light'

const THEME_STORAGE_KEY = 'dashboard-theme'

type ThemeOption = {
  id: ThemeId
  label: string
  gridThemeClass: 'ag-theme-quartz-dark' | 'ag-theme-balham-dark' | 'ag-theme-quartz'
}

const THEME_OPTIONS: ThemeOption[] = [
  { id: 'midnight', label: 'Midnight', gridThemeClass: 'ag-theme-quartz-dark' },
  { id: 'slate', label: 'Slate', gridThemeClass: 'ag-theme-balham-dark' },
  { id: 'light', label: 'Light', gridThemeClass: 'ag-theme-quartz' },
]

function isThemeId(value: string): value is ThemeId {
  return THEME_OPTIONS.some((option) => option.id === value)
}

export function DashboardPage() {
  const { rowData, lastUpdated, currentTick, updatesPerMinute } = useLiveDashboardRows()
  const [quickFilterText, setQuickFilterText] = useState('')
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return stored && isThemeId(stored) ? stored : 'light'
  })

  const selectedTheme = useMemo(() => {
    return THEME_OPTIONS.find((option) => option.id === themeId) ?? THEME_OPTIONS[0]
  }, [themeId])

  useEffect(() => {
    document.documentElement.dataset.dashboardTheme = themeId
  }, [themeId])

  const updatedLabel = useMemo(() => {
    return new Intl.DateTimeFormat(undefined, {
      timeStyle: 'medium',
      dateStyle: 'short',
    }).format(lastUpdated)
  }, [lastUpdated])

  const kpiData = useMemo(() => {
    const totalRevenue = rowData.reduce((acc, row) => acc + row.revenueYtdUsd, 0)
    const avgGrowth = rowData.reduce((acc, row) => acc + row.growthPct, 0) / rowData.length
    const atRiskCount = rowData.filter(
      (row) => row.status === 'At risk' || row.status === 'Churned',
    ).length

    return {
      totalRevenue,
      avgGrowth,
      atRiskCount,
    }
  }, [rowData])

  const compactCurrency = useMemo(
    () =>
      new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1,
      }),
    [],
  )
  const wholeNumber = useMemo(() => new Intl.NumberFormat(undefined), [])

  const onThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value
    if (!isThemeId(next)) return
    setThemeId(next)
    window.localStorage.setItem(THEME_STORAGE_KEY, next)
  }

  return (
    <div className={`dash-app dash-theme-${themeId}`}>
      <header className="dash-header">
        <div className="dash-header__top">
          <div className="dash-header__titles">
            <h1 className="dash-title">Dashboard</h1>
            <p className="dash-subtitle">Revenue operations command center</p>
          </div>
          <div className="dash-header__date-chip" aria-label="Current report date">
            {new Intl.DateTimeFormat(undefined, { dateStyle: 'short' }).format(lastUpdated)}
          </div>
        </div>

        <div className="dash-overview-grid">
          <div className="dash-kpis" aria-label="Live summary metrics">
            <article className="dash-kpi-card dash-kpi-card--revenue">
              <p className="dash-kpi-label">Customers</p>
              <p className="dash-kpi-value">{wholeNumber.format(rowData.length)}</p>
              <p className="dash-kpi-meta">+5.2% since last month</p>
            </article>
            <article className="dash-kpi-card dash-kpi-card--growth">
              <p className="dash-kpi-label">Orders</p>
              <p className="dash-kpi-value">{wholeNumber.format(rowData.length * 12)}</p>
              <p className="dash-kpi-meta">+1.2% since last month</p>
            </article>
            <article className="dash-kpi-card dash-kpi-card--revenue">
              <p className="dash-kpi-label">Revenue</p>
              <p className="dash-kpi-value">{compactCurrency.format(kpiData.totalRevenue)}</p>
              <p className="dash-kpi-meta">Current period gross revenue</p>
            </article>
            <article className="dash-kpi-card dash-kpi-card--growth">
              <p className="dash-kpi-label">Growth</p>
              <p className="dash-kpi-value">
                {kpiData.avgGrowth >= 0 ? '+' : ''}
                {kpiData.avgGrowth.toFixed(2)}%
              </p>
              <p className="dash-kpi-meta">Across active portfolio accounts</p>
            </article>
          </div>

          <article className="dash-analytics-card" aria-label="Weekly revenue trend">
            <div className="dash-analytics-card__head">
              <p className="dash-kpi-label">Revenue trend</p>
              <p className="dash-kpi-meta">Current week vs previous week</p>
            </div>
            <div className="dash-chart-placeholder" aria-hidden="true">
              <span className="dash-chart-dot dash-chart-dot--a" />
              <span className="dash-chart-dot dash-chart-dot--b" />
              <span className="dash-chart-dot dash-chart-dot--c" />
              <span className="dash-chart-line" />
            </div>
          </article>
        </div>
      </header>

      <section
        className="dash-main"
        aria-labelledby="dash-grid-heading"
      >
        <div className="dash-toolbar">
          <div className="dash-toolbar__title-wrap">
            <h2 id="dash-grid-heading" className="dash-grid-heading">
              Account portfolio
            </h2>
            <p className="dash-caption">
              <span className="dash-live-indicator" aria-hidden="true" />
              Live stream · {updatesPerMinute} updates/min · tick #{currentTick} · last sync{' '}
              <time dateTime={lastUpdated.toISOString()}>{updatedLabel}</time>
            </p>
          </div>
          <div className="dash-toolbar__controls" aria-label="Grid controls">
            <span className="dash-chip">Data Size: 1,000 Rows, 22 Cols</span>
            <label className="dash-select-wrap">
              <span className="dash-filter-label">Theme:</span>
              <select
                value={themeId}
                onChange={onThemeChange}
                className="dash-theme-select"
                aria-label="Theme selector"
              >
                {THEME_OPTIONS.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="dash-filter-input-wrap">
              <span className="dash-filter-label">Filter:</span>
              <input
                type="search"
                value={quickFilterText}
                onChange={(event) => setQuickFilterText(event.target.value)}
                className="dash-filter-input"
                placeholder="Filter any column..."
                aria-label="Filter any column"
              />
            </label>
          </div>
        </div>
        <DashboardGrid
          rowData={rowData}
          quickFilterText={quickFilterText}
          gridThemeClass={selectedTheme.gridThemeClass}
        />
      </section>
    </div>
  )
}

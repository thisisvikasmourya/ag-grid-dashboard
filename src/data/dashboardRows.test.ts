import { describe, expect, it } from 'vitest'

import {
  type AccountStatus,
  type DashboardRow,
  DASHBOARD_ROW_DATA,
} from './dashboardRows'

const STATUSES: ReadonlyArray<AccountStatus> = [
  'Active',
  'At risk',
  'Churned',
  'Pending',
]

function isDashboardRow(entry: DashboardRow): boolean {
  if (typeof entry.id !== 'string' || entry.id.length === 0) return false
  if (typeof entry.accountName !== 'string' || entry.accountName === '')
    return false
  if (typeof entry.segment !== 'string' || entry.segment === '') return false
  if (typeof entry.region !== 'string' || entry.region === '') return false
  if (typeof entry.revenueYtdUsd !== 'number' || Number.isNaN(entry.revenueYtdUsd))
    return false
  if (typeof entry.growthPct !== 'number' || Number.isNaN(entry.growthPct))
    return false
  if (typeof entry.lastInvoiceDate !== 'string') return false
  if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.lastInvoiceDate)) return false
  return STATUSES.includes(entry.status)
}

describe('dashboard sample data', () => {
  it('exports exactly twenty rows', () => {
    expect(DASHBOARD_ROW_DATA).toHaveLength(20)
  })

  it('uses stable unique ids matching row content contract', () => {
    const ids = DASHBOARD_ROW_DATA.map((r) => r.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(DASHBOARD_ROW_DATA.length)
  })

  it('satisfies the DashboardRow contract for each entry', () => {
    expect(DASHBOARD_ROW_DATA.every(isDashboardRow)).toBe(true)
  })
})

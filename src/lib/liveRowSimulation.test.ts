import { describe, expect, it } from 'vitest'

import { DASHBOARD_ROW_DATA } from '../data/dashboardRows'

import { applyLiveSampleTick } from './liveRowSimulation'

describe('applyLiveSampleTick', () => {
  it('preserves ids and row count', () => {
    const copy = DASHBOARD_ROW_DATA.map((r) => ({ ...r }))
    const next = applyLiveSampleTick(copy, 1)
    expect(next).toHaveLength(DASHBOARD_ROW_DATA.length)
    expect(next.map((r) => r.id)).toEqual(DASHBOARD_ROW_DATA.map((r) => r.id))
  })

  it('keeps revenue positive and growth within bounds', () => {
    const next = applyLiveSampleTick(DASHBOARD_ROW_DATA.map((r) => ({ ...r })), 3)
    for (const row of next) {
      expect(row.revenueYtdUsd).toBeGreaterThanOrEqual(25_000)
      expect(row.growthPct).toBeGreaterThanOrEqual(-99.9)
      expect(row.growthPct).toBeLessThanOrEqual(99.9)
    }
  })
})

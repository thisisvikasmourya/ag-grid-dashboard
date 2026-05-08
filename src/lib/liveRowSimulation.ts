import type { DashboardRow } from '../data/dashboardRows'

function mixSeed(id: string, tick: number, salt: string): number {
  let h = tick ^ (salt.length * 0x9e37_79b1)
  for (let i = 0; i < id.length; i++) {
    h = Math.imul(31, h) ^ id.charCodeAt(i)
  }
  for (let i = 0; i < salt.length; i++) {
    h = Math.imul(37, h) ^ salt.charCodeAt(i)
  }
  return h >>> 0
}

/**
 * Simulates refreshed finance metrics so the grid can update on an interval without
 * a websocket (assignment-friendly). Values stay bounded and ids are preserved.
 */
export function applyLiveSampleTick(
  rows: ReadonlyArray<DashboardRow>,
  tick: number,
): DashboardRow[] {
  return rows.map((row) => {
    const rMix = mixSeed(row.id, tick, 'rev')
    const gMix = mixSeed(row.id, tick, 'gr')
    const sMix = mixSeed(row.id, tick, 'st')
    const touched = sMix % 100 < 48
    const revenueDelta = (rMix % 5001) - 2000
    const growthNudge = ((gMix % 11) - 5) * 0.04
    const nextRevenue = Math.max(25_000, Math.round(row.revenueYtdUsd + revenueDelta))
    const nextGrowth = Number(
      Math.min(99.9, Math.max(-99.9, row.growthPct + growthNudge)).toFixed(1),
    )

    const nextStatus: DashboardRow['status'] =
      nextGrowth < -7 ? 'Churned' : nextGrowth < -1.5 ? 'At risk' : nextGrowth < 1.5 ? 'Pending' : 'Active'

    if (!touched) {
      return row
    }

    return {
      ...row,
      revenueYtdUsd: nextRevenue,
      growthPct: nextGrowth,
      status: nextStatus,
    }
  })
}

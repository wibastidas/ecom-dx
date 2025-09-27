/**
 * Determina el nivel financiero basado en ROAS
 * @param roas - Return on Ad Spend
 * @returns 'critical' | 'fragile' | 'strong' | null
 */
export function financeLevel(roas: number | null): 'critical' | 'fragile' | 'strong' | null {
  if (!Number.isFinite(roas as number)) return null;
  if (roas! < 1) return "critical";
  if (roas! <= 2) return "fragile";   // 2.00 es frágil
  return "strong";                     // solo > 2 es sólido
}

/**
 * A percentage written with the interface language's decimal separator ("61,8%" in pt-BR, "61.8%"
 * in en), at most one decimal. `value` is already a percentage: 50 reads "50%", not 5000%.
 */
export function formatPercent(value: number, language: string): string {
  return new Intl.NumberFormat(language, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value / 100);
}

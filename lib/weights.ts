/** Вага розділу за програмою: «13–17%», «3,5–4,5%», «4%» → межі й середина діапазону. */
export function parseWeight(weight: string): { min: number; max: number; mid: number } {
  const numbers = weight
    .replace(/%/g, "")
    .split(/[–—-]/)
    .map((part) => Number.parseFloat(part.trim().replace(",", ".")))
    .filter((value) => Number.isFinite(value));
  const min = numbers[0] ?? 0;
  const max = numbers[1] ?? min;
  return { min, max, mid: (min + max) / 2 };
}

/** Частки розділів (середина діапазону), нормалізовані до 100%, — для кільцевої діаграми. */
export function normalizedShares(weights: string[]): number[] {
  const mids = weights.map((weight) => parseWeight(weight).mid);
  const total = mids.reduce((sum, value) => sum + value, 0) || 1;
  return mids.map((value) => (value / total) * 100);
}

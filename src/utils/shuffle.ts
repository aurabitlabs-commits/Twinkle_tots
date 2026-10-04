export function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pickRandom<T>(arr: T[], count: number, exclude?: T): T[] {
  const filtered = exclude !== undefined ? arr.filter((x) => x !== exclude) : arr;
  return shuffle(filtered).slice(0, count);
}

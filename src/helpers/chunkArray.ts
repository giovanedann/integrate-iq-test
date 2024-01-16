export function chunkArray<T>(bigArray: T[], chunkSize: number): T[][] {
  const result: T[][] = [];

  for (let i = 0; i < bigArray.length; i += chunkSize) {
    result.push(bigArray.slice(i, i + chunkSize));
  }

  return result;
}
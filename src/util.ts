export function flatten (obj: object): unknown[] {
  const array: unknown[] = [];
  for (const value of Array.isArray(obj) ? obj : Object.values(obj)) {
    if (typeof value !== 'object' || value === null) array.push(value);
    else array.push(...flatten(value));
  }
  return array;
}

export function maxPrecision (n: number, maxDigits = 2): number {
  const factor = 1 * (10 ** maxDigits);
  const int = Math.round(n * factor);
  return int / factor;
}

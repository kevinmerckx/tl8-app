export function unique<T>(
  array: Array<T>,
  equalFn: (a: T, b: T) => boolean
): T[] {
  return array.reduce((prev, curr) => {
    if (prev.some((c) => equalFn(c, curr))) {
      return prev;
    }
    return [...prev, curr];
  }, [] as T[]);
}

export const uniqueStrings = (array: string[]) =>
  unique(array, (a, b) => a === b);

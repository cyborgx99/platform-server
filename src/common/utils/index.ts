export function omitKeyInObject<T, K extends keyof T>(
  key: K,
  obj: T,
): Omit<T, K> {
  const { [key]: _omitted, ...rest } = obj;
  return rest;
}

export function omitKeysInObject<T, K extends keyof T>(
  keys: K[],
  obj: T,
): Omit<T, K> {
  return keys.reduce((accumulator, key) => {
    const { [key]: _omitted, ...rest } = accumulator;
    return rest;
  }, obj);
}

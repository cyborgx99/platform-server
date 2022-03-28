export function omitKeyInObject<T, K extends keyof T>(key: K, obj: T) {
  const { [key]: _omitted, ...rest } = obj;
  return rest;
}

export function stringifyData(data: any) {
  return JSON.stringify(
    data,
    (key, value) =>
      typeof value === 'bigint' ? value.toString() + 'n' : value, // Handles big ints
  );
}

export function parseData(jsonString: string) {
  return JSON.parse(
    jsonString,
    (key, value) =>
      typeof value === 'string' && value.match(/^\d+n$/)
        ? BigInt(value.slice(0, -1))
        : value, // Decodes the big ints we encoded before
  );
}

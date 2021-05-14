export function isCamelCase(s: string) {
  return !!s.match(/^[a-z][A-Za-z0-9]*$/);
}

export function isPascalCase(s: string) {
  return !!s.match(/^[A-Z][A-Za-z0-9]*$/);
}

export function isHookName(name: string) {
  return /^use[A-Z0-9].*$/.test(name);
}

export function isInvalidHandlerName(name: string) {
  return name.match(/^on[A-Z]/);
}

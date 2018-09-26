export function debugLog(obj) {
  if (!isProduction()) {
    console.log(obj)
  }
}

export function isProduction() {
  return process.env.NODE_ENV === "production"
}


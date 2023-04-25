import runes from "runes";

export function toDateString(date: Date) {
  return date.toISOString().split("T")[0];
}

export function trimString(s: string, maxLength: number): string {
  const trimmed = runes.substr(s, 0, maxLength);
  return trimmed !== s ? trimmed + "..." : trimmed;
}

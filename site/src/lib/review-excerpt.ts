const DEFAULT_MAX_LENGTH = 180;

export function createReviewExcerpt(text: string, maxLength = DEFAULT_MAX_LENGTH): string {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (normalized.length <= maxLength) return normalized;

  const cutoff = normalized.lastIndexOf(" ", maxLength);
  const end = cutoff >= Math.floor(maxLength * 0.7) ? cutoff : maxLength;
  return `${normalized.slice(0, end).trimEnd()}…`;
}

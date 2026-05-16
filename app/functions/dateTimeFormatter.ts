export function formatSqliteUtcToLocal(utcTimestamp: string) {
  const normalized = utcTimestamp.includes("T")
    ? utcTimestamp
    : utcTimestamp.replace(" ", "T");

  const hasTimezone = /[zZ]|[+-]\d{2}:?\d{2}$/.test(normalized);
  const isoString = hasTimezone ? normalized : `${normalized}Z`;
  const parsed = new Date(isoString);

  if (Number.isNaN(parsed.getTime())) {
    return utcTimestamp;
  }

  return parsed.toLocaleString();
}

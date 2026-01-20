export type DateInput = string | number | Date | null | undefined;

export function parseUtcDate(input: DateInput): Date | null {
  if (!input) return null;
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input;

  const raw = String(input).trim();
  if (!raw) return null;

  const spaceFormat = raw.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?$/
  );
  if (spaceFormat) {
    const [, y, m, d, hh, mm, ss = "0", ms = "0"] = spaceFormat;
    const date = new Date(
      Date.UTC(
        Number(y),
        Number(m) - 1,
        Number(d),
        Number(hh),
        Number(mm),
        Number(ss),
        Number(ms.padEnd(3, "0"))
      )
    );
    return isNaN(date.getTime()) ? null : date;
  }

  const hasTimezone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(raw);
  if (!hasTimezone && /^\d{4}-\d{2}-\d{2}T/.test(raw)) {
    const date = new Date(`${raw}Z`);
    return isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(raw);
  return isNaN(date.getTime()) ? null : date;
}

export function formatLocalDate(input: DateInput): string {
  const date = parseUtcDate(input);
  if (!date) return "";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export function formatLocalTime(input: DateInput): string {
  const date = parseUtcDate(input);
  if (!date) return "";

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatLocalDateTime(input: DateInput): string {
  const date = parseUtcDate(input);
  if (!date) return "";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

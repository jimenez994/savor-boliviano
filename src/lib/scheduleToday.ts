/**
 * Whether a schedule row's `day` label is "today" in the user's timezone.
 * Matches weekday names in English or Spanish (covers DB defaults and i18n labels).
 */
export function isScheduleDayToday(
  dayLabel: string,
  options?: { now?: Date; locale?: string }
): boolean {
  const now = options?.now ?? new Date();
  const normalized = dayLabel.trim().toLowerCase();
  if (!normalized) return false;

  const preferred =
    options?.locale === 'es'
      ? (['es-ES', 'en-US'] as const)
      : (['en-US', 'es-ES'] as const);

  const candidates = new Set<string>();
  for (const tag of preferred) {
    candidates.add(now.toLocaleDateString(tag, { weekday: 'long' }).toLowerCase());
  }

  return candidates.has(normalized);
}

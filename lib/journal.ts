export type JournalEntry = {
  id: string;
  title: string | null;
  body: string;
  mood: string | null;
  tags: string[];
  ai_shareable: boolean;
  entry_date: string; // yyyy-mm-dd
  created_at: string;
  updated_at: string;
};

export const MOODS = [
  { value: "rough", label: "Rough", emoji: "🌧️" },
  { value: "low", label: "Low", emoji: "☁️" },
  { value: "okay", label: "Okay", emoji: "⛅" },
  { value: "good", label: "Good", emoji: "🌤️" },
  { value: "bright", label: "Bright", emoji: "☀️" },
] as const;

export function moodMeta(value: string | null) {
  return MOODS.find((m) => m.value === value) ?? null;
}

export function formatEntryDate(d: string): string {
  // d is yyyy-mm-dd; render in a friendly, locale-aware way without TZ drift.
  const [y, m, day] = d.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, day ?? 1);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function snippet(body: string, max = 140): string {
  const clean = body.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
}

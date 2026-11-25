export type CheckIn = {
  id: string;
  overall_mood: number | null;
  emotions: string[];
  intensity: number | null;
  stress_level: number | null;
  energy_level: number | null;
  note: string | null;
  need: string | null;
  created_at: string;
};

// 1–5 mood scale, shown as gentle labels (not clinical scores).
export const MOOD_SCALE = [
  { value: 1, label: "Rough", emoji: "🌧️" },
  { value: 2, label: "Low", emoji: "☁️" },
  { value: 3, label: "Okay", emoji: "⛅" },
  { value: 4, label: "Good", emoji: "🌤️" },
  { value: 5, label: "Bright", emoji: "☀️" },
] as const;

// A gentle, non-clinical emotion palette for multi-select.
export const EMOTIONS = [
  "Calm",
  "Content",
  "Grateful",
  "Hopeful",
  "Happy",
  "Peaceful",
  "Tired",
  "Stressed",
  "Anxious",
  "Sad",
  "Frustrated",
  "Lonely",
  "Overwhelmed",
  "Numb",
] as const;

export const SCALE_1_5 = [1, 2, 3, 4, 5] as const;

export function moodScaleMeta(value: number | null) {
  return MOOD_SCALE.find((m) => m.value === value) ?? null;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

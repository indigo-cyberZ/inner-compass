// Real-life practice experiments — small, optional "try this" nudges a user
// chooses, then reflects on. No streaks, no scoring; the goal is self-trust,
// not flawless behavior.

export const EXPERIMENT_THEMES = [
  { key: "preference", label: "Preferences", emoji: "🎨" },
  { key: "boundary", label: "Boundaries", emoji: "🚧" },
  { key: "decision", label: "Deciding", emoji: "🧭" },
  { key: "value", label: "Values", emoji: "✨" },
  { key: "emotion", label: "Emotions", emoji: "🌊" },
  { key: "relationship", label: "Relationships", emoji: "🤝" },
  { key: "selfcompassion", label: "Self-kindness", emoji: "💛" },
  { key: "rest", label: "Rest", emoji: "🌿" },
  { key: "faith", label: "Faith (optional)", emoji: "🕊️" },
] as const;

export type ExperimentTheme = (typeof EXPERIMENT_THEMES)[number]["key"];

export function themeMeta(key?: string) {
  return EXPERIMENT_THEMES.find((t) => t.key === key) ?? null;
}

export const EXPERIMENT_SUGGESTIONS: { prompt: string; theme: ExperimentTheme }[] =
  [
    {
      prompt: "Express a small preference today without over-explaining it.",
      theme: "preference",
    },
    {
      prompt: "Order or choose exactly what you actually want, just once.",
      theme: "preference",
    },
    {
      prompt: "Practice one small, respectful boundary — a 'no', or 'I need a little time'.",
      theme: "boundary",
    },
    {
      prompt: "Make one small decision on your own, without seeking reassurance.",
      theme: "decision",
    },
    {
      prompt: "Do one small thing that reflects a value you care about.",
      theme: "value",
    },
    {
      prompt:
        "When a strong feeling rises, pause and name it before reacting — then journal a line about it.",
      theme: "emotion",
    },
    {
      prompt:
        "Notice one relationship: does it feel roughly reciprocal? Just observe — no conclusions needed.",
      theme: "relationship",
    },
    {
      prompt:
        "Catch one self-critical thought and offer yourself the kinder words you'd give a friend.",
      theme: "selfcompassion",
    },
    {
      prompt: "Let yourself rest for ten minutes without earning it first.",
      theme: "rest",
    },
    {
      prompt:
        "Ponder one gospel principle or scripture that speaks to you, and notice how it sits with you.",
      theme: "faith",
    },
  ];

export type ExperimentData = {
  prompt: string;
  theme?: string;
  status: "active" | "reflected" | "released";
  reflection?: string;
};

export type ExperimentRow = {
  id: string;
  data: ExperimentData;
  created_at: string;
  updated_at: string;
};

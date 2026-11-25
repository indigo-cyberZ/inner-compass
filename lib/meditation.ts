// Meditation & mindfulness — text-guided practices. No claims that meditation
// treats or cures any condition; these are for calm and present-moment
// attention. Nothing is saved (no streaks, no pressure).

export type Practice = {
  slug: string;
  title: string;
  kind: string;
  blurb: string;
  minutes: string;
  href: string;
};

export const PRACTICES: Practice[] = [
  {
    slug: "breathing",
    title: "Guided breathing",
    kind: "Breath",
    blurb: "A gentle visual pacer for a few slow, steadying breaths.",
    minutes: "1–5 min",
    href: "/meditate/breathing",
  },
  {
    slug: "grounding",
    title: "5-4-3-2-1 grounding",
    kind: "Grounding · eyes open",
    blurb: "Come back to the present through your senses — no breathing focus needed.",
    minutes: "2–3 min",
    href: "/meditate/grounding",
  },
  {
    slug: "body-scan",
    title: "Body scan",
    kind: "Body",
    blurb: "Move your attention slowly through the body, softening as you go.",
    minutes: "5 min",
    href: "/meditate/body-scan",
  },
];

export type BreathPhase = { name: string; secs: number };

export const BREATH_PATTERNS = [
  {
    key: "box",
    label: "Box breathing",
    desc: "Even and steadying (4-4-4-4)",
    phases: [
      { name: "Breathe in", secs: 4 },
      { name: "Hold", secs: 4 },
      { name: "Breathe out", secs: 4 },
      { name: "Hold", secs: 4 },
    ] as BreathPhase[],
  },
  {
    key: "478",
    label: "4-7-8",
    desc: "Calming, with a longer exhale",
    phases: [
      { name: "Breathe in", secs: 4 },
      { name: "Hold", secs: 7 },
      { name: "Breathe out", secs: 8 },
    ] as BreathPhase[],
  },
  {
    key: "simple",
    label: "Simple calm",
    desc: "Just in and out (4-6)",
    phases: [
      { name: "Breathe in", secs: 4 },
      { name: "Breathe out", secs: 6 },
    ] as BreathPhase[],
  },
] as const;

export const DURATIONS = [1, 3, 5] as const;

export const GROUNDING_STEPS = [
  { count: 5, sense: "see", prompt: "Name five things you can see right now." },
  { count: 4, sense: "hear", prompt: "Notice four things you can hear." },
  { count: 3, sense: "feel", prompt: "Find three things you can feel or touch." },
  { count: 2, sense: "smell", prompt: "Notice two things you can smell — or two scents you like." },
  { count: 1, sense: "taste", prompt: "Notice one thing you can taste, or one you're grateful for." },
] as const;

export const BODY_SCAN_STEPS = [
  "Settle in, and let your eyes close or soften. Notice the weight of your body being held.",
  "Bring attention to your feet and lower legs. Notice any sensation — warmth, pressure, nothing at all.",
  "Move up to your hips and lower back. If there's tension, let it soften a little on the out-breath.",
  "Notice your stomach and chest, rising and falling. No need to change anything.",
  "Bring attention to your hands, arms, and shoulders. Let the shoulders drop away from your ears.",
  "Soften the jaw, the space around your eyes, your forehead.",
  "Rest for a moment in a sense of the whole body, here and breathing. When you're ready, return gently.",
] as const;

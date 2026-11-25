// Boundaries explorer — a 9-step reflection to understand a situation, your
// needs, and a boundary that reflects them. Boundary = a limit you set for
// yourself (within your control), not a rule imposed on someone else.

export const BOUNDARY_AREAS = [
  "Emotional",
  "Time & availability",
  "Physical space",
  "Digital / messaging",
  "Privacy",
  "Family",
  "Friendships",
  "Romantic",
  "Faith & service",
  "Work",
] as const;

export const BOUNDARY_STEPS = [
  {
    key: "situation",
    question: "What happened?",
    hint: "The situation, as factually as you can — just the events, for now.",
  },
  {
    key: "feeling",
    question: "What did you feel?",
    hint: "Name the emotions, even the tangled ones.",
  },
  {
    key: "need",
    question: "What did you need or want?",
    hint: "Underneath the feeling — safety, respect, rest, space, honesty?",
  },
  {
    key: "communicated",
    question: "Did you communicate it?",
    hint: "If so, how? If not, what held you back? Either answer is okay.",
  },
  {
    key: "fear",
    question: "What were you afraid might happen?",
    hint: "Naming the fear often makes it easier to work with.",
  },
  {
    key: "control",
    question: "What was within your control?",
    hint: "You can own your own actions and limits. You can't control another person's choices — and that's not your job.",
  },
  {
    key: "boundary",
    question: "What boundary could reflect your needs and values?",
    hint: "A boundary is about what YOU will or won't do — e.g. 'If the shouting continues, I'll step away.' Not a demand that they change.",
  },
  {
    key: "communication",
    question: "How might you communicate it respectfully?",
    hint: "Clear and kind, about your own limit — a calm statement, not an ultimatum or an attempt to control them.",
  },
  {
    key: "learning",
    question: "What can you learn from how it went — or might go?",
    hint: "What would you keep, adjust, or watch for next time?",
  },
] as const;

export type BoundaryStepKey = (typeof BOUNDARY_STEPS)[number]["key"];

export type BoundaryData = {
  area: string | null;
  answers: Record<string, string>;
};

export type BoundaryRow = {
  id: string;
  data: BoundaryData;
  created_at: string;
  updated_at: string;
};

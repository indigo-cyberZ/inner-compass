export type ExerciseMeta = {
  slug: string;
  title: string;
  category: string;
  blurb: string;
  minutes: string;
  available: boolean;
  href?: string;
};

// The Explore library. Only the thought record is built so far; the rest are
// shown as upcoming so the shape of the section is clear without over-promising.
export const EXERCISES: ExerciseMeta[] = [
  {
    slug: "thought-record",
    title: "Thought record",
    category: "CBT",
    blurb:
      "Gently examine a stuck thought — the evidence for and against it — and find a more balanced perspective.",
    minutes: "5–10 min",
    available: true,
    href: "/explore/thought-record",
  },
  {
    slug: "values",
    title: "Values discovery",
    category: "ACT",
    blurb:
      "Explore what genuinely matters to you through meaningful moments, not a checklist.",
    minutes: "10 min",
    available: true,
    href: "/explore/values",
  },
  {
    slug: "boundaries",
    title: "Boundaries explorer",
    category: "Relationships",
    blurb:
      "Work through a situation to understand your needs and how you might honor them.",
    minutes: "10 min",
    available: true,
    href: "/explore/boundaries",
  },
  {
    slug: "self-compassion",
    title: "Self-compassion break",
    category: "Self-compassion",
    blurb:
      "A short practice for meeting a hard moment with the kindness you'd offer a friend.",
    minutes: "3 min",
    available: false,
  },
  {
    slug: "divine-identity",
    title: "Divine identity reflection",
    category: "Faith (optional)",
    blurb:
      "A faith-centered reflection on worth and identity, grounded in verified Church teachings.",
    minutes: "5 min",
    available: false,
  },
];

export type ThoughtRecordData = {
  situation: string;
  thoughts: string;
  emotion: string;
  intensityBefore: number; // 0–100
  evidenceFor: string;
  evidenceAgainst: string;
  balancedThought: string;
  intensityAfter: number; // 0–100
};

export type ExerciseResponse = {
  id: string;
  exercise_slug: string;
  data: ThoughtRecordData | Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export function exerciseMeta(slug: string) {
  return EXERCISES.find((e) => e.slug === slug) ?? null;
}

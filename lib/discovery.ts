// "Discover Who I Am" guided reflection + the Personal Discovery Map.

export const IDENTITY_STEPS = [
  {
    key: "beyond_roles",
    question: "Beneath the roles",
    prompt:
      "Set aside your roles for a moment — the things you do and are responsible for. Who are you underneath them?",
  },
  {
    key: "interests",
    question: "What draws you",
    prompt:
      "What are you curious about or drawn to lately — topics, activities, small fascinations, even seemingly random ones?",
  },
  {
    key: "strengths",
    question: "Strengths and growth",
    prompt:
      "What's something you do well, or a strength others see in you? And one area you'd gently like to grow?",
  },
  {
    key: "authenticity",
    question: "Most yourself",
    prompt:
      "When do you feel most like yourself? What's present in those moments?",
  },
  {
    key: "needs",
    question: "What you need",
    prompt:
      "What do you genuinely need to feel okay — not what you think you should need?",
  },
  {
    key: "meaning",
    question: "What feels meaningful",
    prompt:
      "What gives you a sense of meaning or fulfillment, even quietly?",
  },
  {
    key: "beliefs",
    question: "What you believe",
    prompt:
      "What's something you believe about life, people, or yourself that feels true to you?",
  },
  {
    key: "relationships",
    question: "Your people",
    prompt:
      "Who are the people who matter to you, and how do you want to show up with them?",
  },
  {
    key: "expectation_vs_desire",
    question: "Expectation vs. desire",
    prompt:
      "Where do others' expectations of you differ from what you actually want?",
  },
  {
    key: "change",
    question: "How you've changed",
    prompt:
      "How have you changed over the years? What's stayed constant underneath?",
  },
] as const;

export type IdentityRow = {
  id: string;
  data: { answers: Record<string, string> };
  created_at: string;
};

export const DISCOVERY_CATEGORIES = [
  { key: "interests", label: "Interests", emoji: "✨" },
  { key: "preferences", label: "Preferences", emoji: "🎨" },
  { key: "needs", label: "Needs", emoji: "🌿" },
  { key: "strengths", label: "Strengths", emoji: "💪" },
  { key: "boundaries", label: "Boundaries", emoji: "🚧" },
  { key: "beliefs", label: "Beliefs", emoji: "🕯️" },
  { key: "insights", label: "Insights", emoji: "💡" },
  { key: "questions", label: "Questions I'm exploring", emoji: "❓" },
] as const;

export type DiscoveryCategory = (typeof DISCOVERY_CATEGORIES)[number]["key"];

export function categoryMeta(key: string) {
  return DISCOVERY_CATEGORIES.find((c) => c.key === key) ?? null;
}

export type DiscoveryItem = {
  id: string;
  data: { category: string; text: string; source?: "user" | "ai" };
  created_at: string;
  updated_at: string;
};

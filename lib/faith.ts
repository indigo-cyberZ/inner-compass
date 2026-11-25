// Divine identity reflection (optional, Latter-day Saint faith track).
//
// IMPORTANT: These are original reflection PROMPTS, not official doctrine and
// not scripture quotations. We never fabricate quotes, citations, or
// attributions. Broad gospel themes are referenced in general terms only, and
// users are pointed to official sources to study and verify for themselves.

export const FAITH_DISCLAIMER =
  "These are reflection prompts written for Inner Compass — not official Church doctrine, scripture, or revelation. For authoritative teachings and scriptures, study directly at churchofjesuschrist.org. Inner Compass doesn't speak for God or tell you what God wants you to choose.";

export const DIVINE_IDENTITY_STEPS = [
  {
    key: "identity",
    question: "Beloved child, first",
    prompt:
      "Latter-day Saint teaching holds that you are a child of Heavenly Parents, loved before anything you ever accomplished. Setting achievements aside — what might it mean for your worth that this is your first identity?",
  },
  {
    key: "worth",
    question: "Worth that isn't earned",
    prompt:
      "Your value isn't won by performance or lost by mistakes. Where have you been measuring your worth by output? What would it feel like to rest it somewhere steadier?",
  },
  {
    key: "agency",
    question: "The gift of agency",
    prompt:
      "Agency is the freedom to choose and to act. Where in your life right now can you act — even in a small way — rather than only being acted upon?",
  },
  {
    key: "attributes",
    question: "Growing and giving",
    prompt:
      "Which Christlike quality — charity, patience, hope, humility — do you feel drawn to grow right now? And what gift do you already carry that quietly blesses others?",
  },
  {
    key: "grace",
    question: "Grace and growth",
    prompt:
      "Grace means you don't have to be perfect to be moving in a good direction. Where could you let honest progress be enough today, instead of flawlessness?",
  },
  {
    key: "relationships",
    question: "Loving without self-erasing",
    prompt:
      "Loving and serving others doesn't require abandoning your own needs. Where might honoring one of your needs actually help you love and serve more sustainably?",
  },
  {
    key: "purpose",
    question: "A step toward purpose",
    prompt:
      "What's one small, concrete way you could act on a sense of purpose or discipleship this week? Not a grand gesture — just a next step.",
  },
] as const;

export type FaithReflectionRow = {
  id: string;
  data: { answers: Record<string, string> };
  created_at: string;
};

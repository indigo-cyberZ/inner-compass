// Values discovery — reflective prompts that surface values from lived
// experience (ACT-informed), rather than picking from a predefined list.

export const VALUE_PROMPTS = [
  {
    key: "meaningful",
    question: "Think of a time that felt deeply meaningful.",
    hint: "What were you doing, and who were you with? What made it matter?",
  },
  {
    key: "fulfillment",
    question: "When did you last feel genuinely fulfilled — even quietly?",
    hint: "Not just happy or productive. What was present in that moment?",
  },
  {
    key: "admire",
    question: "Think of someone you admire.",
    hint: "What quality in them stands out? That admiration often points to something you value.",
  },
  {
    key: "reaction",
    question: "What reliably moves you — to tears, awe, or real anger?",
    hint: "Strong reactions often sit on top of something you care about deeply.",
  },
  {
    key: "hard_decision",
    question: "Recall a hard decision you're proud of.",
    hint: "What did you choose to honor, even though it was difficult?",
  },
  {
    key: "relationship",
    question: "In a relationship that matters to you, how do you most want to show up?",
    hint: "The way you want to treat others can reveal what you hold dear.",
  },
  {
    key: "conflict",
    question: "When two priorities pull against each other, which do you protect?",
    hint: "There's no right answer — just notice what tends to win, and why.",
  },
  {
    key: "chosen_vs_expected",
    question: "Which of your 'shoulds' are truly yours?",
    hint: "And which were handed to you by others? It's okay not to be sure yet.",
  },
] as const;

export type ValuePromptKey = (typeof VALUE_PROMPTS)[number]["key"];

export type ConfirmedValue = {
  name: string;
  definition: string;
  importance: number; // 1–5
};

export type ValueRow = {
  id: string;
  data: ConfirmedValue;
  created_at: string;
  updated_at: string;
};

export const IMPORTANCE = [
  { value: 1, label: "On the edges" },
  { value: 2, label: "Matters some" },
  { value: 3, label: "Important" },
  { value: 4, label: "Very important" },
  { value: 5, label: "Core to who I am" },
] as const;

export function importanceLabel(v: number) {
  return IMPORTANCE.find((i) => i.value === v)?.label ?? "";
}

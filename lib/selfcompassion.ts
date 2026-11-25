// Self-compassion break — a short guided practice. Draws on the three
// well-studied elements of self-compassion (mindful acknowledgment, common
// humanity, self-kindness), in original wording.

export const SC_STEPS = [
  {
    key: "settle",
    title: "Settle",
    body: "Take one slower breath. Bring to mind something that's weighing on you right now — you don't need to solve it, just let it be here.",
  },
  {
    key: "acknowledge",
    title: "Acknowledge it",
    body: "Quietly name what's true: “This is hard right now.” Letting a difficult moment be difficult, without pushing it away, is its own kind of relief.",
  },
  {
    key: "humanity",
    title: "You're not alone in it",
    body: "You're not failing at life — you're a person having a hard time, the way every person is sometimes. Struggle is part of being human, shared by more people than you'll ever see.",
  },
  {
    key: "kindness",
    title: "Offer yourself kindness",
    body: "If a dear friend felt exactly this, what would you say to them? Try offering those same words to yourself — out loud, or in writing below.",
  },
] as const;

export const KIND_PHRASES = [
  "May I be gentle with myself right now.",
  "I'm doing the best I can with what I have today.",
  "This is hard, and I don't have to face it perfectly.",
  "I deserve the same kindness I offer others.",
  "It's okay to rest. It's okay to not be okay.",
];

export type KindWordsRow = {
  id: string;
  data: { phrase: string };
  created_at: string;
};

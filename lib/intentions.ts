export type IntentionStatus = "active" | "completed" | "released";

export type Intention = {
  id: string;
  body: string;
  status: IntentionStatus;
  reflection: string | null;
  created_at: string;
  updated_at: string;
};

export const STATUS_META: Record<
  IntentionStatus,
  { label: string; tone: string }
> = {
  active: { label: "Active", tone: "text-dusk" },
  completed: { label: "Lived into", tone: "text-sage" },
  released: { label: "Let go", tone: "text-ink-soft" },
};

// Gentle example intentions (shown as prompts, never prescribed).
export const INTENTION_EXAMPLES = [
  "Be a little more patient with myself",
  "Make room for rest",
  "Speak up about one of my needs",
  "Notice a thought without immediately believing it",
  "Do one small thing that feels meaningful",
];

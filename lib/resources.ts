export type Resource = {
  id: string;
  title: string;
  creator: string | null;
  organization: string | null;
  type: "article" | "research" | "guideline" | "video" | "website" | "workbook";
  url: string;
  youtube_id: string | null;
  topics: string[];
  summary: string;
  approach: string | null;
  evidence_level:
    | "evidence-based"
    | "evidence-informed"
    | "official-guidance"
    | "general-wellness"
    | null;
  related_exercise: string | null;
  published_on: string | null;
  reviewed_on: string;
};

export const EVIDENCE_META: Record<string, { label: string; tone: string }> = {
  "evidence-based": {
    label: "Evidence-based",
    tone: "bg-sage/15 text-ink",
  },
  "official-guidance": {
    label: "Official guidance",
    tone: "bg-dusk/10 text-dusk",
  },
  "evidence-informed": {
    label: "Evidence-informed",
    tone: "bg-clay/10 text-clay",
  },
  "general-wellness": {
    label: "General wellness",
    tone: "bg-surface-2 text-ink-soft",
  },
};

export const TYPE_LABEL: Record<Resource["type"], string> = {
  article: "Article",
  research: "Research",
  guideline: "Guideline",
  video: "Video",
  website: "Website",
  workbook: "Workbook",
};

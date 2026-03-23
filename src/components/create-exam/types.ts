export type Step = "upload" | "review" | "configure";

export interface ParsedQuestion {
  id: number;
  type: "mcq" | "short" | "essay";
  text: string;
  options?: string[];
  answer?: string;
  marks: number;
  flagged?: boolean;
}

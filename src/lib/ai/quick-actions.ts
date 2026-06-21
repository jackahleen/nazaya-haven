export type NazayaQuickActionId =
  | "find-resources"
  | "legal-forms"
  | "grounding-support"
  | "digital-parenting";

export type NazayaQuickAction = {
  id: NazayaQuickActionId;
  label: string;
  prompt: string;
};

export const nazayaQuickActions: NazayaQuickAction[] = [
  {
    id: "find-resources",
    label: "Find resources",
    prompt: "Help me find family support resources near me.",
  },
  {
    id: "legal-forms",
    label: "Legal forms",
    prompt: "Help me understand which California family safety forms may apply.",
  },
  {
    id: "grounding-support",
    label: "Grounding support",
    prompt: "I feel overwhelmed and need a grounding exercise.",
  },
  {
    id: "digital-parenting",
    label: "Digital parenting",
    prompt: "Help me make a safe internet access plan for my household.",
  },
];

export type NazayaIntent =
  | "resources"
  | "legal_forms"
  | "grounding"
  | "digital_parenting"
  | "general";

const intentPatterns: { intent: NazayaIntent; pattern: RegExp }[] = [
  {
    intent: "resources",
    pattern:
      /\b(resource|housing|food|therapy|therapist|calfresh|medi-cal|support|insurance|sliding.scale|clinic|program|service)\b/i,
  },
  {
    intent: "legal_forms",
    pattern:
      /\b(legal|court|form|dv-100|dv-109|dv-110|custody|restraining|order|protection|divorce|guardianship)\b/i,
  },
  {
    intent: "grounding",
    pattern:
      /\b(overwhelmed|anxious|panic|grounding|breathe|stress|overwhelm|scared|frightened|help|emergency)\b/i,
  },
  {
    intent: "digital_parenting",
    pattern:
      /\b(internet|screen|phone|device|privacy|app|online|social|media|gaming|tech|tiktok|youtube|instagram)\b/i,
  },
];

export function routeNazayaIntent(message: string): NazayaIntent {
  return (
    intentPatterns.find(({ pattern }) => pattern.test(message))?.intent ??
    "general"
  );
}

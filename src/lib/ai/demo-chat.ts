import { routeNazayaIntent } from "@/lib/ai/intent-router";

const responses = {
  resources:
    "Demo mode: I would help this caregiver narrow the need, confirm location, and then show family support resources such as 211, local family resource centers, food support, housing navigation, and parenting workshops. The hosted Nazaya runtime can turn this into a live Claude-assisted search.",
  legal_forms:
    "Demo mode: I would separate legal information from legal advice, point the caregiver toward the legal lane, and help organize court form questions for a qualified advocate or attorney. The hosted Nazaya runtime can provide richer document guidance.",
  grounding:
    "Demo mode: I would slow the moment down with a short grounding step, ask whether anyone is in immediate danger, and suggest crisis or support resources when needed. The hosted Nazaya runtime can continue the conversation live.",
  digital_parenting:
    "Demo mode: I would help the adult review device access, privacy settings, app boundaries, and age-appropriate internet habits. The hosted Nazaya runtime can personalize this into a guided parenting literacy plan.",
  general:
    "Demo mode: I would summarize the concern, suggest the next safe step, and route the caregiver toward resources, legal navigation, digital parenting support, or a guided form workflow. The hosted Nazaya runtime can provide a live response.",
} as const;

export function getDemoNazayaChatResponse(message: string): string {
  const intent = routeNazayaIntent(message);
  return responses[intent];
}

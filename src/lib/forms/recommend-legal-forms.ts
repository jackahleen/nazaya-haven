import { type LegalForm, legalForms } from "@/data/legal-forms";

export type LegalFormNeed = "protection" | "hearing" | "temporary-order" | "all";

export function recommendLegalForms(need: LegalFormNeed): LegalForm[] {
  if (need === "all") return legalForms;
  const mapping: Record<Exclude<LegalFormNeed, "all">, string[]> = {
    protection: ["DV-100"],
    hearing: ["DV-109"],
    "temporary-order": ["DV-110"],
  };
  return legalForms.filter((form) => mapping[need].includes(form.id));
}

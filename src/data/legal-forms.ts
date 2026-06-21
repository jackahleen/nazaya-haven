export type LegalFormId = "DV-100" | "DV-109" | "DV-110";

export type LegalForm = {
  id: LegalFormId;
  name: string;
  useCase: string;
  sourceUrl: string;
};

export const legalForms: LegalForm[] = [
  {
    id: "DV-100",
    name: "Request for Domestic Violence Restraining Order",
    useCase: "Start a request for protection from domestic violence.",
    sourceUrl: "https://selfhelp.courts.ca.gov/jcc-form/DV-100",
  },
  {
    id: "DV-109",
    name: "Notice of Court Hearing",
    useCase: "Tell parties when the court hearing is scheduled.",
    sourceUrl: "https://selfhelp.courts.ca.gov/jcc-form/DV-109",
  },
  {
    id: "DV-110",
    name: "Temporary Restraining Order",
    useCase: "Temporary orders a judge may sign before the hearing.",
    sourceUrl: "https://selfhelp.courts.ca.gov/jcc-form/DV-110",
  },
];

export const demoSession = {
  user: {
    name: "Demo Caregiver",
    role: "Kinship caregiver preview",
    location: "Bay Area, CA",
    householdContext: "Two school-age children, shared devices, one active resource search",
  },
  status: {
    label: "Demo session",
    summary: "3 guided tasks queued",
    description:
      "Previewing what a signed-in caregiver sees before real authentication is connected.",
  },
  queuedTasks: [
    {
      id: "digital-parenting-tour",
      label: "Digital parenting walkthrough",
      owner: "Agent-S tutorial",
    },
    {
      id: "resource-follow-up",
      label: "Resource options to compare",
      owner: "Resources lane",
    },
    {
      id: "forms-start",
      label: "Forms helper ready for intake",
      owner: "Documents lane",
    },
  ],
} as const;

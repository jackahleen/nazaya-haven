export const demoSession = {
  user: {
    name: "Demo Caregiver",
    role: "Kinship caregiver preview",
    location: "Bay Area, CA",
    householdContext: "Two school-age children, shared devices, one active resource search",
  },
  status: {
    label: "Authenticated preview",
    summary: "3 guided tasks queued",
    description:
      "Previewing what a signed-in caregiver sees before real authentication is connected.",
  },
  sponsorStates: [
    {
      id: "redis-trace-store",
      label: "Redis trace store",
      status: "Env gated",
      description:
        "Stores normalized agent traces when REDIS_URL is configured; skipped safely in static preview.",
    },
    {
      id: "agent-s-tutorial",
      label: "Agent-S tutorial queued",
      status: "Demo workflow",
      description:
        "Simular/Agent-S can drive an adult through the dashboard and digital parenting guide.",
    },
    {
      id: "browserbase-preview",
      label: "Browserbase preview smoke",
      status: "CI optional",
      description:
        "Cloud-browser screenshots run only when Browserbase secrets are present.",
    },
  ],
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

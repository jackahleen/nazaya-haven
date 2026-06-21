export const digitalParentingTopics = [
  {
    id: "internet-access-routines",
    title: "Internet access routines",
    description:
      "Notice when devices are available, whether bedtime access is supervised, and which school or shared devices need clear expectations.",
  },
  {
    id: "platform-literacy",
    title: "Platform literacy",
    description:
      "Help caregivers ask what an app does, who can contact the child, what can be posted, and which privacy controls matter first.",
  },
  {
    id: "conversation-prompts",
    title: "Conversation prompts",
    description:
      "Offer calm scripts for talking about screen time, online contacts, cyberbullying, explicit content, and requests for secrecy.",
  },
  {
    id: "household-tech-plan",
    title: "Household tech plan",
    description:
      "Turn digital safety into a shared routine with rules for charging, passwords, app installs, school devices, and check-ins.",
  },
] as const;

export const digitalParentingCheckIn = [
  {
    id: "unsupervised-access",
    prompt: "Where can your child get online without an adult nearby?",
    support:
      "Map the access points first: personal phone, school laptop, game console, TV browser, or a friend's device.",
  },
  {
    id: "unknown-apps",
    prompt: "Are there apps, chats, or games you do not recognize yet?",
    support:
      "Start with curiosity. Ask the child to explain what they like about the app before setting a boundary.",
  },
  {
    id: "routine-boundaries",
    prompt: "What tech boundary would reduce conflict this week?",
    support:
      "Pick one concrete routine, such as overnight charging outside the bedroom or asking before installing new apps.",
  },
] as const;

export const agentNavigationHandoffs = [
  {
    id: "nazaya-tour",
    label: "Show me around Nazaya Haven",
    mode: "Agent-S guided walkthrough",
    description:
      "A guided app tour can point adults to resources, documents, chat, and digital parenting support without making them learn every menu first.",
    destination: "Demo route: dashboard overview",
  },
  {
    id: "forms-helper",
    label: "Help me start a form",
    mode: "Agent-S forms helper",
    description:
      "When teammate B's forms flow lands, an agent can walk the caregiver from a recommended form into the right guided questions.",
    destination: "Integration route: documents lane",
  },
  {
    id: "resource-walkthrough",
    label: "Help me contact a resource",
    mode: "Agent-S resource walkthrough",
    description:
      "When teammate A's resource lane lands, an agent can help compare options, open the next step, and keep the caregiver oriented.",
    destination: "Integration route: resources lane",
  },
] as const;

export const notificationHandoffConcepts = [
  {
    id: "agent-ready",
    label: "Notify caregiver when ready",
    description:
      "Send a gentle notification when an agent finishes preparing a walkthrough, resource handoff, or form-start checklist.",
  },
  {
    id: "follow-up",
    label: "Schedule a follow-up reminder",
    description:
      "Nudge the caregiver to revisit the household tech plan after a conversation, appointment, or document review.",
  },
  {
    id: "handoff-summary",
    label: "Share a plain-language summary",
    description:
      "Summarize what the agent did, what still needs the adult's decision, and which teammate lane owns the next step.",
  },
] as const;

export const FREQUENCY_ORIGIN = {
  id: "frecuencia_origen",
  name: "ZAFIRO Frequency Origin",
  version: "1.0.9",
  owner: "MSM MY STORE LLC",
  principles: {
    identity: "ONE_SOVEREIGN_IDENTITY",
    security: "ZERO_TRUST",
    storage: "FEDERATED",
    offline: "OFFLINE_FIRST",
    audit: "APPEND_ONLY",
    ai: "HUMAN_SUPERVISED",
  },
  supportedLanguages: ["es", "en"],
  roles: {
    OWNER: ["*"],
    CASHIER: [
      "inventory.read",
      "sales.create",
      "cash.read",
      "cash.write",
      "expenses.create",
      "deliveries.create",
      "reservations.create",
      "daily_close.create",
    ],
    VIEWER: ["inventory.read", "sales.read", "reports.read"],
  },
  guardians: [
    "communications",
    "infrastructure",
    "mobility",
    "home",
    "multimedia",
    "security",
    "family",
  ],
  eventPriorities: [
    "EMERGENCY",
    "SECURITY",
    "HEALTH",
    "OPERATION",
    "COMMUNITY",
    "ENTERTAINMENT",
  ],
} as const;

export type FrequencyOriginConfig = typeof FREQUENCY_ORIGIN;

export const queryKeys = {
  vehicles: {
    all: ["vehicles"] as const,
  },
  drivers: {
    all: ["drivers"] as const,
  },
  employees: {
    all: ["employees"] as const,
    detail: (id: string) => ["employees", id] as const,
  },
  visitors: {
    all: ["visitors"] as const,
  },
  historyLogs: {
    all: ["history-logs"] as const,
  },
  companies: {
    all: ["companies"] as const,
  },
} as const

export const PROJECT_STATUS_OPTIONS = ["Spot", "Forward", "Offtake"] as const;

export type ProjectStatus = (typeof PROJECT_STATUS_OPTIONS)[number];

const projectStatuses = new Set<string>(PROJECT_STATUS_OPTIONS);

export function isProjectStatus(value: unknown): value is ProjectStatus {
  return typeof value === "string" && projectStatuses.has(value);
}

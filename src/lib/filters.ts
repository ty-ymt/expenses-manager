import {
  PROJECT_STATUS,
  type ProjectListItem,
  type ProjectStatus,
} from "@/types/projects";

export const DEFAULT_STATUSES: ProjectStatus[] = [
  PROJECT_STATUS.UNDECIDED,
  PROJECT_STATUS.NOT_STARTED,
  PROJECT_STATUS.IN_PROGRESS,
  PROJECT_STATUS.ENDED,
];

export const STATUS_OPTIONS: ProjectStatus[] = [
  ...DEFAULT_STATUSES,
  PROJECT_STATUS.COMPLETED,
];

export const filterProjectsByStatus = (
  projects: ProjectListItem[],
  selected: ProjectStatus[]
) => {
  if (selected.length === 0) return [];
  return projects.filter((p) => selected.includes(p.status));
};

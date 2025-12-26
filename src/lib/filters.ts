import {
  PROJECT_STATUS,
  type ProjectListItem,
  type ProjectStatus,
} from "@/types/projects";
import { toJstDay } from "./date";

export const STATUS_OPTIONS: ProjectStatus[] = [
  PROJECT_STATUS.UNDECIDED,
  PROJECT_STATUS.NOT_STARTED,
  PROJECT_STATUS.IN_PROGRESS,
  PROJECT_STATUS.ENDED,
];

export const filterProjectsByStatus = (
  projects: ProjectListItem[],
  selected: ProjectStatus[]
) => {
  if (selected.length === 0) return projects;
  return projects.filter((p) => selected.includes(p.status));
};

const DAY_MIN = "0001-01-01";
const DAY_MAX = "9999-12-31";

const toJstDayRequired = (value: string | Date) => {
  const dt = toJstDay(value);
  if (!dt) throw new Error("Invalid date");
  return dt;
};

export const filterProjectsByDateOverlap = (
  projects: ProjectListItem[],
  range: { from: string | null; to: string | null }
) => {
  const filterFrom = toJstDayRequired(range.from ?? DAY_MIN);
  const filterTo = toJstDayRequired(range.to ?? DAY_MAX);

  if (!range.from && !range.to) return projects;
  return projects.filter((p) => {
    const projectFrom = toJstDayRequired(p.start_dt ?? DAY_MIN);
    const projectTo = toJstDayRequired(p.end_dt ?? DAY_MAX);

    return projectFrom <= filterTo && projectTo >= filterFrom;
  });
};

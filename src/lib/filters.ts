import { PROJECT_STATUS, type ProjectStatus } from "@/types/projects";
import { toJstDay } from "./date";

type HasStatus = { status: ProjectStatus };
type HasRange = {
  start_dt: Date | string | null;
  end_dt: Date | string | null;
};
type HasQuery = { cd: string; name: string };

export const STATUS_OPTIONS: ProjectStatus[] = [
  PROJECT_STATUS.UNDECIDED,
  PROJECT_STATUS.NOT_STARTED,
  PROJECT_STATUS.IN_PROGRESS,
  PROJECT_STATUS.ENDED,
];

export const filterProjectsByStatus = <T extends HasStatus>(
  projects: T[],
  selected: ProjectStatus[],
): T[] => {
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

export const filterProjectsByDateOverlap = <T extends HasRange>(
  projects: T[],
  range: { from: string | null; to: string | null },
): T[] => {
  const filterFrom = toJstDayRequired(range.from ?? DAY_MIN);
  const filterTo = toJstDayRequired(range.to ?? DAY_MAX);

  if (!range.from && !range.to) return projects;
  return projects.filter((p) => {
    const projectFrom = toJstDayRequired(p.start_dt ?? DAY_MIN);
    const projectTo = toJstDayRequired(p.end_dt ?? DAY_MAX);

    return projectFrom <= filterTo && projectTo >= filterFrom;
  });
};

export const filterProjectsByQuery = <T extends HasQuery>(
  projects: T[],
  query: string,
): T[] => {
  const q = query.trim().toLowerCase();
  if (!q) return projects;

  return projects.filter((p) => {
    const cd = (p.cd ?? "").toLowerCase();
    const name = (p.name ?? "").toLowerCase();
    return cd.includes(q) || name.includes(q);
  });
};

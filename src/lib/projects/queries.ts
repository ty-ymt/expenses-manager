import "server-only";
import {
  PROJECT_STATUS,
  type ProjectListItem,
  type ProjectStatus,
} from "@/types/projects";
import { getTodayJst, toJstDay } from "../date";
import { prisma } from "../platform/prisma";

export const getProjectStatus = (input: {
  start: Date | string | null | undefined;
  end: Date | string | null | undefined;
  completed: boolean;
}): ProjectStatus => {
  const startDay = toJstDay(input.start);
  const endDay = toJstDay(input.end);
  const today = getTodayJst();

  switch (true) {
    case input.completed:
      return PROJECT_STATUS.COMPLETED;
    case !startDay && !endDay:
      return PROJECT_STATUS.UNDECIDED;
    case startDay && startDay > today:
      return PROJECT_STATUS.NOT_STARTED;
    case endDay && endDay < today:
      return PROJECT_STATUS.ENDED;
    case startDay && startDay <= today && (!endDay || endDay >= today):
      return PROJECT_STATUS.IN_PROGRESS;
    default:
      return PROJECT_STATUS.UNDECIDED;
  }
};

export const getAllProjects = async (): Promise<ProjectListItem[]> => {
  const rows = await prisma.project.findMany({
    select: {
      id: true,
      cd: true,
      name: true,
      completed: true,
      start_dt: true,
      end_dt: true,
      completed_at: true,
    },
    orderBy: [{ start_dt: "asc" }, { cd: "asc" }],
  });

  return rows.map((p) => ({
    id: p.id.toString(),
    cd: p.cd,
    name: p.name,
    completed: p.completed,
    start_dt: p.start_dt,
    end_dt: p.end_dt,
    completed_at: p.completed_at,
    status: getProjectStatus({
      start: p.start_dt,
      end: p.end_dt,
      completed: p.completed,
    }),
  }));
};

export const getProjectById = async (id: bigint) => {
  return prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      cd: true,
      name: true,
      remarks: true,
      start_dt: true,
      end_dt: true,
      completed: true,
      created_at: true,
      updated_at: true,
      completed_at: true,
    },
  });
};

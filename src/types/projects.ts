export type ProjectListItem = {
  id: string;
  cd: string;
  name: string;
  completed: boolean;
  start_dt: Date | null;
  end_dt: Date | null;
  completed_at: Date | null;
  status: ProjectStatus;
};

export type ProjectInput = {
  cd: string;
  name: string;
  remarks?: string;
  start_dt?: Date | null;
  end_dt?: Date | null;
  completed: boolean;
};

export type ProjectEditFormData = {
  id: string;
  cd: string;
  name: string;
  remarks: string;
  start_dt: string;
  end_dt: string;
  completed: boolean;
  completed_at: string;
};

export const PROJECT_STATUS = {
  UNDECIDED: "undecided",
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  ENDED: "ended",
  COMPLETED: "completed",
} as const;

export type ProjectStatus =
  (typeof PROJECT_STATUS)[keyof typeof PROJECT_STATUS];

export const PROJECT_STATUS_TABS: ProjectStatus[] = [
  PROJECT_STATUS.NOT_STARTED,
  PROJECT_STATUS.IN_PROGRESS,
  PROJECT_STATUS.ENDED,
  PROJECT_STATUS.UNDECIDED,
];

export type ProjectStatusTab = "all" | ProjectStatus;

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  undecided: "未定",
  not_started: "開始前",
  in_progress: "運用中",
  ended: "終了",
  completed: "完了",
};

export type DateRangeFilter = {
  from: string | null;
  to: string | null;
};

export type ActionState = { ok: false; message: string } | null;
export type ProjectAddAction = (
  prevState: ActionState,
  formData: FormData
) => Promise<ActionState>;

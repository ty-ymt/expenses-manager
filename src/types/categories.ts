export type CategoryRow = {
  id: string;
  name: string;
  sort: number | null;
  deleted_at: Date | null;
};

export type CategoryEditRow = {
  id?: string;
  name: string;
  deleted: boolean;
};

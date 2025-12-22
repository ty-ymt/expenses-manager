"use client";

import {
  Alert,
  Divider,
  Paper,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useActionState, useState } from "react";
import {
  deleteProjectAction,
  updateProjectAction,
} from "@/app/projects/[id]/edit/actions";
import type { ActionState, ProjectEditFormData } from "@/types/projects";
import FormActions from "../ui/Form/FormActions";
import {
  CancelLinkButton,
  DangerButton,
  SubmitButton,
} from "../ui/Form/FormButtons";

export const ProjectEditForm = ({
  project,
}: {
  project: ProjectEditFormData;
}) => {
  const [upState, upAction, upPending] = useActionState<ActionState, FormData>(
    updateProjectAction,
    null
  );
  const [delState, delAction, delPending] = useActionState<
    ActionState,
    FormData
  >(deleteProjectAction, null);

  const [startDate, setStartDate] = useState<string | null>(
    project.start_dt || null
  );
  const [endDate, setEndDate] = useState<string | null>(project.end_dt || null);

  return (
    <Paper p="md" withBorder radius="sm">
      <form action={upAction}>
        <Stack gap="sm">
          {upState ? (
            <Alert color="red" title="エラー">
              {upState.message}
            </Alert>
          ) : null}

          <input type="hidden" name="id" value={project.id} />

          <TextInput
            name="cd"
            label="案件コード"
            defaultValue={project.cd}
            required
          />
          <TextInput
            name="name"
            label="案件名"
            defaultValue={project.name}
            required
          />
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
            <DateInput
              label="開始日"
              value={startDate}
              onChange={setStartDate}
              clearable
              valueFormat="YYYY-MM-DD"
            />
            <DateInput
              label="終了日"
              value={endDate}
              onChange={setEndDate}
              clearable
              valueFormat="YYYY-MM-DD"
            />
          </SimpleGrid>

          <input type="hidden" name="start_dt" value={startDate ?? ""} />
          <input type="hidden" name="end_dt" value={endDate ?? ""} />

          <Textarea name="remarks" label="備考" autosize minRows={3} />

          <FormActions>
            <CancelLinkButton href={`/projects/${project.id}`}>
              キャンセル
            </CancelLinkButton>
            <SubmitButton loading={upPending}>更新</SubmitButton>
          </FormActions>
        </Stack>
      </form>

      <Divider />
      {delState ? (
        <Alert color="red" title="削除エラー">
          {delState.message}
        </Alert>
      ) : null}

      <form
        action={delAction}
        onSubmit={(e) => {
          if (!confirm("この案件を削除します。よろしいですか？")) {
            e.preventDefault();
          }
        }}
      >
        <input type="hidden" name="id" value={project.id} />
        <FormActions justify="flex-end">
          <DangerButton loading={delPending}>削除</DangerButton>
        </FormActions>
      </form>
    </Paper>
  );
};

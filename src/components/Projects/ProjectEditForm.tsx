"use client";

import {
  Alert,
  Checkbox,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
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
import { FormRow } from "../ui/Form/FormRow";

export const ProjectEditForm = ({
  project,
}: {
  project: ProjectEditFormData;
}) => {
  const [upState, upAction, upPending] = useActionState<ActionState, FormData>(
    updateProjectAction,
    null
  );

  const [delState, setDelState] = useState<ActionState>(null);
  const [delPending, setDelPending] = useState(false);

  const [startDate, setStartDate] = useState<string | null>(
    project.start_dt || null
  );
  const [endDate, setEndDate] = useState<string | null>(project.end_dt || null);
  const [completed, setCompleted] = useState<boolean>(project.completed);

  return (
    <Paper p="md" withBorder radius="sm">
      <Stack gap="sm">
        {upState ? (
          <Alert color="red" title="エラー">
            {upState.message}
          </Alert>
        ) : null}

        {delState ? (
          <Alert color="red" title="削除エラー">
            {delState.message}
          </Alert>
        ) : null}

        <form action={upAction}>
          <Stack gap="sm">
            <input type="hidden" name="id" value={project.id} />
            <input type="hidden" name="start_dt" value={startDate ?? ""} />
            <input type="hidden" name="end_dt" value={endDate ?? ""} />
            <input
              type="hidden"
              name="completed"
              value={completed ? "on" : ""}
            />

            <FormRow label="案件コード">
              <TextInput name="cd" defaultValue={project.cd} required />
            </FormRow>

            <FormRow label="案件名">
              <TextInput name="name" defaultValue={project.name} required />
            </FormRow>

            <FormRow label="日付">
              <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="sm">
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
                <Checkbox
                  label="完了"
                  checked={completed}
                  onChange={(e) => setCompleted(e.currentTarget.checked)}
                  mt={26}
                />
                <TextInput
                  label="完了日"
                  value={project.completed_at ?? ""}
                  readOnly
                  placeholder=""
                />
              </SimpleGrid>
            </FormRow>

            <FormRow label="備考">
              <Textarea
                name="remarks"
                defaultValue={project.remarks}
                autosize
                minRows={3}
              />
            </FormRow>

            <FormActions>
              <Group justify="space-between" style={{ width: "100%" }}>
                <DangerButton
                  type="button"
                  loading={delPending}
                  onClick={() => {
                    modals.openConfirmModal({
                      title: "削除確認",
                      children: (
                        <Text size="sm">
                          この案件を削除します。よろしいですか？
                        </Text>
                      ),
                      labels: { confirm: "削除する", cancel: "キャンセル" },
                      confirmProps: { color: "red" },
                      onConfirm: async () => {
                        setDelState(null);
                        setDelPending(true);
                        try {
                          const fd = new FormData();
                          fd.set("id", project.id);

                          const res = await deleteProjectAction(fd);
                          if (res?.ok === false) setDelState(res);
                        } finally {
                          setDelPending(false);
                        }
                      },
                    });
                  }}
                >
                  削除
                </DangerButton>
                <Group gap="sm">
                  <CancelLinkButton href={`/projects/${project.id}`}>
                    キャンセル
                  </CancelLinkButton>
                  <SubmitButton loading={upPending}>更新</SubmitButton>
                </Group>
              </Group>
            </FormActions>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
};

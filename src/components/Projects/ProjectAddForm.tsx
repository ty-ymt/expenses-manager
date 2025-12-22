"use client";

import {
  Alert,
  Paper,
  SimpleGrid,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useActionState, useState } from "react";
import type { ActionState, ProjectAddAction } from "@/types/projects";
import FormActions from "../ui/Form/FormActions";
import { CancelLinkButton, SubmitButton } from "../ui/Form/FormButtons";

export const ProjectAddForm = ({ action }: { action: ProjectAddAction }) => {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    null
  );

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  return (
    <Paper p="md" withBorder radius="sm">
      <form action={formAction}>
        <Stack gap="sm">
          {state ? (
            <Alert color="red" title="エラー">
              {state.message}
            </Alert>
          ) : null}
          <TextInput
            name="cd"
            label="案件コード"
            placeholder="案件コードを入力"
            required
          />
          <TextInput
            name="name"
            label="案件名"
            placeholder="案件名を入力"
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

            <input type="hidden" name="start_dt" value={startDate ?? ""} />
            <input type="hidden" name="end_dt" value={endDate ?? ""} />
          </SimpleGrid>

          <Textarea name="remarks" label="備考" autosize minRows={3} />

          <FormActions>
            <CancelLinkButton href="/projects">キャンセル</CancelLinkButton>
            <SubmitButton loading={pending}>作成</SubmitButton>
          </FormActions>
        </Stack>
      </form>
    </Paper>
  );
};

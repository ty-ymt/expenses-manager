"use client";

import {
  Alert,
  Group,
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
import { FormRow } from "../ui/Form/FormRow";

export const ProjectAddForm = ({ action }: { action: ProjectAddAction }) => {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    null
  );

  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  return (
    <Paper p="md" withBorder radius="sm">
      {state ? (
        <Alert color="red" title="エラー">
          {state.message}
        </Alert>
      ) : null}

      <form action={formAction}>
        <Stack gap="sm">
          <input type="hidden" name="start_dt" value={startDate ?? ""} />
          <input type="hidden" name="end_dt" value={endDate ?? ""} />

          <FormRow label="案件コード">
            <TextInput name="cd" placeholder="案件コードを入力" required />
          </FormRow>
          <FormRow label="案件名">
            <TextInput name="name" placeholder="案件名を入力" required />
          </FormRow>
          <FormRow label="日付">
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
          </FormRow>
          <FormRow label="備考">
            <Textarea name="remarks" autosize minRows={3} />
          </FormRow>

          <FormActions>
            <Group justify="flex-end" style={{ width: "100%" }} gap="sm">
              <CancelLinkButton href="/projects">キャンセル</CancelLinkButton>
              <SubmitButton loading={pending}>作成</SubmitButton>
            </Group>
          </FormActions>
        </Stack>
      </form>
    </Paper>
  );
};

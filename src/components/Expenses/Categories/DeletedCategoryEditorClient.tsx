"use client";

import { Button, Checkbox, Group, Stack, TextInput } from "@mantine/core";
import { useMemo, useState, useTransition } from "react";
import { saveDeletedCategories } from "@/lib/expenses/categories/actions";
import type { CategoryRow } from "@/types/categories";

type Row = {
  id: string;
  name: string;
  restore: boolean;
};

type Props = {
  initial: CategoryRow[];
};

export const DeletedCategoryEditorClient = ({ initial }: Props) => {
  const [rows, setRows] = useState<Row[]>(() =>
    initial.map((r) => ({ id: r.id, name: r.name, restore: false })),
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const canSave = useMemo(
    () => rows.every((r) => r.name.trim().length > 0),
    [rows],
  );

  const onSave = () => {
    setError(null);
    startTransition(async () => {
      const res = await saveDeletedCategories(rows);
      if (!res.ok) {
        setError(res.message);
        return;
      }
      // 保存後：復活したものはこの画面から消すのが自然
      setRows((prev) =>
        prev
          .filter((r) => !r.restore)
          .map((r) => ({ ...r, name: r.name.trim(), restore: false })),
      );
    });
  };

  return (
    <Stack gap="sm">
      {error ? <div style={{ color: "red", fontSize: 13 }}>{error}</div> : null}

      <Stack gap="xs">
        {rows.map((r, i) => (
          <Group key={r.id} gap="sm" wrap="nowrap">
            <Checkbox
              checked={r.restore}
              onChange={(e) => {
                const v = e.currentTarget.checked;
                setRows((prev) => {
                  const next = [...prev];
                  next[i] = { ...next[i], restore: v };
                  return next;
                });
              }}
              disabled={pending}
              label="復活"
            />

            <TextInput
              value={r.name}
              onChange={(e) => {
                const v = e.currentTarget.value;
                setRows((prev) => {
                  const next = [...prev];
                  next[i] = { ...next[i], name: v };
                  return next;
                });
              }}
              placeholder="費目名"
              w={360}
              disabled={pending}
            />
          </Group>
        ))}
      </Stack>

      <Group justify="flex-end">
        <Button onClick={onSave} disabled={!canSave || pending}>
          保存
        </Button>
      </Group>
    </Stack>
  );
};

export default DeletedCategoryEditorClient;

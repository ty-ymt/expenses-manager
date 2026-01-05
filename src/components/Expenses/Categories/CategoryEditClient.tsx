"use client";

import {
  ActionIcon,
  Button,
  Group,
  Paper,
  Stack,
  TextInput,
} from "@mantine/core";
import {
  IconArrowDown,
  IconArrowUp,
  IconMinus,
  IconPlus,
} from "@tabler/icons-react";
import { useMemo, useState, useTransition } from "react";
import { saveActiveCategories } from "@/lib/expenses/categories/actions";
import type { CategoryEditRow } from "@/types/categories";

const emptyRow = (): CategoryEditRow => ({
  id: undefined,
  name: "",
  deleted: false,
});

export default function CategoryEditClient({
  initialRows,
}: {
  initialRows: CategoryEditRow[];
}) {
  const [rows, setRows] = useState<CategoryEditRow[]>(
    initialRows.length > 0 ? initialRows : [emptyRow()],
  );

  const [isPending, startTransition] = useTransition();

  // 表示は deleted=false のものだけ
  const visibleRows = useMemo(() => rows.filter((r) => !r.deleted), [rows]);

  const canRemove = visibleRows.length > 1;

  const insertRowAfter = (idx: number) => {
    setRows((prev) => {
      const next = [...prev];

      // 表示行の idx を、rows の index に変換
      const visibleIndexes = prev
        .map((r, i) => ({ r, i }))
        .filter(({ r }) => !r.deleted)
        .map(({ i }) => i);

      const realIdx =
        visibleIndexes[idx] ?? visibleIndexes[visibleIndexes.length - 1];
      next.splice(realIdx + 1, 0, emptyRow());
      return next;
    });
  };

  const removeRow = (idx: number) => {
    setRows((prev) => {
      const visibleIndexes = prev
        .map((r, i) => ({ r, i }))
        .filter(({ r }) => !r.deleted)
        .map(({ i }) => i);

      if (visibleIndexes.length <= 1) return prev;

      const realIdx = visibleIndexes[idx];
      if (realIdx === undefined) return prev;

      const row = prev[realIdx];

      // 新規は物理的に除去、既存は論理削除へ
      if (!row.id) {
        const next = prev.filter((_, i) => i !== realIdx);
        return next.length > 0 ? next : [emptyRow()];
      }

      return prev.map((r, i) => (i === realIdx ? { ...r, deleted: true } : r));
    });
  };

  const move = (idx: number, dir: -1 | 1) => {
    setRows((prev) => {
      const next = [...prev];

      const visibleIndexes = prev
        .map((r, i) => ({ r, i }))
        .filter(({ r }) => !r.deleted)
        .map(({ i }) => i);

      const from = visibleIndexes[idx];
      const to = visibleIndexes[idx + dir];
      if (from === undefined || to === undefined) return prev;

      const tmp = next[from];
      next[from] = next[to];
      next[to] = tmp;

      return next;
    });
  };

  const updateName = (idx: number, name: string) => {
    setRows((prev) => {
      const next = [...prev];

      const visibleIndexes = prev
        .map((r, i) => ({ r, i }))
        .filter(({ r }) => !r.deleted)
        .map(({ i }) => i);

      const realIdx = visibleIndexes[idx];
      if (realIdx === undefined) return prev;

      next[realIdx] = { ...next[realIdx], name };
      return next;
    });
  };

  const onSave = () => {
    startTransition(async () => {
      const res = await saveActiveCategories(rows);
      if (!res.ok) {
        // ここは通知UIに置き換えてOK
        alert(res.message);
        return;
      }
      alert("保存しました");
    });
  };

  return (
    <Paper withBorder p="md" radius="sm">
      <Stack gap="xs">
        {visibleRows.map((r, idx) => (
          <Group key={r.id ?? `new-${idx}`} gap="xs" wrap="nowrap">
            <ActionIcon
              variant="subtle"
              onClick={() => move(idx, -1)}
              disabled={idx === 0}
              aria-label="上へ"
            >
              <IconArrowUp size={16} />
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              onClick={() => move(idx, 1)}
              disabled={idx === visibleRows.length - 1}
              aria-label="下へ"
            >
              <IconArrowDown size={16} />
            </ActionIcon>

            <TextInput
              value={r.name}
              onChange={(e) => updateName(idx, e.currentTarget.value)}
              placeholder="費目名"
              w="100%"
            />

            <ActionIcon
              variant="subtle"
              onClick={() => insertRowAfter(idx)}
              aria-label="追加"
            >
              <IconPlus size={16} />
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => removeRow(idx)}
              disabled={!canRemove}
              aria-label="削除"
            >
              <IconMinus size={16} />
            </ActionIcon>
          </Group>
        ))}

        <Group justify="flex-end" mt="sm">
          <Button onClick={onSave} loading={isPending}>
            保存
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

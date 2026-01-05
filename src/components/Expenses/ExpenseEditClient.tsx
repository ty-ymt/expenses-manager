"use client";

import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useMemo, useState, useTransition } from "react";
import { saveProjectExpenses } from "@/lib/expenses/edit/actions";
import type { ExpenseCategoryOption, ExpenseEditRow } from "@/types/expenses";

const emptyRow = (): ExpenseEditRow => ({
  id: null,
  receipt_date: "", // "YYYY-MM-DD"
  category_id: null,
  remarks: "",
  amount: "",
});

export default function ExpenseEditClient({
  projectId,
  categories,
  initialRows,
}: {
  projectId: string;
  categories: ExpenseCategoryOption[];
  initialRows: ExpenseEditRow[];
}) {
  const [rows, setRows] = useState<ExpenseEditRow[]>(
    initialRows.length > 0 ? initialRows : [emptyRow()],
  );

  const [isPending, startTransition] = useTransition();

  const visibleRows = useMemo(() => rows.filter((r) => !r._delete), [rows]);
  const canRemove = visibleRows.length > 1;

  const getVisibleIndexes = (list: ExpenseEditRow[]) =>
    list
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => !r._delete)
      .map(({ i }) => i);

  const insertAfter = (visibleIdx: number) => {
    setRows((prev) => {
      const next = [...prev];
      const vIdxs = getVisibleIndexes(prev);

      const realIdx = vIdxs[visibleIdx];
      if (realIdx === undefined) {
        next.push(emptyRow());
        return next;
      }

      next.splice(realIdx + 1, 0, emptyRow());
      return next;
    });
  };

  const removeRow = (visibleIdx: number) => {
    setRows((prev) => {
      const vIdxs = getVisibleIndexes(prev);
      if (vIdxs.length <= 1) return prev;

      const realIdx = vIdxs[visibleIdx];
      if (realIdx === undefined) return prev;

      const row = prev[realIdx];

      // 新規行は物理削除
      if (!row.id) {
        const next = prev.filter((_, i) => i !== realIdx);
        const remaining = next.filter((x) => !x._delete);
        return remaining.length > 0 ? next : [emptyRow()];
      }

      // 既存行は削除フラグ
      const next = prev.map((r, i) =>
        i === realIdx ? { ...r, _delete: true } : r,
      );
      const remaining = next.filter((x) => !x._delete);
      return remaining.length > 0 ? next : [emptyRow()];
    });
  };

  const update = (visibleIdx: number, patch: Partial<ExpenseEditRow>) => {
    setRows((prev) => {
      const vIdxs = getVisibleIndexes(prev);
      const realIdx = vIdxs[visibleIdx];
      if (realIdx === undefined) return prev;

      const next = [...prev];
      next[realIdx] = { ...next[realIdx], ...patch };
      return next;
    });
  };

  const onSave = () => {
    startTransition(async () => {
      const res = await saveProjectExpenses(projectId, rows);
      if (!res.ok) {
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
          <Group
            key={r.id ?? `new-${idx}`}
            gap="xs"
            wrap="nowrap"
            align="flex-end"
          >
            {/* 日付: string で統一 */}
            <DateInput
              label="日付"
              value={r.receipt_date || null}
              onChange={(v) => update(idx, { receipt_date: v ?? "" })}
              valueFormat="YYYY-MM-DD"
              clearable
              w={170}
            />

            <Select
              label="費目"
              data={categories}
              value={r.category_id}
              onChange={(v) => update(idx, { category_id: v })}
              searchable
              clearable
              w={200}
            />

            <TextInput
              label="内容"
              value={r.remarks}
              onChange={(e) => update(idx, { remarks: e.currentTarget.value })}
              w={320}
            />

            <NumberInput
              label="金額"
              value={r.amount === "" ? "" : Number(r.amount)}
              onChange={(v) =>
                update(idx, { amount: v === "" ? "" : String(v) })
              }
              min={0}
              decimalScale={2}
              fixedDecimalScale
              thousandSeparator=","
              w={160}
            />

            <ActionIcon
              variant="subtle"
              onClick={() => insertAfter(idx)}
              aria-label="追加"
              mt={22}
            >
              <IconPlus size={16} />
            </ActionIcon>

            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => removeRow(idx)}
              disabled={!canRemove}
              aria-label="削除"
              mt={22}
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

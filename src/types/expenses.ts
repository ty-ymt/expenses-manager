export type ExpenseCategoryOption = {
  value: string; // category_id (stringified bigint)
  label: string; // category name
};

export type ExpenseEditRow = {
  id: string | null; // Expense.id
  receipt_date: string; // "YYYY-MM-DD"
  category_id: string | null;
  remarks: string;
  amount: string; // Decimal を string で持つ
  _delete?: boolean; // UI用（既存行削除フラグ）
};

export type SaveExpensesResult = { ok: true } | { ok: false; message: string };

import { Title } from "@mantine/core";
import ExpenseProjectListClient from "@/components/Expenses/ExpenseProjectListClient";
import { getAllExpenseProjects } from "@/lib/expenses/queries";

export const ExpensesPage = async () => {
  const projects = await getAllExpenseProjects();

  return (
    <>
      <Title order={2} mb="md">
        経費一覧
      </Title>

      <ExpenseProjectListClient projects={projects} />
    </>
  );
};

export default ExpensesPage;

import { Title } from "@mantine/core";
import CompletedExpenseProjectList from "@/components/Expenses/CompletedExpenseProjectList";
import { getAllExpenseProjects } from "@/lib/expenses/queries";

export const CompletedExpensesPage = async () => {
  const projects = await getAllExpenseProjects();
  return (
    <>
      <Title order={2} mb="md">
        完了済経費一覧
      </Title>

      <CompletedExpenseProjectList projects={projects} />
    </>
  );
};

export default CompletedExpensesPage;

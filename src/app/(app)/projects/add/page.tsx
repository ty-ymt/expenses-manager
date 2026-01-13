import { Title } from "@mantine/core";
import { ProjectAddForm } from "@/components/Projects/ProjectAddForm";
import { createProjectAction } from "./actions";

export const ProjectAddPage = () => {
  return (
    <>
      <Title order={2} mb="md">
        案件登録
      </Title>

      <ProjectAddForm action={createProjectAction} />
    </>
  );
};

export default ProjectAddPage;

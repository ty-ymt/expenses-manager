import { Title } from "@mantine/core";
import CompletedProjectListClient from "@/components/Projects/CompletedProjectList";
import { getAllProjects } from "@/lib/projects/queries";

export const ProjectPage = async () => {
  const projects = await getAllProjects();

  return (
    <>
      <Title order={2} mb="md">
        完了済案件一覧
      </Title>

      <CompletedProjectListClient projects={projects} />
    </>
  );
};

export default ProjectPage;

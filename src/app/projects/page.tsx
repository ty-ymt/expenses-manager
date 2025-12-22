import { Title } from "@mantine/core";
import ProjectListClient from "@/components/Projects/ProjectsListClient";
import { getAllProjects } from "@/lib/projects/queries";

export const ProjectPage = async () => {
  const projects = await getAllProjects();

  return (
    <>
      <Title order={2} mb="md">
        案件一覧
      </Title>

      <ProjectListClient projects={projects} />
    </>
  );
};

export default ProjectPage;

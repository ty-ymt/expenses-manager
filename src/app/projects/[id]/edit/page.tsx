import { Group, Title } from "@mantine/core";
import { notFound } from "next/navigation";
import { ProjectEditForm } from "@/components/Projects/ProjectEditForm";
import { BackLink } from "@/components/ui/BackLink";
import { toJstDay } from "@/lib/date";
import { getProjectById } from "@/lib/projects/queries";

export const ProjectEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  if (!/^\d+$/.test(id)) notFound();
  const projectId = BigInt(id);

  const project = await getProjectById(projectId);
  if (!project) notFound();

  const startStr = toJstDay(project.start_dt)?.toISODate() ?? "";
  const endStr = toJstDay(project.end_dt)?.toISODate() ?? "";

  return (
    <>
      <Group justify="space-between" align="flex-end" mb="md">
        <Title order={2}>案件編集</Title>
        <BackLink href={`/projects/${project.id}`} label="詳細へ戻る" />
      </Group>

      <ProjectEditForm
        project={{
          id: project.id.toString(),
          cd: project.cd,
          name: project.name,
          remarks: project.remarks ?? "",
          start_dt: startStr,
          end_dt: endStr,
          completed: project.completed,
        }}
      />
    </>
  );
};

export default ProjectEditPage;

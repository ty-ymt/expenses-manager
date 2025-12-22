import {
  Checkbox,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/ui/BackLink";
import FormActions from "@/components/ui/Form/FormActions";
import { SubmitButton } from "@/components/ui/Form/FormButtons";
import { formatDate, formatDateRange } from "@/lib/date";
import { getProjectById } from "@/lib/projects/queries";

export const ProjectDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  let projectId: bigint;
  try {
    projectId = BigInt(id);
  } catch (error) {
    console.log(error);
    notFound();
  }

  const project = await getProjectById(projectId);
  if (!project) notFound();

  return (
    <>
      <Group justify="space-between" align="flex-end" mb="md">
        <Title order={2}>案件詳細</Title>

        <BackLink href="/projects" />
      </Group>

      <Paper p="md" withBorder radius="sm">
        <Stack gap="sm">
          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              案件コード
            </Text>
            <Text fw={600}>{project.cd}</Text>
          </Stack>

          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              案件名
            </Text>
            <Text fw={600}>{project.name}</Text>
          </Stack>

          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              期間
            </Text>
            <Text>{formatDateRange(project.start_dt, project.end_dt)}</Text>
          </Stack>

          <Group justify="space-between" align="center">
            <Stack gap={2}>
              <Text size="xs" c="dimmed">
                完了
              </Text>
              <Checkbox
                checked={project.completed}
                readOnly
                label={project.completed ? "完了" : "未完了"}
              />
            </Stack>

            {project.completed && project.completed_at ? (
              <Stack gap={2} style={{ textAlign: "right" }}>
                <Text size="xs" c="dimmed">
                  完了日
                </Text>
                <Text>{formatDate(project.completed_at)}</Text>
              </Stack>
            ) : null}
          </Group>

          <Divider />

          <Stack gap={2}>
            <Text size="xs" c="dimmed">
              備考
            </Text>
            {project.remarks ? (
              <Text style={{ whitespace: "pre-wrap" }}>{project.remarks}</Text>
            ) : (
              <Text c="dimmed" size="sm">
                （なし）
              </Text>
            )}
          </Stack>
        </Stack>
        <FormActions>
          <Link
            href={`/projects/${project.id}/edit`}
            style={{ textDecoration: "none" }}
          >
            <SubmitButton>編集</SubmitButton>
          </Link>
        </FormActions>
      </Paper>
    </>
  );
};

export default ProjectDetailPage;

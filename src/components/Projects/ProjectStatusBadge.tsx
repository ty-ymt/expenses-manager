import { Badge } from "@mantine/core";
import { PROJECT_STATUS_LABEL, type ProjectStatus } from "@/types/projects";

const STATUS_COLOR: Record<ProjectStatus, string> = {
  undecided: "gray",
  not_started: "yellow",
  in_progress: "blue",
  ended: "orange",
  completed: "green",
};

export const ProjectStatusBadge = ({ status }: { status: ProjectStatus }) => {
  return (
    <Badge variant="light" color={STATUS_COLOR[status]} size="lg">
      {PROJECT_STATUS_LABEL[status]}
    </Badge>
  );
};

export default ProjectStatusBadge;

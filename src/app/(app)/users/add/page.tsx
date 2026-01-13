import { Group, Title } from "@mantine/core";
import UserEditFormClient from "@/components/Users/UserEditFormClient";
import { BackLink } from "@/components/ui/BackLink";

export default async function UserAddPage() {
  return (
    <>
      <Group justify="space-between" align="flex-end" mb="md">
        <Title order={2}>ユーザー新規作成</Title>
        <BackLink defaultHref="/users" label="一覧へ戻る" />
      </Group>

      <UserEditFormClient
        initial={{
          name: "",
          email: "",
          role: "user",
        }}
      />
    </>
  );
}

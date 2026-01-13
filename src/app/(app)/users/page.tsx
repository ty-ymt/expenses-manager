// src/app/users/page.tsx
import { Title } from "@mantine/core";
import UserListClient from "@/components/Users/UserListClient";
import { getActiveUsers } from "@/lib/users/queries";

export default async function UsersPage() {
  const users = await getActiveUsers();

  return (
    <>
      <Title order={2} mb="md">
        ユーザー一覧
      </Title>

      <UserListClient users={users} />
    </>
  );
}

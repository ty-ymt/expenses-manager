import { Group, Title } from "@mantine/core";
import { notFound } from "next/navigation";
import UserEditFormClient from "@/components/Users/UserEditFormClient";
import { BackLink } from "@/components/ui/BackLink";
import { getUserById } from "@/lib/users/queries";

export default async function UserEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let userId: bigint;
  try {
    userId = BigInt(id);
  } catch {
    notFound();
  }

  const user = await getUserById(userId);
  if (!user) notFound();

  return (
    <>
      <Group justify="space-between" align="flex-end" mb="md">
        <Title order={2}>ユーザー編集</Title>
        <BackLink defaultHref={`/users/${user.id}`} label="詳細へ戻る" />
      </Group>

      <UserEditFormClient
        initial={{
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role as "admin" | "user",
        }}
      />
    </>
  );
}

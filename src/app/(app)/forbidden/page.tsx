import { Button, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <Stack gap="md">
      <Title order={2}>アクセス権限がありません</Title>

      <Text c="dimmed">
        このページを表示する権限がありません。必要な場合は管理者にお問い合わせください。
      </Text>

      <Link href="/">
        <Button variant="light" w="fit-content">
          トップへ戻る
        </Button>
      </Link>
    </Stack>
  );
}

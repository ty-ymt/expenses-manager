import { Box, Title } from "@mantine/core";
import SigninForm from "@/components/Auth/SigninForm";

export default function SigninPage() {
  return (
    <Box maw={600} mx="auto">
      <Title order={2} mb="md">
        サインイン
      </Title>

      <SigninForm />
    </Box>
  );
}

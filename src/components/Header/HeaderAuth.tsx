import { AppShellHeader, Group, Text } from "@mantine/core";

export const HeaderAuth = () => {
  return (
    <AppShellHeader>
      <Group h="100%" px="md">
        <Text fw={600} size="lg" style={{ cursor: "pointer" }}>
          Expenses Manager
        </Text>
      </Group>
    </AppShellHeader>
  );
};

export default HeaderAuth;

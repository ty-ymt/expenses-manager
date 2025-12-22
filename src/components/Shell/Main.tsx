import { AppShellMain, Box } from "@mantine/core";

export const Main = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box bg="#FAFAFA">
      <AppShellMain maw={1200} mx="auto" p="md" mt={60}>
        {children}
      </AppShellMain>
    </Box>
  );
};

export default Main;

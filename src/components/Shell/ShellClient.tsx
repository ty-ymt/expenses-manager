"use client";

import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createContext, useContext, useEffect } from "react";

const ShellContext = createContext<{
  opened: boolean;
  toggle: () => void;
  close: () => void;
} | null>(null);

export const useShell = () => {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error("useShell must be used within ShellClient");
  return ctx;
};

export const ShellClient = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle, close }] = useDisclosure(false);

  useEffect(() => {
    console.log("ShellClient mounted");
    return () => console.log("ShellClient unmounted");
  }, []);

  return (
    <ShellContext.Provider value={{ opened, toggle, close }}>
      <AppShell
        header={{ height: 64 }}
        navbar={{
          width: 260,
          breakpoint: "sm",
          collapsed: { mobile: !opened, desktop: !opened },
        }}
        padding="md"
      >
        {children}
      </AppShell>
    </ShellContext.Provider>
  );
};

export default ShellClient;

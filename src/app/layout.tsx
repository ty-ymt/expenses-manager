import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import type { Metadata } from "next";
import HeaderServer from "@/components/Header/HeaderServer";
import NavbarServer from "@/components/Navbar/NavbarServer";
import Main from "@/components/Shell/Main";
import ShellClient from "@/components/Shell/ShellClient";

export const metadata: Metadata = {
  title: "Expenses Manager",
  description: "案件情報と経費管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <MantineProvider defaultColorScheme="auto">
          <ShellClient>
            <HeaderServer />
            <NavbarServer />
            <Main>{children}</Main>
          </ShellClient>
        </MantineProvider>
      </body>
    </html>
  );
}

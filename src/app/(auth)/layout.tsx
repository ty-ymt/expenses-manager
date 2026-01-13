import HeaderAuth from "@/components/Header/HeaderAuth";
import Main from "@/components/Shell/Main";
import ShellClient from "@/components/Shell/ShellClient";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShellClient>
      <HeaderAuth />
      <Main>{children}</Main>
    </ShellClient>
  );
}

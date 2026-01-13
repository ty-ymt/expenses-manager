import HeaderServer from "@/components/Header/HeaderServer";
import NavbarServer from "@/components/Navbar/NavbarServer";
import Main from "@/components/Shell/Main";
import ShellClient from "@/components/Shell/ShellClient";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getCurrentProfile();

  return (
    <ShellClient>
      <HeaderServer profile={profile} />
      <NavbarServer profile={profile} />
      <Main>{children}</Main>
    </ShellClient>
  );
}

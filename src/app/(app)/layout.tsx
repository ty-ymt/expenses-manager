import { redirect } from "next/navigation";
import HeaderServer from "@/components/Header/HeaderServer";
import NavbarServer from "@/components/Navbar/NavbarServer";
import Main from "@/components/Shell/Main";
import ShellClient from "@/components/Shell/ShellClient";
import createClient from "@/lib/platform/supabaseServer";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/signin");
  }

  return (
    <ShellClient>
      <HeaderServer />
      <NavbarServer />
      <Main>{children}</Main>
    </ShellClient>
  );
}

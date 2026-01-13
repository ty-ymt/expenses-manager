import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth/getCurrentProfile";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (profile.role !== "admin") {
    redirect("/forbidden");
  }

  return children;
}

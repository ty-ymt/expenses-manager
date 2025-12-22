import type { Role } from "@/types/header";
import HeaderClient from "./HeaderClient";

type HeaderUser = {
  name: string | null;
  email: string | null;
  role: Role;
};

export const HeaderServer = async () => {
  //TODO: Supabaseで取得
  const user: HeaderUser = {
    name: "山本 哲也",
    email: "yamamoto.tetsuya@coresite.ne.jp",
    role: "admin",
  };

  const displayName = (user.name ?? "").trim();
  const displayEmail = (user.email ?? "").trim();

  return <HeaderClient displayName={displayName} displayEmail={displayEmail} />;
};

export default HeaderServer;

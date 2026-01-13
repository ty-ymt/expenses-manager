import type { Profile } from "@/types/header";
import HeaderClient from "./HeaderClient";

export const HeaderServer = async ({ profile }: { profile: Profile }) => {
  return (
    <HeaderClient
      displayName={(profile?.name ?? "").trim()}
      displayEmail={(profile?.email ?? "").trim()}
    />
  );
};

export default HeaderServer;

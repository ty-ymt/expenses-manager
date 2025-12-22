import type { HeaderMenuItem, Role } from "@/types/header";
import NavbarClient from "./NavbarClient";

export const NavbarServer = async () => {
  const role: Role = "admin";

  const baseMenu: HeaderMenuItem[] = [
    { label: "案件管理", href: "/projects", icon: "projects" },
    { label: "経費管理", href: "/expenses", icon: "expenses" },
  ];

  const MenuItems: HeaderMenuItem[] =
    role === "admin"
      ? [...baseMenu, { label: "ユーザー管理", href: "/users", icon: "users" }]
      : baseMenu;
  return <NavbarClient menuItems={MenuItems} />;
};

export default NavbarServer;

import type { HeaderMenuItem, Role } from "@/types/header";
import NavbarClient from "./NavbarClient";

export const NavbarServer = async () => {
  const role: Role = "admin";

  const baseMenu: HeaderMenuItem[] = [
    {
      label: "案件管理",
      icon: "projects",
      children: [
        { label: "案件一覧", href: "/projects" },
        { label: "完了済案件一覧", href: "/projects/completed" },
        { label: "新規案件登録", href: "/projects/add" },
      ],
    },
    {
      label: "経費管理",
      icon: "expenses",
      children: [
        { label: "経費一覧", href: "/expenses" },
        { label: "完了済経費一覧", href: "/expenses/completed" },
        { label: "費目管理", href: "/expenses/categories" },
      ],
    },
  ];

  const MenuItems: HeaderMenuItem[] =
    role === "admin"
      ? [...baseMenu, { label: "ユーザー管理", href: "/users", icon: "users" }]
      : baseMenu;
  return <NavbarClient menuItems={MenuItems} />;
};

export default NavbarServer;

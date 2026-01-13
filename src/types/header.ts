export type Role = "admin" | "user" | "guest";
export type MenuIcon = "projects" | "expenses" | "users";

export type HeaderMenuItem = {
  label: string;
  href?: string;
  icon?: MenuIcon;
  children?: HeaderMenuItem[];
};

export type UserMenuItem = {
  displayName: string;
  displayEmail: string;
};

export type UserMenuProps = UserMenuItem & {
  onSignOut: () => void | Promise<void>;
};

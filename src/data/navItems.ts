import type { LucideIcon } from "lucide-react";
import {
  FileTextIcon,
  LayoutGridIcon,
  UserIcon,
} from "lucide-react";

export type NavItemsType = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const navItems = (role: string): NavItemsType[] => [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGridIcon },
  ...(role === "admin"
    ? [{ name: "User & Department", href: "/employees", icon: UserIcon }]
    : []),
  { name: "Data", href: "/datas", icon: FileTextIcon },
];

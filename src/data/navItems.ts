import type { LucideIcon } from "lucide-react";
import {
  FileTextIcon,
  LayoutGridIcon,
  Tag,
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
  { name: "Tags", href: "/tags", icon: Tag },
  { name: "Data", href: "/datas", icon: FileTextIcon },
];

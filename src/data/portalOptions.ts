import type { LucideIcon } from "lucide-react";
import { ShieldIcon, UserIcon } from "lucide-react";

export type PortalOptionsType = {
  to: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const portalOptions: PortalOptionsType[] = [
  {
    to: "/login/admin",
    title: "Admin Portal",
    description:
      "Manage Employee, Departments, Payroll, and system configurations",
    icon: ShieldIcon,
  },
  {
    to: "/login/employee",
    title: "Member Portal",
    description:
      "View your profile, track attendance, request time off, and access payslips",
    icon: UserIcon,
  },
];

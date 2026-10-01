import {
  Building2Icon,
  CalendarIcon,
  CircleAlert,
  Clock,
  DollarSignIcon,
  FileIcon,
  FileTextIcon,
  MailIcon,
  ShieldIcon,
  Tag,
  User2Icon,
  type LucideIcon,
} from "lucide-react";
import type { UserType } from "../types/type";
import useFormatRupiah from "../hooks/FormatNumber";

export type CardsEmployeeType = {
  value: string | number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
};

export type CardsAdminType = {
  value: string | number;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const CardsEmployee = (data: UserType): CardsEmployeeType[] => [
  {
    value: data.name,
    title: "Name",
    subtitle:
      "Manage Employee, Departments, Payroll, and system configurations",
    icon: User2Icon,
  },
  {
    value: data.email,
    title: "Email",
    subtitle:
      "Manage Employee, Departments, Payroll, and system configurations",
    icon: MailIcon,
  },
  {
    value: data?.divisi?.divisi ?? "gk ada",
    title: "Department",
    subtitle:
      "Manage Employee, Departments, Payroll, and system configurations",
    icon: ShieldIcon,
  },
  {
    value: data.id,
    title: "Days Present",
    subtitle:
      "Manage Employee, Departments, Payroll, and system configurations",
    icon: CalendarIcon,
  },
  {
    value: data.id,
    title: "Pending Leaves",
    subtitle:
      "Manage Employee, Departments, Payroll, and system configurations",
    icon: FileIcon,
  },
  {
    value: useFormatRupiah(data.salary),
    title: "Latest Payslip",
    subtitle:
      "Manage Employee, Departments, Payroll, and system configurations",
    icon: DollarSignIcon,
  },
];

export const CardsAdmin = (
  users: number,
  departments: number,
  tags: number,
  events: number,
  myEvents: number,
  saveEvents: number,
): CardsAdminType[] => [
  {
    // saya ingin menambahkan users.length di value ini
    value: users,
    label: "Total User",
    description: "Active Workforce",
    icon: User2Icon,
  },
  {
    value: departments,
    label: "Departments",
    description: "Organization Units",
    icon: Building2Icon,
  },
  {
    value: tags,
    label: "Tags",
    description: "Checked in Today",
    icon: Tag,
  },
  {
    value: events,
    label: "Global Data (No Private)",
    description: "Awaiting Approval",
    icon: FileTextIcon,
  },
  {
    value: myEvents,
    label: "My Data",
    description: "Awaiting Approval",
    icon: FileTextIcon,
  },
  {
    value: saveEvents,
    label: "Saving Data",
    description: "Awaiting Approval",
    icon: FileTextIcon,
  },
];

export const CardsAttendance = (data: UserType): CardsEmployeeType[] => [
  {
    value: data.id,
    title: "Days Present",
    subtitle:
      "Manage Employee, Departments, Payroll, and system configurations",
    icon: CalendarIcon,
  },
  {
    value: data.id,
    title: "Late Arrivals",
    subtitle:
      "Manage Employee, Departments, Payroll, and system configurations",
    icon: CircleAlert,
  },
  {
    value: data.phone,
    title: "Avg. Work Hrs",
    subtitle:
      "Manage Employee, Departments, Payroll, and system configurations",
    icon: Clock,
  },
];

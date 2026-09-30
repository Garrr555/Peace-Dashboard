import { Link } from "react-router";
import { useAuthStore } from "../store/auth.store";
import type { UserType } from "../types/type";
import { ArrowRightIcon } from "lucide-react";
import { CardsEmployee } from "../data/cards";

const EmployeeDashboard = (data: UserType) => {
  const cards = CardsEmployee(data ?? "");
  const { user } = useAuthStore();
  return (
    <div className="animate-fade-in">
      <div className="">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Welcome, <span className="text-indigo-600">{user?.name}</span>
        </h1>

        <p className="mt-2 text-sm font-medium text-slate-500">
          <span className="capitalize text-slate-700">{user?.role}</span>
          <span className="mx-2 text-slate-300">•</span>
          <span>{user?.platform || "No Department"}</span>
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <div
            key={i}
            className="relative flex items-center justify-between overflow-hidden p-5 sm:p-6 group my-2 bg-slate-50"
          >
            <div>
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-slate-500/70 group-hover:bg-indigo-500/70" />

              <p className="text-sm font-medium text-slate-700">{card.title}</p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {card.value}
              </p>
            </div>

            <card.icon className="size-10 rounded-lg bg-slate-100 p-2.5 text-slate-600 transition-colors duration-200 group-hover:bg-indigo-50 group-hover:text-indigo-600" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to={"/attendance"}
          className=" text-center inline-flex items-center justify-center gap-2 py-3 px-5 bg-linear-to-r from-indigo-600 to-indigo-500 text-white rounded-md text-sm font-semibold hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-indigo-500/25"
        >
          Mark Attendance
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
        <Link
          to={"/leave"}
          className="text-center bg-slate-50 border border-slate-200 rounded-lg py-3 px-5 transition-all duration-300 hover:bg-indigo-50 hover:border-indigo-400 text-sm"
        >
          Apply for Leave
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDashboard;

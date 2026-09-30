import { LogIn } from "lucide-react";
import { CardsAttendance } from "../data/cards";
import useCurrentUser from "../hooks/useCurrentUser";
import AttendanceHistory from "../components/AttendanceHistory";

const Attendance = () => {
  const { currentUser } = useCurrentUser();
  const cards = currentUser ? CardsAttendance(currentUser) : [];
  return (
    <div className="">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Attendance</h1>
          <p className="text-sm text-slate-500/80">
            Track your work hours and daily check-in
          </p>
        </div>
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
      <div className="my-2">
        <AttendanceHistory />
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <button className="inline-flex items-center justify-center gap-5 py-3 px-5 bg-linear-to-r from-indigo-600 to-indigo-500 text-white rounded-md font-semibold hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-indigo-500/25">
          <LogIn size={25} />
          <div>
            <p>Clock In</p>
            <p className="text-sm font-light">start your work day</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Attendance;

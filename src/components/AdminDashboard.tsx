import { CardsAdmin } from "../data/cards";
import { useAuthStore } from "../store/auth.store";
import useUsers from "../hooks/useUsers";
import useDivisi from "../hooks/useDivisi";
import useTags from "../hooks/useTags";
import useEvents from "../hooks/useEvents";

const AdminDashboard = () => {
  const { userLength } = useUsers();
  const { divisiLength } = useDivisi();
  const { user } = useAuthStore();
  const { tagsLength } = useTags();
  const { eventsLength, myEventLength, saveEventsLength } = useEvents("10000000", "1", "");
  const cards = CardsAdmin(
    userLength,
    divisiLength,
    tagsLength,
    eventsLength,
    myEventLength,
    saveEventsLength,
  );

  return (
    <div className="animate-fade-in">
      <div className="">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h1>

        <p className="mt-2 text-sm font-medium text-slate-500">
          <span className="capitalize text-slate-700">Welcome back</span>
          <span className="mx-2 text-slate-300">•</span>
          <span>
            {user?.role || "No Department"} {user?.name} - here's your overview
          </span>
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

              <p className="text-sm font-medium text-slate-700">{card.label}</p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {card.value}
              </p>
            </div>

            <card.icon className="size-10 rounded-lg bg-slate-100 p-2.5 text-slate-600 transition-colors duration-200 group-hover:bg-indigo-50 group-hover:text-indigo-600" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

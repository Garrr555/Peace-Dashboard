import { Pencil, SearchCheck, Trash2 } from "lucide-react";
import type { BookingType } from "../types/type";
import { useAuthStore } from "../store/auth.store";

type EmployeeCardProps = {
  employee: BookingType | null;
  onEdit: (employee: BookingType) => void;
  onDelete: (employee: BookingType) => void;
  onDetail: (employee: BookingType) => void;
};

const DataSaveCard = ({
  employee,
  onEdit,
  onDelete,
  onDetail,
}: EmployeeCardProps) => {
  const { user } = useAuthStore();
  const initials = employee?.event.name
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Top Section */}
      <div className="relative h-70 bg-linear-to-br from-slate-50 via-slate-50 to-indigo-50/40 flex items-center justify-center">
        {/* Department */}
        <div className="absolute top-4 left-4 z-10 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-slate-600 shadow-sm">
          {employee?.event?.tag?.name || "No Tag"}
        </div>
        {/* Avatar */}{" "}
        {employee?.event.image ? (
          <img
            src={employee.event.image}
            alt={employee.event.name}
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* Bottom Section */}
      <div className="px-6 py-6">
        <h3 className="text-xl font-medium text-slate-800 truncate">
          {employee?.event.name}
        </h3>

        <p className="mt-1 text-sm text-slate-500">{employee?.event.description}</p>
      </div>

      {/* Overlay */}
      <div
        className="
          absolute inset-0 z-20
          flex items-center justify-center
          bg-linear-to-br
          from-indigo-600/85
          via-indigo-500/75
          to-slate-900/85
          opacity-0
          transition-all duration-300
          group-hover:opacity-100
        "
      >
        <div
          className="
            flex items-center gap-3
            translate-y-4 opacity-0
            transition-all duration-300 delay-75
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          {/* Detail */}
          <button
            type="button"
            onClick={() => {
              if (employee) onDetail(employee);
            }}
            className={`
              flex items-center gap-2
              rounded-lg
              bg-white
              px-4 py-2.5
              text-sm font-semibold
              text-indigo-600
              shadow-lg
              transition-all duration-200
              hover:scale-105
              hover:bg-slate-50
              active:scale-95
            `}
          >
            <SearchCheck size={16} />
            Detail
          </button>
          {/* Edit */}
          <button
            type="button"
            onClick={() => {
              if (employee) onEdit(employee);
            }}
            className={`
              flex items-center gap-2
              rounded-lg
              bg-white
              px-4 py-2.5
              text-sm font-semibold
              text-indigo-600
              shadow-lg
              transition-all duration-200
              hover:scale-105
              hover:bg-slate-50
              active:scale-95
                            ${user?.role !== "admin" && "hidden"}
            `}
          >
            <Pencil size={16} />
            Edit
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => {
              if (employee) onDelete(employee);
            }}
            className={`
              flex items-center gap-2
              rounded-lg
              bg-red-500
              px-4 py-2.5
              text-sm font-semibold
              text-white
              shadow-lg
              transition-all duration-200
              hover:scale-105
              hover:bg-red-600
              active:scale-95
                            ${user?.role !== "admin" && "hidden"}
            `}
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataSaveCard;

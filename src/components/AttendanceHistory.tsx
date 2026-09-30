const attendanceData = [
  {
    id: 1,
    date: "Sep 30, 2026",
    day: "Wednesday",
    checkIn: "08:02 AM",
    checkOut: "05:04 PM",
    workingHours: "9h 02m",
    dayType: "Regular",
    status: "Present",
  },
  {
    id: 2,
    date: "Sep 29, 2026",
    day: "Tuesday",
    checkIn: "08:15 AM",
    checkOut: "05:10 PM",
    workingHours: "8h 55m",
    dayType: "Regular",
    status: "Present",
  },
  {
    id: 3,
    date: "Sep 28, 2026",
    day: "Monday",
    checkIn: "09:12 AM",
    checkOut: "05:00 PM",
    workingHours: "7h 48m",
    dayType: "Regular",
    status: "Late",
  },
  {
    id: 4,
    date: "Sep 27, 2026",
    day: "Sunday",
    checkIn: "-",
    checkOut: "-",
    workingHours: "-",
    dayType: "Weekend",
    status: "Day Off",
  },
  {
    id: 5,
    date: "Sep 26, 2026",
    day: "Saturday",
    checkIn: "08:00 AM",
    checkOut: "12:30 PM",
    workingHours: "4h 30m",
    dayType: "Half Day",
    status: "Present",
  },
];

const statusStyles: Record<string, string> = {
  Present: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Late: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Absent: "bg-rose-50 text-rose-700 ring-rose-600/20",
  "Day Off": "bg-slate-100 text-slate-600 ring-slate-500/20",
};

const AttendanceHistory = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Attendance History
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Track your recent attendance records
          </p>
        </div>

        <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
          Last 5 records
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              {[
                "Date",
                "Check In",
                "Check Out",
                "Working Hours",
                "Day Type",
                "Status",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {attendanceData.map((item) => (
              <tr
                key={item.id}
                className="transition-colors duration-150 hover:bg-slate-50/80"
              >
                {/* Date */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-slate-800">{item.date}</div>
                  <div className="mt-1 text-xs text-slate-400">{item.day}</div>
                </td>

                {/* Check In */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm font-medium text-slate-700">
                    {item.checkIn}
                  </span>
                </td>

                {/* Check Out */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm font-medium text-slate-700">
                    {item.checkOut}
                  </span>
                </td>

                {/* Working Hours */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm font-semibold text-slate-800">
                    {item.workingHours}
                  </span>
                </td>

                {/* Day Type */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                    {item.dayType}
                  </span>
                </td>

                {/* Status */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${
                      statusStyles[item.status] ??
                      "bg-slate-100 text-slate-600 ring-slate-500/20"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
        <p className="text-xs text-slate-500">
          Showing <span className="font-medium text-slate-700">5</span> of{" "}
          <span className="font-medium text-slate-700">5</span> records
        </p>

        <button
          className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700"
          type="button"
        >
          View All
        </button>
      </div>
    </div>
  );
};

export default AttendanceHistory;

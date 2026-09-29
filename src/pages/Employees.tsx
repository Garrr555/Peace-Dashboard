/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import useDivisi from "../hooks/useDivisi";
import Loading from "../components/Loading";
import type { UserType } from "../types/type";
import CustomFetch from "../config/db";
import EmployeeCard from "../components/EmployeeCard";
import { toast } from "react-toastify";
import EmployeeForm from "../components/EmployeeForm";

const Employees = () => {
  const { divisis } = useDivisi();

  const [employees, setEmployees] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<UserType | null>(
    null,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDivisi, setSelectedDivisi] = useState("");
  console.log(employees);

  const getUsersByDivisi = async (id: number) => {
    try {
      setLoading(true);

      if (id == 0) {
        const response = await CustomFetch.get(`/users`);

        setEmployees(response.data.users);
      } else {
        const response = await CustomFetch.get(`/divisis/${id}/users`);

        setEmployees(response.data.users);
      }
    } catch (error) {
      console.error("Failed to load employees:", error);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDivisiChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    setSelectedDivisi(value);

    if (!value) {
      setEmployees([]);
      return;
    }

    getUsersByDivisi(Number(value));
  };

  const handleDeleteUser = async () => {
    if (!selectedEmployee) return;

    try {
      await CustomFetch.delete(`/user/${selectedEmployee.ID}`);

      toast.success("Berhasil Menghapus Employee");

      setShowDeleteModal(false);
      setSelectedEmployee(null);

      getUsersByDivisi(Number(selectedDivisi));
    } catch (error: any) {
      console.log(error);

      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Gagal Menghapus Employee",
      );
    }
  };

  useEffect(() => {
    getUsersByDivisi(0);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Employees</h1>
          <p className="text-sm text-slate-500/80">Manage your Team Members</p>
        </div>

        <button
          onClick={() => {
            setSelectedEmployee(null);
            setShowCreateModal(true);
          }}
          type="button"
          className="w-1/8 py-3 bg-linear-to-r from-indigo-600 to-indigo-500 text-white rounded-md text-sm font-semibold hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          Add Employee
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-in">
        {/* Search Input */}
        <div
          className="
            group relative flex-1
            border border-slate-200
            rounded-lg
            bg-white
            shadow-sm
            transition-all duration-300 ease-out
            hover:border-slate-300
            hover:shadow-md
            focus-within:border-indigo-500
            focus-within:ring-2
            focus-within:ring-indigo-500/10
            focus-within:shadow-md
          "
        >
          <Search
            className="
              absolute left-3 top-1/2 -translate-y-1/2
              w-4 h-4
              text-slate-400
              transition-all duration-300
              group-focus-within:text-indigo-500
              group-focus-within:scale-110
            "
          />

          <input
            type="text"
            placeholder="Search Employees..."
            className="
              w-full
              h-10
              pl-10 pr-4
              bg-transparent
              outline-none
              text-sm text-slate-700
              placeholder:text-slate-400
            "
          />
        </div>

        {/* Department Select */}
        <div
          className="
            relative
            max-w-48 w-full sm:w-auto
            animate-fade-in
          "
        >
          <select
            name="department"
            id="department"
            value={selectedDivisi}
            onChange={handleDivisiChange}
            className="
              w-full
              h-10
              appearance-none
              border border-slate-200
              rounded-lg
              bg-white
              px-3 pr-9
              text-sm text-slate-600
              shadow-sm
              outline-none
              cursor-pointer
              transition-all duration-300 ease-out
              hover:border-slate-300
              hover:shadow-md
              focus:border-indigo-500
              focus:ring-2
              focus:ring-indigo-500/10
              focus:shadow-md
            "
          >
            <option value={0}>All Departments</option>

            {divisis.map((divisi) => (
              <option key={divisi.ID} value={divisi.ID}>
                {(divisi as typeof divisi & { divisi?: string }).divisi}
              </option>
            ))}
          </select>

          {/* Custom Arrow */}
          <div
            className="
              pointer-events-none
              absolute right-3 top-1/2
              -translate-y-1/2
              text-slate-400
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Employee Card */}
      {loading ? (
        <Loading />
      ) : employees.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">
          {selectedDivisi
            ? "No employees found in this department"
            : "Select a department to view employees"}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.ID}
              employee={employee}
              onDelete={(employee) => {
                setSelectedEmployee(employee);
                setShowDeleteModal(true);
              }}
              onEdit={(employee) => {
                setSelectedEmployee(employee);
                setShowCreateModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
        >
          <div className="fixed inset-0" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in"
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedEmployee ? "Edit Employee" : "Add New Employee"}
                </h2>

                <p className="text-sm text-slate-500 mt-0.5">
                  {selectedEmployee
                    ? "Update employee information and account details"
                    : "Create a user account and employee profile"}
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <EmployeeForm
                initialData={selectedEmployee}
                onSuccess={() => {
                  setShowCreateModal(false);
                  setSelectedEmployee(null);
                  getUsersByDivisi(Number(selectedDivisi));
                }}
                onCancel={() => {
                  setShowCreateModal(false);
                  setSelectedEmployee(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedEmployee && (
        <div
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedEmployee(null);
          }}
          className="
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/40
      backdrop-blur-sm
      p-4
      animate-fade-in
    "
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
        relative
        w-full max-w-md
        overflow-hidden
        rounded-2xl
        bg-white
        shadow-2xl
        animate-fade-in
      "
          >
            {/* Gradient Header */}
            <div
              className="
          relative
          flex items-center justify-center
          h-32
          bg-linear-to-br
          from-indigo-600
          via-indigo-500
          to-slate-900
        "
            >
              {/* Decorative circles */}
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-white/10" />

              {/* Delete Icon */}
              <div
                className="
            relative z-10
            flex items-center justify-center
            h-16 w-16
            rounded-full
            bg-white/15
            border border-white/20
            shadow-lg
            backdrop-blur-sm
          "
              >
                <Trash2 className="h-7 w-7 text-white" />
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedEmployee(null);
                }}
                className="
            absolute
            top-4 right-4
            p-2
            rounded-lg
            text-white/70
            hover:text-white
            hover:bg-white/10
            transition-all duration-200
          "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-slate-900">
                  Delete Employee?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-700">
                    {selectedEmployee.name}
                  </span>
                  ?
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  This action cannot be undone.
                </p>
              </div>

              {/* Employee Preview */}
              <div
                className="
            mt-6
            flex items-center gap-3
            rounded-xl
            border border-slate-200
            bg-slate-50
            p-3
          "
              >
                <div
                  className="
              flex h-11 w-11
              shrink-0
              items-center justify-center
              overflow-hidden
              rounded-full
              bg-indigo-100
              text-sm font-semibold
              text-indigo-500
            "
                >
                  {selectedEmployee.image ? (
                    <img
                      src={selectedEmployee.image}
                      alt={selectedEmployee.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    selectedEmployee.name
                      ?.split(" ")
                      .map((name) => name[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {selectedEmployee.name}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {selectedEmployee.divisi?.divisi ||
                      selectedEmployee.department ||
                      "Employee"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="
              flex-1
              rounded-lg
              border border-slate-200
              bg-white
              px-4 py-2.5
              text-sm font-semibold
              text-slate-600
              shadow-sm
              transition-all duration-200
              hover:bg-slate-50
              hover:border-slate-300
              active:scale-[0.98]
            "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteUser}
                  className="
              flex-1
              flex items-center justify-center gap-2
              rounded-lg
              bg-linear-to-r
              from-red-500
              to-red-600
              px-4 py-2.5
              text-sm font-semibold
              text-white
              shadow-lg
              shadow-red-500/20
              transition-all duration-200
              hover:from-red-600
              hover:to-red-700
              hover:shadow-red-500/30
              active:scale-[0.98]
            "
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;

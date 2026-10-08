/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import type { BookingType, EventType } from "../types/type";
import CustomFetch from "../config/db";
import { toast } from "react-toastify";
import useTags from "../hooks/useTags";
import DataCard from "../components/DataCard";
import EventForm from "../components/EventForm";
import useEvents from "../hooks/useEvents";
import { useAuthStore } from "../store/auth.store";
import EventDetail from "../components/EventDetail";
import DataSaveCard from "../components/DataSaveCard";
import TagsForm from "../components/TagForm";

const Tags = () => {
  const [selectedDivisi, setSelectedDivisi] = useState("0");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [search, setSearch] = useState("");

  const { tags } = useTags();
  const { user } = useAuthStore();

  const { events, tagEvent, loading, getEvents, myEvent, saveEvents } =
    useEvents("1000", "1", search, selectedDivisi);

  const [employees, setEmployees] = useState<EventType[]>([]);
  const [saveEmployees, setSaveEmployees] = useState<BookingType[]>([]);

  const [selectedEmployee, setSelectedEmployee] = useState<EventType | null>(
    null,
  );

  const [selectedSaveEmployee, setSelectedSaveEmployee] =
    useState<BookingType | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateDepartmentModal, setShowCreateDepartmentModal] =
    useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDivisiChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDivisi(event.target.value);
  };

  const handleEventChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEvent(event.target.value);
  };

  // Data yang sedang ditampilkan
  const isEmpty =
    selectedEvent === "save"
      ? saveEmployees.length === 0
      : employees.length === 0;

  // Hapus event
  const handleDeleteUser = async () => {
    try {
      if (selectedEvent === "save") {
        if (!selectedSaveEmployee) return;

        await CustomFetch.delete(`/booking/${selectedSaveEmployee.ID}`);

        setSaveEmployees((previous) =>
          previous.filter((booking) => booking.ID !== selectedSaveEmployee.ID),
        );

        setSelectedSaveEmployee(null);
      } else {
        if (!selectedEmployee) return;

        await CustomFetch.delete(`/events/${selectedEmployee.ID}`);

        setSelectedEmployee(null);
        await getEvents();
      }

      toast.success("Berhasil Menghapus Data");
      setShowDeleteModal(false);
    } catch (error: any) {
      console.log(error);

      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Gagal Menghapus Data",
      );
    }
  };

  // Tentukan data berdasarkan pilihan user
  useEffect(() => {
    switch (selectedEvent) {
      case "my":
        setEmployees(myEvent ?? []);
        setSaveEmployees([]);
        break;

      case "save":
        setEmployees([]);
        setSaveEmployees(saveEvents ?? []);
        break;

      case "all":
      default:
        setEmployees(
          selectedDivisi && Number(selectedDivisi) !== 0
            ? (tagEvent ?? [])
            : (events ?? []),
        );
        setSaveEmployees([]);
        break;
    }
  }, [selectedEvent, selectedDivisi, events, tagEvent, myEvent, saveEvents]);

  console.log(saveEmployees)
  console.log(employees)

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Data</h1>
          <p className="text-sm text-slate-500/80">Manage your Data</p>
        </div>

        <div className="flex w-full items-center justify-end gap-2">
          {user?.role === "admin" && (
            <button
              onClick={() => setShowCreateDepartmentModal(true)}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-5 py-3 text-center text-sm transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50"
            >
              <Plus size={16} />
              Add Tag
            </button>
          )}

          <button
            onClick={() => {
              setSelectedEmployee(null);
              setShowCreateModal(true);
            }}
            type="button"
            className="flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-indigo-600 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-700 hover:to-indigo-600 active:scale-[0.98]"
          >
            <Plus size={16} />
            Add Data
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex animate-fade-in flex-col gap-3 sm:flex-row">
        {/* Search */}
        <div className="group relative flex-1 rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:border-slate-300 hover:shadow-md focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-all duration-300 group-focus-within:scale-110 group-focus-within:text-indigo-500" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search Events..."
            className="h-10 w-full bg-transparent pl-10 pr-10 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Data Type */}
        <div className="relative w-full min-w-1/6 max-w-48 sm:w-auto">
          <select
            name="data"
            id="data"
            value={selectedEvent}
            onChange={handleEventChange}
            className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-600 shadow-sm outline-none transition-all duration-300 hover:border-slate-300 hover:shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
          >
            <option value="all">All Data</option>
            <option value="my">My Data</option>
            <option value="save">Save Data</option>
          </select>

          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
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

        {/* Tag Filter */}
        {user?.role === "admin" && (
          <div className="relative w-full min-w-1/6 max-w-48 sm:w-auto">
            <select
              name="tag"
              id="tag"
              value={selectedDivisi}
              onChange={handleDivisiChange}
              disabled={selectedEvent === "save"}
              className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-600 shadow-sm outline-none transition-all duration-300 hover:border-slate-300 hover:shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="0">All Tag</option>

              {tags.map((tag) => (
                <option key={tag.ID} value={tag.ID}>
                  {tag.name}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
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
        )}
      </div>

      {/* Event Cards */}
      {loading ? (
        <Loading />
      ) : isEmpty ? (
        <div className="py-12 text-center text-sm text-slate-400">
          {selectedEvent === "save"
            ? "No saved events available"
            : selectedDivisi && Number(selectedDivisi) !== 0
              ? "No events found for this tag"
              : "No events available"}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {selectedEvent === "save"
            ? saveEmployees.map((booking) => (
                <DataSaveCard
                  key={booking.ID}
                  employee={booking}
                  onDelete={(booking) => {
                    setSelectedSaveEmployee(booking);
                    setShowDeleteModal(true);
                  }}
                  onEdit={(booking) => {
                    setSelectedSaveEmployee(booking);
                    setShowCreateModal(true);
                  }}
                  onDetail={(booking) => {
                    setSelectedSaveEmployee(booking);
                    setShowDetailModal(true);
                  }}
                />
              ))
            : employees.map((event) => (
                <DataCard
                  key={event.ID}
                  employee={event}
                  onDelete={(event) => {
                    setSelectedEmployee(event);
                    setShowDeleteModal(true);
                  }}
                  onEdit={(event) => {
                    setSelectedEmployee(event);
                    setShowCreateModal(true);
                  }}
                  onDetail={(event) => {
                    setSelectedEmployee(event);
                    setShowDetailModal(true);
                  }}
                />
              ))}
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div
          onClick={() => setShowDetailModal(false)}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative my-8 w-full max-w-3xl animate-fade-in rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Detail Data
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Data Information
                </p>
              </div>

              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedEmployee(null);
                  setSelectedSaveEmployee(null);
                }}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {selectedEvent === "save" ? (
                <EventDetail
                  initialData={selectedSaveEmployee?.event || null}
                  onCancel={() => {
                    setShowDetailModal(false);
                    setSelectedSaveEmployee(null);
                  }}
                />
              ) : (
                <EventDetail
                  initialData={selectedEmployee}
                  onCancel={() => {
                    setShowDetailModal(false);
                    setSelectedEmployee(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Event Modal */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative my-8 w-full max-w-3xl animate-fade-in rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedEmployee || selectedSaveEmployee
                    ? "Edit Event"
                    : "Add New Event"}
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  {selectedEmployee || selectedSaveEmployee
                    ? "Update event information"
                    : "Create a new event"}
                </p>
              </div>

              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedEmployee(null);
                  setSelectedSaveEmployee(null);
                }}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <EventForm
                initialData={
                  selectedEmployee || selectedSaveEmployee?.event || null
                }
                onSuccess={async () => {
                  setShowCreateModal(false);
                  setSelectedEmployee(null);
                  setSelectedSaveEmployee(null);
                  await getEvents();
                }}
                onCancel={() => {
                  setShowCreateModal(false);
                  setSelectedEmployee(null);
                  setSelectedSaveEmployee(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Create Tag Modal */}
      {showCreateDepartmentModal && (
        <div
          onClick={() => setShowCreateDepartmentModal(false)}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative my-8 w-full max-w-3xl animate-fade-in rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Add New Tag
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Create a tag for events
                </p>
              </div>

              <button
                onClick={() => setShowCreateDepartmentModal(false)}
                className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <TagsForm
                onSuccess={() => {
                  setShowCreateDepartmentModal(false);
                }}
                onCancel={() => {
                  setShowCreateDepartmentModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (selectedEmployee || selectedSaveEmployee) && (
        <div
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedEmployee(null);
            setSelectedSaveEmployee(null);
          }}
          className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="relative flex h-32 items-center justify-center bg-linear-to-br from-indigo-600 via-indigo-500 to-slate-900">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-white/10" />

              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/15 shadow-lg backdrop-blur-sm">
                <Trash2 className="h-7 w-7 text-white" />
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedEmployee(null);
                  setSelectedSaveEmployee(null);
                }}
                className="absolute right-4 top-4 rounded-lg p-2 text-white/70 transition-all hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-slate-900">
                  Delete {selectedEvent === "save" ? "Saved Item" : "Event"}?
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-700">
                    {selectedEvent === "save"
                      ? selectedSaveEmployee?.event?.name
                      : selectedEmployee?.name}
                  </span>
                  ?
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  This action cannot be undone.
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedEmployee(null);
                    setSelectedSaveEmployee(null);
                  }}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteUser}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-linear-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all hover:from-red-600 hover:to-red-700 active:scale-[0.98]"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tags;

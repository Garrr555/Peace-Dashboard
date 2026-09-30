/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState } from "react";
import CustomFetch from "../config/db";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

interface DEpartmentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const DepartmentForm = ({ onSuccess, onCancel }: DEpartmentFormProps) => {
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Nama divisi wajib diisi");
      return;
    }
    try {
      setLoading(true);
      await CustomFetch.post(`/divisis`, {
        divisi: name.trim(),
      });

      toast.success("Berhasil Membuat Department Baru");

      onSuccess();
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Gagal Menyimpan Employee",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl animate-fade-in"
    >
      {/* Department Information */}
      <div className="border border-slate-100 rounded-xl p-5 sm:p-6">
        <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">
          Department Information
        </h3>
        <div className="grid grid-cols-1 gap-5 text-sm text-slate-700">
          <div>
            <label htmlFor="" className="block mb-2">
              Department Name
            </label>
            <input
              className="border border-slate-100 bg-slate-50 p-2 rounded-lg w-full"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg w-1/8 py-3 bg-linear-to-r from-indigo-600 to-indigo-500 text-white text-sm font-semibold hover:from-indigo-700 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-indigo-500/25 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          Create Department
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm;

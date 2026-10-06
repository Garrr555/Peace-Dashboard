/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import type { EventType } from "../types/type";
import useFormatDate from "../hooks/useFormatDate";
import useTags from "../hooks/useTags";
import CustomFetch from "../config/db";
import { toast } from "react-toastify";
import {
  Download,
  ExternalLink,
  FileText,
  Bookmark,
  Loader,
} from "lucide-react";

interface EventDetailProps {
  initialData: EventType | null;
  onCancel: () => void;
}

const EventDetail = ({ initialData, onCancel }: EventDetailProps) => {
  const { formatDate } = useFormatDate();
  const { tags } = useTags();

  const [loadingAction, setLoadingAction] = useState<
    "data" | "file" | "save" | null
  >(null);

  if (!initialData) {
    return (
      <div className="p-6 text-center text-slate-500">
        Data event tidak ditemukan.
      </div>
    );
  }

  const selectedTag = tags.find((tag) => tag.ID === initialData.tagId);

  const formatPrice = (price: number | undefined) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price ?? 0);
  };

  const detailItems = [
    {
      label: "Name",
      value: initialData.name || "-",
    },
    {
      label: "Upload",
      value: initialData.user?.name || "-",
    },
    {
      label: "Description",
      value: initialData.description || "-",
    },
    {
      label: "Location",
      value: initialData.location || "-",
    },
    {
      label: "Time",
      value: initialData.datetime ? formatDate(initialData.datetime) : "-",
    },
    {
      label: "Tag",
      value: selectedTag?.name || "-",
    },
    {
      label: "Type",
      value: initialData.type || "-",
    },
    {
      label: "Price",
      value: formatPrice(Number(initialData.price)),
    },
    {
      label: "Count",
      value: initialData.count ?? 0,
    },
    {
      label: "Link",
      value: initialData.link ?? "-",
    },
    {
      label: "Live",
      value: initialData.liveLink ?? "-",
    },
  ];

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);
  };

  const handleDownloadData = async () => {
    try {
      setLoadingAction("data");

      const response = await CustomFetch.get(
        `/event/${initialData.ID}/download`,
        {
          responseType: "blob",
        },
      );

      downloadBlob(response.data, `event-${initialData.ID}.png`);

      toast.success("Data event berhasil diunduh");
    } catch (error) {
      console.error(error);
      toast.error("Gagal mendownload data event");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDownloadFile = async () => {
    if (!initialData.file) {
      toast.error("File attachment tidak tersedia");
      return;
    }

    try {
      setLoadingAction("file");

      const response = await CustomFetch.get(
        `/event/${initialData.ID}/download/file`,
        {
          responseType: "blob",
        },
      );

      const filename =
        initialData.file.split("/").pop()?.split("?")[0] ||
        `event-${initialData.ID}-file`;

      downloadBlob(response.data, filename);

      toast.success("File berhasil diunduh");
    } catch (error) {
      console.error(error);
      toast.error("Gagal mendownload file");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSaveData = async () => {
    try {
      setLoadingAction("save");

      await CustomFetch.post("/booking", {
        phone: "1234567890",
        eventId: initialData.ID,
      });

      toast.success("Event berhasil disimpan");
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Gagal menyimpan event");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div className="border border-slate-100 rounded-xl p-5 sm:p-6 space-y-6">
        {/* Event Image */}
        <div>
          <label className="block mb-3 text-slate-500 font-medium text-sm">
            Event Image
          </label>

          {initialData.image ? (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img
                src={initialData.image}
                alt={initialData.name || "Event Image"}
                className="w-full max-h-[400px] object-cover"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-48 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
              <p className="text-sm">No image available</p>
            </div>
          )}
        </div>

        {/* Event Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
          {detailItems.map((item) => (
            <div key={item.label}>
              <label className="block mb-2 text-slate-500 font-medium">
                {item.label}
              </label>

              <div className="border border-slate-100 bg-slate-50 p-3 rounded-lg min-h-10">
                <p className="text-slate-800 break-words whitespace-pre-wrap">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Event Attachment */}
        <div className="border border-slate-100 rounded-xl p-5 sm:p-6">
          <h3 className="font-medium text-slate-800 mb-4">Event Attachment</h3>

          {initialData.file ? (
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-indigo-100 text-indigo-600 shrink-0">
                  <FileText size={22} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    Event Attachment
                  </p>
                  <p className="text-xs text-slate-500">
                    File tersedia untuk dilihat atau diunduh
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={initialData.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition-colors text-sm"
                  title="Open file"
                >
                  <ExternalLink size={16} />
                  <span className="hidden sm:inline">View</span>
                </a>

                <button
                  type="button"
                  onClick={handleDownloadFile}
                  disabled={loadingAction !== null}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm"
                  title="Download file"
                >
                  {loadingAction === "file" ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">
              <FileText size={32} className="mb-2" />
              <p className="text-sm">No attachment available</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={handleDownloadData}
          disabled={loadingAction !== null || !initialData.image}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          {loadingAction === "data" ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <Download size={16} />
          )}
          Download Data
        </button>

        <button
          type="button"
          onClick={handleDownloadFile}
          disabled={loadingAction !== null || !initialData.file}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-700 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          {loadingAction === "file" ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <FileText size={16} />
          )}
          Download File
        </button>

        <button
          type="button"
          onClick={handleSaveData}
          disabled={loadingAction !== null}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          {loadingAction === "save" ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <Bookmark size={16} />
          )}
          Save Data
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loadingAction !== null}
          className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default EventDetail;

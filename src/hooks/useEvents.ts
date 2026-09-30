/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import CustomFetch from "../config/db";
import type { BookingType, EventType } from "../types/type";

const useEvents = (
  limit: string = "6",
  page: string = "1",
  search: string = "",
) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [saveEvents, setSaveEvents] = useState<BookingType[]>([]);
  const [myEvent, setMyEvent] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await CustomFetch.get("/events", {
        params: {
          limit: limit,
          page: page,
          search: search,
        },
      });

      const response2 = await CustomFetch.get("/events/user");
      const response3 = await CustomFetch.get("/booking/user");

      setEvents(response.data.event);
      setMyEvent(response2.data.events);
      setSaveEvents(response3.data.booking);
    } catch (error: any) {
      console.error(error);

      setError(error?.response?.data?.message || "Gagal mengambil data events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return {
    events,
    myEvent,
    saveEvents,
    loading,
    error,
    getEvents,
  };
};

export default useEvents;

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import CustomFetch from "../config/db";
import type { BookingType, EventType } from "../types/type";

const useEvents = (
  limit: string = "6",
  page: string = "1",
  search: string = "",
  id: string | number = "",
) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [eventsLength, setEventsLength] = useState(0);
  const [saveEvents, setSaveEvents] = useState<BookingType[]>([]);
  const [saveEventsLength, setSaveEventsLength] = useState(0);
  const [myEvent, setMyEvent] = useState<EventType[]>([]);
  const [myEventLength, setMyEventLength] = useState(0);
  const [tagEvent, setTagEvent] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await CustomFetch.get("/events", {
        params: {
          limit,
          page,
          search,
        },
      });

      const response2 = await CustomFetch.get("/events/user");
      const response3 = await CustomFetch.get("/booking/user");

      setEvents(response.data.event || []);
      setEventsLength(response.data.event.length);
      setMyEvent(response2.data.events || []);
      setMyEventLength(response2.data.events.length);
      setSaveEvents(response3.data.booking || []);
      setSaveEventsLength(response3.data.booking.length);

      if (!id || Number(id) === 0) {
        setTagEvent(response.data.event || []);
      } else {
        const response4 = await CustomFetch.get(`/events/tag/${id}`);

        const tagData = response4.data.events ?? response4.data;

        setTagEvent(Array.isArray(tagData) ? tagData : []);
      }
    } catch (error: any) {
      console.error("Failed to load events:", error);

      setError(error?.response?.data?.message || "Gagal mengambil data events");

      setTagEvent([]);
    } finally {
      setLoading(false);
    }
  }, [limit, page, search, id]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  return {
    events,
    eventsLength,
    saveEvents,
    saveEventsLength,
    myEvent,
    myEventLength,
    tagEvent,
    loading,
    error,
    getEvents,
  };
};

export default useEvents;

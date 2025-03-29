import { useState, useEffect } from "react";
import { Event } from "../types/event";
import { fetchHomeData, fetchCategoriesForEvents } from "@/utils/eventUtils";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const homeEvents = await fetchHomeData();
        const eventsWithCategories = await fetchCategoriesForEvents(homeEvents);
        setEvents(eventsWithCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  return { events, loading, error };
};

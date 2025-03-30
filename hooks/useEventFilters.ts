// useEventFilters.ts
import { useState, useEffect } from "react";
import { filterEvents, fetchEventsByCategory } from "../utils/eventUtils";
import { useEvents } from "./useEvents";

export const useEventFilters = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Stores category ID
  const [visibleEventsCount, setVisibleEventsCount] = useState<number>(6);
  const [categoryEvents, setCategoryEvents] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { events: allEvents } = useEvents();

  useEffect(() => {
    const fetchCategoryEvents = async () => {
      if (selectedCategory) {
        try {
          setSearchLoading(true);
          const events = await fetchEventsByCategory(selectedCategory); // Expects ID
          console.log("Fetched category events in useEventFilters:", events);
          setCategoryEvents(events);
        } catch (err) {
          setSearchError("Failed to fetch category events");
          console.error("Error fetching category events:", err);
          setCategoryEvents([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setCategoryEvents([]);
      }
    };

    fetchCategoryEvents();
  }, [selectedCategory]);

  const filteredEvents = searchQuery
    ? categoryEvents // Replace with search logic if needed
    : selectedCategory
    ? categoryEvents
    : filterEvents(allEvents, searchQuery, selectedCategory);

  const visibleEvents = filteredEvents.slice(0, visibleEventsCount);

  console.log("useEventFilters - allEvents:", allEvents);
  console.log("useEventFilters - categoryEvents:", categoryEvents);
  console.log("useEventFilters - filteredEvents:", filteredEvents);
  console.log("useEventFilters - visibleEvents:", visibleEvents);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Search query changed:", e.target.value);
    setSearchQuery(e.target.value);
    setVisibleEventsCount(6);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted with query:", searchQuery);
  };

  const handleCategoryChange = (categoryId: string) => {
    console.log("Category changed in useEventFilters:", categoryId);
    setSelectedCategory(categoryId === "All" ? "" : categoryId); // Expects ID
    setVisibleEventsCount(6);
  };

  const loadMoreEvents = () => {
    console.log("Loading more events, new count:", visibleEventsCount + 6);
    setVisibleEventsCount((prev) => prev + 6);
  };

  return {
    searchQuery,
    selectedCategory,
    visibleEvents,
    filteredEvents,
    handleSearchChange,
    handleSearchSubmit,
    handleCategoryChange,
    loadMoreEvents,
    searchLoading,
    searchError,
  };
};

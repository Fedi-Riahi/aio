import { useState, useEffect } from "react";
import { filterEvents, fetchEventsByCategory } from "../utils/eventUtils";
import { useEvents } from "./useEvents";

export const useEventFilters = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [visibleEventsCount, setVisibleEventsCount] = useState<number>(6);
  const [categoryEvents, setCategoryEvents] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { events: allEvents } = useEvents();

  useEffect(() => {
    const fetchCategoryEvents = async () => {
      if (selectedCategory) {
        try {
          setSearchLoading(true);
          const events = await fetchEventsByCategory(selectedCategory);
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

  const filterEventsAndOwners = (events: any[], query: string) => {
    if (!query) return events;

    const lowerCaseQuery = query.toLowerCase();
    
    return events.filter(event => {
      // Check event fields
      const eventMatch = 
        event.title?.toLowerCase().includes(lowerCaseQuery) ||
        event.description?.toLowerCase().includes(lowerCaseQuery) ||
        event.location?.toLowerCase().includes(lowerCaseQuery);

      // Check owner fields
      const ownerMatch = 
        event.owner?.name?.toLowerCase().includes(lowerCaseQuery) ||
        event.owner?.email?.toLowerCase().includes(lowerCaseQuery);

      return eventMatch || ownerMatch;
    });
  };

  const filteredEvents = (() => {
    if (searchResults.length > 0) {
      return searchResults;
    } else if (searchQuery) {
      return filterEventsAndOwners(
        selectedCategory ? categoryEvents : allEvents,
        searchQuery
      );
    } else if (selectedCategory) {
      return categoryEvents;
    } else {
      return allEvents;
    }
  })();

  const visibleEvents = filteredEvents.slice(0, visibleEventsCount);

  console.log("useEventFilters - allEvents:", allEvents);
  console.log("useEventFilters - categoryEvents:", categoryEvents);
  console.log("useEventFilters - searchResults:", searchResults);
  console.log("useEventFilters - filteredEvents:", filteredEvents);
  console.log("useEventFilters - visibleEvents:", visibleEvents);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Search query changed:", e.target.value);
    setSearchQuery(e.target.value);
    setSearchResults([]);
    setVisibleEventsCount(6); 
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted with query:", searchQuery);
  };

  const handleCategoryChange = (categoryId: string) => {
    console.log("Category changed in useEventFilters:", categoryId);
    setSelectedCategory(categoryId === "All" ? "" : categoryId);
    setSearchResults([]);
    setVisibleEventsCount(6);
  };

  const handleSearchResults = (events: any[]) => {
    console.log("Setting search results in useEventFilters:", events);
    if (JSON.stringify(events) !== JSON.stringify(searchResults)) {
      setSearchResults(events);
      setVisibleEventsCount(6);
    }
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
    handleSearchResults,
    loadMoreEvents,
    searchLoading,
    searchError,
  };
};
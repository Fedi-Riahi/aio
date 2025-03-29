import { useState, useEffect } from "react";
import { Event } from "../types/event";
import { filterEvents } from "../utils/eventUtils";
import { useEvents } from "./useEvents";
import { useSearchBar } from "./useSearchBar";

export const useEventFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleEventsCount, setVisibleEventsCount] = useState(6);

  const { events: allEvents } = useEvents();

  const {
    events: searchedEvents,
    owners: searchedOwners,
    searchLoading,
    error: searchError,
  } = useSearchBar({
    searchQuery,
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setSearchQuery(e.target.value),
    onSearchSubmit: (e: React.FormEvent) => e.preventDefault(),
    onCategoryChange: setSelectedCategory,
  });

  const filteredEvents = searchQuery
    ? searchedEvents
    : filterEvents(allEvents, searchQuery, selectedCategory);

  const visibleEvents = filteredEvents.slice(0, visibleEventsCount);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setVisibleEventsCount(6);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setVisibleEventsCount(6);
  };

  const loadMoreEvents = () => {
    setVisibleEventsCount((prev) => prev + 6);
  };

  return {
    searchQuery,
    selectedCategory,
    visibleEvents,
    filteredEvents,
    searchedEvents,
    searchedOwners, 
    handleSearchChange,
    handleSearchSubmit,
    handleCategoryChange,
    loadMoreEvents,
    searchLoading,
    searchError,
  };
};

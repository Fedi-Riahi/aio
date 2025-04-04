"use client";
import React, { useCallback } from "react";
import SearchBar from "./SearchBar";
import EventCard from "./EventCard";
import { motion } from "framer-motion";
import { useEventFilters } from "@/hooks/useEventFilters";

const Events: React.FC = () => {
  const {
    searchQuery,
    selectedCategory,
    visibleEvents,
    filteredEvents,
    handleSearchChange,
    handleSearchSubmit,
    handleCategoryChange,
    handleSearchResults,
    loadMoreEvents,
  } = useEventFilters();

  const handleSearchResultsFromSearchBar = useCallback((events: any[], owners: any[]) => {
    handleSearchResults(events); 
  }, [handleSearchResults]);


  return (
    <div className="min-h-screen">
      <div className="mb-10">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onCategoryChange={handleCategoryChange}
          onSearchResults={handleSearchResultsFromSearchBar}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={searchQuery ? "mt-10" : ""}
      >
        <EventCard
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          visibleEvents={visibleEvents} // Displays up to 6 initially
        />
      </motion.div>

      {filteredEvents.length > 6 && filteredEvents.length > visibleEvents.length && (
        <div className="flex justify-center mt-14">
          <button
            onClick={loadMoreEvents}
            className="px-6 py-2 text-foreground border-b hover:text-main hover:border-main hover:tracking-wide transition duration-300"
          >
            Afficher plus
          </button>
        </div>
      )}
    </div>
  );
};

export default Events;

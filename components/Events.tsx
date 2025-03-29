"use client";
import React from "react";
import SearchBar from "./SearchBar";
import EventCard from "./EventCard";
import EventOwnerCard from "./EventOwnerCard";
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
    loadMoreEvents,
    searchedEvents,
    searchedOwners,
  } = useEventFilters();

  return (
    <div className="min-h-screen">
      <div className="mb-10">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-10"
        >
          <EventOwnerCard visibleOwners={searchedOwners} />
        </motion.div>
      )}

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
          visibleEvents={visibleEvents}
        />
      </motion.div>

      {filteredEvents.length > visibleEvents.length && (
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

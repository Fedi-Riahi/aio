"use client";
import React, { useState } from "react";
import SearchBar from "./SearchBar";
import EventCard from "./EventCard";
import { motion } from "framer-motion";

const Events: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // "" means "All"
  const [visibleEvents, setVisibleEvents] = useState(10); // Initial number of visible events

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add search submission logic here if needed
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = category === "All" ? "" : category; // "All" resets to ""
    setSelectedCategory(newCategory);
  };

  const loadMoreEvents = () => {
    setVisibleEvents((prev) => prev + 10); // Load 10 more events
  };

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

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <EventCard
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          visibleEvents={visibleEvents}
        />
      </motion.div>

      {/* Load More Button */}
      <div className="flex justify-center mt-14">
        <button
          onClick={loadMoreEvents}
          className="px-6 py-2 text-foreground border-b hover:text-main hover:border-main hover:tracking-wide transition duration-300"
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default Events;

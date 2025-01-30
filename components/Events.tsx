"use client";
import React, { useState } from "react";
import SearchBar from "./SearchBar";
import EventCard from "./EventCard";
import { motion } from "framer-motion";

const Events: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [visibleEvents, setVisibleEvents] = useState(10); 

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };


  const loadMoreEvents = () => {
    setVisibleEvents((prev) => prev + 10); 
  };

  return (
    <div>

      <div className="">
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
          onItemClick={handleCategoryChange}
          visibleEvents={visibleEvents} 
        />
      </motion.div>

      {visibleEvents === 9 && (

        <div className="flex justify-center mt-6">
        <button
          onClick={loadMoreEvents}
          className="px-6 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition-colors"
          >
          Load More
        </button>
      </div>
        )}
    </div>
  );
};

export default Events;
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

      {visibleEvents === 10 && (

        <div className="flex justify-center mt-14">
        <button
          onClick={loadMoreEvents}
          className="px-6 py-2  text-foreground border-b  hover:text-main hover:border-main hover:tracking-wide transition duration-300"
          >
          Load More
        </button>
      </div>
        )}
    </div>
  );
};

export default Events;
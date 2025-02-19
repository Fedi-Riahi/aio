"use client"
import React, { useState, useEffect } from "react";
import { LuEarth } from "react-icons/lu";
import { LiaHandshake } from "react-icons/lia";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconCategory, IconMusic, IconBallFootball, IconMasksTheater, IconBuildingPavilion, IconConfetti, IconBriefcase2, IconDeviceGamepad2, IconSearch   } from '@tabler/icons-react';
interface HeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCategoryChange: (category: string) => void;
}

const SearchBar: React.FC<HeaderProps> = ({ searchQuery, onSearchChange, onSearchSubmit, onCategoryChange }) => {
  const placeholders = [
    "Looking for music festivals near you?",
    "What are the best tech conferences this month?",
    "Are there any art exhibitions in the city?",
    "Find local food tasting events this weekend.",
    "Search for upcoming sports matches in your area.",
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [animateDown, setAnimateDown] = useState(false);
  const [animateUp, setAnimateUp] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(""); 

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateDown(true);
      const textChangeTimer = setTimeout(() => {
        setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
        setAnimateUp(true);
      }, 500);

      const resetAnimationTimer = setTimeout(() => {
        setAnimateDown(false);
        setAnimateUp(false);
      }, 1000);

      return () => {
        clearTimeout(textChangeTimer);
        clearTimeout(resetAnimationTimer);
      };
    }, 3000);

    return () => clearInterval(interval);
  }, [placeholders.length]);

  const links = [
    { title: "", icon: <IconCategory className="h-full w-full " />, href: "All" },
    { title: "Cinema", icon: <IconMasksTheater className="h-full w-full  " />, href: "Cinema" },
    { title: "Festival", icon: <IconBuildingPavilion className="h-full w-full " />, href: "Festivals" },
    { title: "Parties", icon: <IconConfetti className="h-full w-full " />, href: "Parties" },
    { title: "Sport", icon: <IconBallFootball className="h-full w-full " />, href: "Sports" },
    { title: "Music", icon: <IconMusic className="h-full w-full " />, href: "Concerts" },
    { title: "Congret", icon: <IconBriefcase2 className="h-full w-full " />, href: "Congrets" },
    { title: "Caritatif", icon: <LuEarth className="h-full w-full " />, href: "Caritatifs" },
    { title: "Excrusions", icon: <LiaHandshake className="h-full w-full " />, href: "Excrusions" },
    { title: "Entertainment", icon: <IconDeviceGamepad2 className="h-full w-full " />, href: "Entertainment" },
  ];

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category); 
    onCategoryChange(category); 
  };

  return (
    <div className="flex justify-center flex-col items-center mt-10 lg:mx-10 mx-2">

      <form onSubmit={onSearchSubmit} className="relative w-full lg:max-w-screen-lg sm:max-w-screen-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full p-3 pl-14 pr-14 text-foreground bg-offwhite  rounded-full backdrop-blur-lg shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
          placeholder={placeholders[currentPlaceholder]} 
        />

        <IconSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground w-5 h-5 cursor-pointer" />
      </form>


      <style jsx>{`
        input::placeholder {
          transition: transform 0.5s ease, opacity 0.5s ease;
          transform: translateY(${animateDown ? "35px" : animateUp ? "-45px" : "0px"});
          opacity: ${animateDown || animateUp ? "0.5" : "1"};
        }

        input:focus::placeholder {
          transform: translateY(40px);
          opacity: 1;
        }
      `}</style>

      <div className="mt-8">
        <FloatingDock
          items={links}
          activeCategory={activeCategory} 
          onItemClick={handleCategoryChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;

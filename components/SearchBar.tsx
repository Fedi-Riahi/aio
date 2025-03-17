"use client";
import React, { useState, useEffect } from "react";
import { LuEarth } from "react-icons/lu";
import { LiaHandshake } from "react-icons/lia";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconSearch,
  IconBuildingPavilion,
  IconBallFootball,
  IconMusic,
  IconMasksTheater,
  IconConfetti,
  IconBriefcase2,
  IconDeviceGamepad2,
  IconTheater,
  IconCategory
} from '@tabler/icons-react';

interface Category {
  _id: string;
  name: string;
  type: string;
  font_icon: string;
}

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCategoryChange: (category: string) => void;
}

const SearchBar: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onCategoryChange
}) => {
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "/api/proxy/api/normalaccount/getcategories",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to fetch categories: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        console.log('Fetched Data:', data);

        const categoryData = Array.isArray(data.respond?.data)
          ? data.respond.data
          : [];
        console.log('Parsed Categories:', categoryData);

        setCategories(categoryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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

  // Define getIconForCategory before categoryItems
  const getIconForCategory = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case "festivals":
        return <IconBuildingPavilion className="h-full w-full "/>;
      case "sports":
        return <IconBallFootball className="h-full w-full "/>;
      case "concerts":
        return <IconMusic className="h-full w-full "/>;
      case "cinéma":
          return <IconMasksTheater className="h-full w-full "/>;
      case "théâtre":
          return <IconTheater className="h-full w-full "/>;
      case "soirées":
        return <IconConfetti className="h-full w-full "/>;
      case "congrès":
        return <IconBriefcase2 className="h-full w-full "/>;
      case "loisirs":
        return <IconDeviceGamepad2 className="h-full w-full "/>;
      case "charity":
        return <LuEarth className="h-full w-full "/>;
      case "excursions":
        return <LiaHandshake className="h-full w-full "/>;
      case "caritatifs":
        return <LuEarth className="h-full w-full "/>;
    }
  };

  const categoryItems = [
    {
      name: "All", // Changed from title to name
      icon: <IconCategory className="h-full w-full" />,
      href: "",
    },
    ...(categories || []).map((category) => ({
      name: category.name, // Already using name
      icon: (
        <span className="h-full w-full">
          {getIconForCategory(category.name)}
        </span>
      ),
      href: category.name,
    })),
  ];

  const handleCategoryChange = (category: string) => {
    const newCategory = category === "All" ? "" : category; // Set to "" for "All"
    setActiveCategory(newCategory);
    onCategoryChange(newCategory);
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex justify-center flex-col items-center mt-10 lg:mx-10 mx-2">
      <form onSubmit={onSearchSubmit} className="relative w-full lg:max-w-screen-lg sm:max-w-screen-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={onSearchChange}
          className="w-full p-3 pl-14 pr-14 text-foreground bg-offwhite rounded-full backdrop-blur-lg shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
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
          items={categoryItems}
          activeCategory={activeCategory}
          onItemClick={handleCategoryChange}
        />
      </div>
    </div>
  );
};

export default SearchBar;

import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { HeaderProps, CategoryItem } from "../types/searchBar";
import { placeholders, fetchCategories, buildCategoryNames } from "../utils/searchBarUtils";
import { fetchEventsByCategory } from "../utils/eventUtils";
import { LuEarth } from "react-icons/lu";
import { LiaHandshake } from "react-icons/lia";
import {
  IconBuildingPavilion,
  IconBallFootball,
  IconMusic,
  IconMasksTheater,
  IconConfetti,
  IconBriefcase2,
  IconDeviceGamepad2,
  IconTheater,
  IconCategory,
} from "@tabler/icons-react";

interface Category {
  id: string;
  name: string;
}

export const useSearchBar = ({
  searchQuery,
  onSearchSubmit,
  onCategoryChange,
  onSearchResults,
}: HeaderProps & { onSearchResults?: (events: any[], owners: any[]) => void }) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [animateDown, setAnimateDown] = useState(false);
  const [animateUp, setAnimateUp] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = !!localStorage.getItem("authTokens");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error loading categories:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
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
  }, []);

  const searchEvents = async (query: string) => {
    try {
      setSearchLoading(true);
      const response = await apiClient.get("/normalaccount/search", {
        params: { keyword: query, maxCount: 10, startCount: 0 },
      });
      return response.data.respond?.data || [];
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search events");
      console.error("Error searching events:", err);
      return [];
    } finally {
      setSearchLoading(false);
    }
  };

  const searchOwners = async (query: string) => {
    try {
      setSearchLoading(true);
      const response = await apiClient.get("/normalaccount/searchforotheorgaccounts", {
        params: { keyword: query, maxCount: 10, startCount: 0 },
      });
      return response.data.respond?.data || [];
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search owners");
      console.error("Error searching owners:", err);
      return [];
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchEventsForCategory = async (categoryId: string) => {
    try {
      setSearchLoading(true);
      const categoryEvents = await fetchEventsByCategory(categoryId);
      return categoryEvents;
    } catch (err) {
      setError("Failed to fetch events for category");
      console.error("Error fetching category events:", err);
      return [];
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim() && !activeCategory) {
      return;
    }

    const debounceSearch = setTimeout(async () => {
      if (searchQuery.trim()) {
        const eventsPromise = searchEvents(searchQuery);
        const ownersPromise = isLoggedIn ? searchOwners(searchQuery) : Promise.resolve([]);

        const [events, owners] = await Promise.all([eventsPromise, ownersPromise]);
        onSearchResults?.(events, owners);
      } else if (activeCategory) {
        const categoryEvents = await fetchEventsForCategory(activeCategory);
        onSearchResults?.(categoryEvents, []);
      } else {
        onSearchResults?.([], []);
      }
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery, activeCategory, categories, onSearchResults, isLoggedIn]);

  const getIconForCategory = (categoryName: string): JSX.Element => {
    switch (categoryName.toLowerCase()) {
      case "festivals":
        return <IconBuildingPavilion className="h-full w-full" />;
      case "sports":
        return <IconBallFootball className="h-full w-full" />;
      case "concerts":
        return <IconMusic className="h-full w-full" />;
      case "cinéma":
        return <IconMasksTheater className="h-full w-full" />;
      case "théâtre":
        return <IconTheater className="h-full w-full" />;
      case "soirées":
        return <IconConfetti className="h-full w-full" />;
      case "congrès":
        return <IconBriefcase2 className="h-full w-full" />;
      case "loisirs":
        return <IconDeviceGamepad2 className="h-full w-full" />;
      case "charity":
      case "caritatifs":
        return <LuEarth className="h-full w-full" />;
      case "excursions":
        return <LiaHandshake className="h-full w-full" />;
      default:
        return <IconCategory className="h-full w-full" />;
    }
  };

  const categoryItems: CategoryItem[] = buildCategoryNames(categories).map((item) => ({
    id: item.id,
    name: item.name,
    href: "#",
    icon: item.name === "All" ? (
      <IconCategory className="h-full w-full" />
    ) : (
      <span className="h-full w-full">{getIconForCategory(item.name)}</span>
    ),
  }));

  const handleCategoryChange = (categoryId: string) => {
    const newCategory = categoryId === "All" ? "" : categoryId;
    setActiveCategory(newCategory);
    onCategoryChange(newCategory);
  };

  return {
    currentPlaceholder,
    animateDown,
    animateUp,
    activeCategory,
    categoryItems,
    loading,
    searchLoading,
    error,
    handleCategoryChange,
    handleSearchSubmit: onSearchSubmit,
  };
};

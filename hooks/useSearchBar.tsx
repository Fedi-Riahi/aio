import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { HeaderProps, CategoryItem } from "../types/searchBar";
import { placeholders, fetchCategories, buildCategoryNames } from "../utils/searchBarUtils";
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

export const useSearchBar = ({
  searchQuery,
  onSearchSubmit,
  onCategoryChange,
}: HeaderProps) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [animateDown, setAnimateDown] = useState(false);
  const [animateUp, setAnimateUp] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
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
        params: {
          keyword: query,
          maxCount: 10,
          startCount: 0,
        },
      });
      const data = response.data;
      setEvents(data.respond?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search events");
    } finally {
      setSearchLoading(false);
    }
  };

  const searchOwners = async (query: string) => {
    try {
      setSearchLoading(true);
      const response = await apiClient.get("/normalaccount/searchforotheorgaccounts", {
        params: {
          keyword: query,
          maxCount: 10,
          startCount: 0,
        },
      });
      const data = response.data;
      setOwners(data.respond?.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search owners");
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const debounceSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        Promise.all([searchEvents(searchQuery), searchOwners(searchQuery)]);
      } else {
        setEvents([]);
        setOwners([]);
        setError(null);
      }
    }, 500);

    return () => clearTimeout(debounceSearch);
  }, [searchQuery]);

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
    ...item,
    icon: item.name === "All" ? (
      <IconCategory className="h-full w-full" />
    ) : (
      <span className="h-full w-full">{getIconForCategory(item.name)}</span>
    ),
  }));

  const handleCategoryChange = (category: string) => {
    const newCategory = category === "All" ? "" : category;
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
    events,
    owners,
    handleCategoryChange,
    handleSearchSubmit: onSearchSubmit,
  };
};

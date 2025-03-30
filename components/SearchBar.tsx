import React from "react";
import { IconSearch } from "@tabler/icons-react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { HeaderProps } from "../types/searchBar";
import { useSearchBar } from "../hooks/useSearchBar";
import { placeholders } from "../utils/searchBarUtils";

const SearchBar: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onCategoryChange,
}) => {
  const {
    currentPlaceholder,
    animateDown,
    animateUp,
    activeCategory,
    categoryItems,
    loading,
    searchLoading,
    error,
    handleCategoryChange,
  } = useSearchBar({
    searchQuery,
    onSearchChange,
    onSearchSubmit,
    onCategoryChange,
  });

  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex justify-center flex-col items-center mt-10 lg:mx-10 mx-2">
      <div className="relative w-full lg:max-w-screen-lg sm:max-w-screen-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={onSearchChange}
          onKeyPress={(e) => e.key === "Enter" && onSearchSubmit(e)}
          className="w-full p-3 pl-14 pr-14 text-foreground bg-offwhite rounded-full backdrop-blur-lg shadow-lg focus:outline-none focus:ring-1 focus:ring-black"
          placeholder={placeholders[currentPlaceholder]}
        />
        <IconSearch
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-foreground w-5 h-5 cursor-pointer"
          onClick={onSearchSubmit}
        />
      </div>

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

      <div className="mt-8 relative">
        <FloatingDock
          items={categoryItems}
          activeCategory={activeCategory} // Tracks ID
          onItemClick={handleCategoryChange} // Receives ID from FloatingDock
        />
        {searchLoading && (
          <div className="absolute left-1/2 top-40 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-foreground"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

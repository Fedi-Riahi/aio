export interface Category {
    _id: string;
    name: string;
    type: string;
    font_icon: string;
  }

  export interface HeaderProps {
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onCategoryChange: (category: string) => void;
  }

  export interface CategoryItem {
    name: string;
    icon: JSX.Element;
    href: string;
  }

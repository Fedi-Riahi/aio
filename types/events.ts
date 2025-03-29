import { EventCardProps } from "./event"; 

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCategoryChange: (category: string) => void;
}
export type EventsProps = EventCardProps;

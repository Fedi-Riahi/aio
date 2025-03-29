export interface Event {
    _id: string;
    event_name: string;
    likes: string[];
    isValid: boolean;
    thumbnail: string;
    event_date: string;
    owner: Owner[];
    tickets: { _id: string; discount: number; details: { price: number; phases: any[] } }[];
    type?: string;
    categories?: string[];
  }

  export interface Owner {
    _id: string;
    organization_name: string;
    profile_picture: string | null;
  }

  export interface EventCardProps {
    searchQuery: string;
    selectedCategory: string;
    visibleEvents: Event[];
  }

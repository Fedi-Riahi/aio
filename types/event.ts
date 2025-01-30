export interface Event {
  id: string;
  event_name: string;
  creation_date: Date;
  periods: Period[];
  visibility: 'Public' | 'Private' | 'Unlisted';
  description: string;
  sponsored: boolean;
  thumbnail: string[];
  views: number;
  purchased_tickets?: string;
  likes: string[];
  comments: string[];
  owner: string;
  isValid: boolean;
  categories: string[];
  paymentMethods: ('Online' | 'Delivery')[];
  globalTickets?: GlobalTicket[];
  delivery_threshold?: number;
}

export interface Period {
  start_day: Date;
  end_day: Date | null;
  locations: Location[];
}

export interface Location {
  location: string;
  times: Time[];
}

export interface Time {
  note?: string;
  start_time: Date;
  end_time?: Date;
  tickets: Ticket[];
}

export interface Ticket {
  ticket_id: string;
  type: string;
  teams_schema?: TeamsSchema;
  seats_template?: string;
  taken_seats?: string[];
  count: number;
  price: number;
}

export interface TeamsSchema {
  totalTeams: number;
  memberPerTeam: number;
  teams: string[];
}

export interface GlobalTicket {
  ticket: string;
  discount: number;
}

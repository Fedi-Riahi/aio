export interface TicketGroup {
    count: number;
    _id: {
      location_index: string;
      period_index: string;
      ticket_index: string;
      ticket_ref: string;
      time_index: string;
    };
  }

  export interface Ticket {
    ticket_id: string;
    type: string;
    teams_schema: { teams: any[] };
    taken_seats: any[];
    count: number;
    _id: string;
  }

  export interface Time {
    originalIndex: number;
    start_time: string | string[];
    end_time: string | string[];
    tickets: Ticket[];
  }

  export interface LocationData {
    _id: string;
    organizer_ref: string;
    city: string;
    address_code: string;
    household_name: string;
    __v: number;
  }

  export interface Location {
    location: LocationData;
    times: Time[];
  }

  export interface Period {
    locations: Location[];
    deliveryClosed?: boolean;
    start_day?: string;
    end_day?: string;
    originalIndex: number;
  }

  export interface TicketType {
    ticket: { _id: string; name: string; price: number };
    discount: number;
    _id: string;
  }

  export interface Event {
    _id: string;
    event_name: string;
    description: string;
    thumbnail: string[];
    categories: { _id: string; name: string }[];
    views?: number;
    periods: Period[];
    owner: {
      _id: string;
      organization_name: string;
      profile_picture: string;
      phone?: string;
      email?: string;
      social_links?: { platform: string; social_link: string }[];
    }[];
    ticket_type: TicketType[];
    ticketsGroups: TicketGroup[];
    isValid: boolean;
    paymentMethods: string[];
    extraPurchaseFields: any[];
    ticketFees: number;
    deliveryFees: number;
    isOver: boolean;
    likes: string[];
  }

  export interface Seat {
    id: string;
    row: string;
    number: number;
  }

  export interface SeatData {
    seats: { list_of_seat: Seat[] };
    room_name: string;
    taken: string[];
  }
  export interface Comment {
    _id: string;
    content: string;
    profilePicture: string;
    username: string;
    ownerId: string;
    date: string;
  }

export interface Seat {
  seat_index: string;
  is_removed: boolean;
  _id: string;
}

export interface Order {
  event_id: { id: string };
  period_index: number;
  location_index: number;
  time_index: number;
  ticketDataList?: { room_name: string; seat_index: string }[];
  takenSeats?: string[] | Record<string, string[]>;
}

export interface TheatreViewProps {
  order: Order;
  ticketIndex?: string;
  seats: Seat[];
  roomName: string;
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
  maxSeats: number;
  takenSeats: string[];
}

export interface SeatMapProps {
  seats: Seat[];
  taken: string[];
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
  containerWidth: number;
  containerHeight: number;
}

export interface SeatProps {
  seatId: string;
  taken: boolean;
  seatActive: boolean;
  isRemoved: boolean;
  seatSize: number;
  onSelect: (seatId: string) => void;
}
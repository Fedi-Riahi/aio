export interface Seat {
    id: string;
    row: string;
    number: number;
    type: 'standard' | 'premium' | 'vip' | 'disabled' | 'unavailable';
    status: 'available' | 'reserved' | 'selected' | 'sold' | 'unavailable';
  }
  
  export interface Row {
    id: string;
    name: string;
    seats: Seat[];
  }
  
  export interface Section {
    id: string;
    name: string;
    rows: Row[];
  }
  
  export interface CinemaLayout {
    id: string;
    name: string;
    sections: Section[];
    screen: {
      width: number; // percentage of container width
    };
  }
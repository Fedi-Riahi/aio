import { Seat } from "../types/theatreView";

export const sortSeats = (seats: Seat[]): Seat[] => {
  return [...seats].sort((a, b) => a.seat_index.localeCompare(b.seat_index));
};

export const getUniqueRows = (seats: Seat[]): string[] => {
  return [...new Set(seats.map((seat) => seat.seat_index[0]))];
};

export const calculateSeatSize = (
  containerWidth: number,
  containerHeight: number,
  columns: number,
  rows: number
): number => {
  return Math.min(containerWidth / (columns + 1), containerHeight / rows);
};

export const normalizeTakenSeats = (takenSeats: string[] | Record<string, string[]> | undefined): string[] => {
  if (Array.isArray(takenSeats)) return takenSeats;
  if (takenSeats && typeof takenSeats === "object") return Object.values(takenSeats).flat();
  return [];
};

"use client"; // Mark as Client Component

import React, { useState, useEffect, useMemo } from "react";

// Simulated API response type
interface Seat {
  seat_index: string; // e.g., "A-1", "B-10"
  is_removed: boolean;
}

interface TheatreData {
  room_name: string;
  seats: { list_of_seat: Seat[] };
  taken: string[];
}

interface Order {
  event_id: { id: string };
  period_index: number;
  location_index: number;
  time_index: number;
  ticketDataList?: { room_name: string; seat_index: string }[];
  takenSeats?: Record<string, string[]>;
}

// Realistic seat template for 6 rows x 10 columns
const generateRealisticSeatTemplate = (): TheatreData => {
  const rows = ["A", "B", "C", "D", "E", "F"]; // 6 rows
  const seatsPerRow = 10; // Fixed 10 seats per row
  const list_of_seat: Seat[] = [];
  const taken: string[] = [];

  rows.forEach((row) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const seatIndex = `${row}-${i}`;
      const isRemoved = Math.random() < 0.05; // 5% chance of being removed
      list_of_seat.push({ seat_index: seatIndex, is_removed: isRemoved });
      if (!isRemoved && Math.random() < 0.2) { // 20% chance of being taken
        taken.push(seatIndex);
      }
    }
  });

  return {
    room_name: "Grand Auditorium",
    seats: { list_of_seat },
    taken,
  };
};

// Simulated API call
const fetchSeatsTemplate = async (params: {
  event_id: string;
  period_index: number;
  location_index: number;
  time_index: number;
  ticket_index: string;
}): Promise<TheatreData> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return generateRealisticSeatTemplate();
};

// Seat Component
const Seat: React.FC<{
  seatId: string;
  taken: boolean;
  seatActive: boolean;
  isRemoved: boolean;
  seatSize: number;
  onSelect: (seatId: string) => void;
}> = ({ seatId, taken, seatActive, isRemoved, seatSize, onSelect }) => {
  if (isRemoved) return <div style={{ width: `${seatSize}px`, height: `${seatSize}px` }} />;

  return (
    <button
      className={`rounded-md flex items-center justify-center transition-colors ${
        taken
          ? "bg-gray-600 cursor-not-allowed"
          : seatActive
          ? "bg-green-500"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
      style={{ width: `${seatSize}px`, height: `${seatSize}px` }}
      onClick={() => !taken && onSelect(seatId)}
      disabled={taken}
    >
      <span className="text-xs text-gray-800">{seatId.split("-")[1]}</span>
    </button>
  );
};

// SeatMap Component
const SeatMap: React.FC<{
  seats: Seat[];
  taken: string[];
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
  containerWidth: number;
  containerHeight: number;
}> = React.memo(
  ({ seats, taken, selectedSeats, setSelectedSeats, containerWidth, containerHeight }) => {
    if (!seats) return null;

    const orderedSeats = [...seats].sort((a, b) =>
      a.seat_index.localeCompare(b.seat_index)
    );
    const uniqueRows = [...new Set(orderedSeats.map((seat) => seat.seat_index[0]))];
    const columns = 10; // Fixed 10 columns
    const seatSize = Math.min(
      containerWidth / (columns + 1), // +1 for row label
      containerHeight / uniqueRows.length
    );

    const memoizedRows = useMemo(() => {
      return uniqueRows.map((row) => {
        const rowSeats = orderedSeats.filter((seat) => seat.seat_index[0] === row);
        const seatElements = Array(columns).fill(null).map((_, colIndex) => {
          const seat = rowSeats.find((s) => parseInt(s.seat_index.split("-")[1]) === colIndex + 1);
          if (seat) {
            const seatId = seat.seat_index;
            return (
              <Seat
                key={seatId}
                seatId={seatId}
                taken={taken.includes(seatId)}
                seatActive={selectedSeats.includes(seatId)}
                isRemoved={seat.is_removed}
                seatSize={seatSize}
                onSelect={(id) =>
                  setSelectedSeats((prev) =>
                    prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
                  )
                }
              />
            );
          }
          return <div key={`empty-${row}-${colIndex}`} style={{ width: `${seatSize}px`, height: `${seatSize}px` }} />;
        });

        return (
          <div key={row} className="flex flex-row items-center justify-center w-full gap-2">
            <span className="w-8 text-sm text-gray-600 flex-shrink-0">{row}</span>
            {seatElements}
          </div>
        );
      });
    }, [uniqueRows, orderedSeats, taken, selectedSeats, seatSize]);

    return (
      <div className="flex flex-col items-center w-full gap-2">
        {memoizedRows}
      </div>
    );
  }
);

SeatMap.displayName = "SeatMap";

// CinemaTheater Component
const CinemaTheater: React.FC<{
  seats: Seat[];
  taken: string[];
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ seats, taken, selectedSeats, setSelectedSeats }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-3/4 h-8 bg-gray-800 rounded-t-md mb-4 text-white text-center flex items-center justify-center">
        Screen
      </div>
      <SeatMap
        seats={seats}
        taken={taken}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        containerWidth={600}
        containerHeight={300}
      />
    </div>
  );
};

// Main TheatreView Component
interface TheatreViewProps {
  order: Order;
  ticketIndex?: string;
}

const TheatreView: React.FC<TheatreViewProps> = ({ order, ticketIndex }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<TheatreData | null>(null);
  const [isError, setIsError] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]); // Lifted state

  useEffect(() => {
    const { period_index, location_index, time_index } = order;
    const effectiveTicketIndex = ticketIndex ?? "default";

    fetchSeatsTemplate({
      event_id: order?.event_id?.id,
      period_index,
      location_index,
      time_index,
      ticket_index: effectiveTicketIndex,
    })
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch(() => {
        setIsError(true);
        setIsLoading(false);
      });
  }, [order, ticketIndex]);

  const takenSeats = useMemo(() => {
    if (!data) return [];
    const inTaken = data.taken || [];
    const gr = order?.takenSeats || {};
    const effectiveTicketIndex = ticketIndex ?? "default";
    return inTaken.concat(gr[effectiveTicketIndex] || []);
  }, [data, order, ticketIndex]);

  const clearSelectedSeats = () => {
    setSelectedSeats([]); // Reset selected seats
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">Erreur</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 border-t border-b border-gray-300">
      <h2 className="text-xl font-bold mb-4">{data!.room_name}</h2>
      <div className="max-w-3xl w-full flex justify-center overflow-x-auto">
        <CinemaTheater
          seats={data!.seats.list_of_seat}
          taken={takenSeats}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
        />
      </div>
      <div className="flex flex-row gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-600 rounded"></div>
          <span className="text-sm">Places occupées</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span className="text-sm">Places libres</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm">Mes places</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Taken Seats:</span> {takenSeats.length} / 60
        </p>
        {takenSeats.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            ({takenSeats.sort().join(", ")})
          </p>
        )}
        <p className="text-sm text-gray-700 mt-2">
          <span className="font-semibold">My Seats:</span> {selectedSeats.length}
        </p>
        {selectedSeats.length > 0 && (
          <>
            <p className="text-xs text-gray-500 mt-1">
              ({selectedSeats.sort().join(", ")})
            </p>
            <button
              onClick={clearSelectedSeats}
              className="mt-2 px-4 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
            >
              Clear Selected Seats
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TheatreView;
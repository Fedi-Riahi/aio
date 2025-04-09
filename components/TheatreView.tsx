"use client";

import React, { useMemo, useCallback } from "react";
import { SeatProps, SeatMapProps, TheatreViewProps, Seat as SeatE } from "../types/theatreView";
import { sortSeats, getUniqueRows, calculateSeatSize } from "../utils/theatreViewUtils";
import { useTheatreView } from "../hooks/useTheatreView";

const Seat: React.FC<SeatProps> = ({ seatId, taken, seatActive, isRemoved, seatSize, onSelect }) => {
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

const SeatMap: React.FC<SeatMapProps> = React.memo(
  ({ seats, taken = [], selectedSeats, setSelectedSeats, containerWidth, containerHeight }) => {
    if (!seats || seats.length === 0) {
      return null;
    }

    const orderedSeats = sortSeats(seats);
    const uniqueRows = getUniqueRows(orderedSeats);
    const columns = 18;
    const seatSize = calculateSeatSize(containerWidth, containerHeight, columns, uniqueRows.length);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const handleSeatSelect = useCallback((id: string) => {
      setSelectedSeats((prev) =>
        prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
      );
    }, [setSelectedSeats]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const memoizedRows = useMemo(() => {
      return uniqueRows.map((row) => {
        const rowSeats = orderedSeats.filter((seat) => seat.seat_index[0] === row);
        const seatElements = Array(columns)
          .fill(null)
          .map((_, colIndex) => {
            const seat = rowSeats.find(
              (s) => parseInt(s.seat_index.split("-")[1]) === colIndex + 1
            );
            if (seat) {
              const seatId = seat.seat_index;
              const isTaken = taken.includes(seatId);
              return (
                <Seat
                  key={seatId}
                  seatId={seatId}
                  taken={isTaken}
                  seatActive={selectedSeats.includes(seatId)}
                  isRemoved={seat.is_removed}
                  seatSize={seatSize}
                  onSelect={handleSeatSelect}
                />
              );
            }
            return (
              <div
                key={`empty-${row}-${colIndex}`}
                style={{ width: `${seatSize}px`, height: `${seatSize}px` }}
              />
            );
          });

        return (
          <div key={row} className="flex flex-row items-center justify-center w-full gap-2">
            <span className="w-8 text-sm text-gray-600 flex-shrink-0">{row}</span>
            {seatElements}
          </div>
        );
      });
    }, [uniqueRows, orderedSeats, taken, selectedSeats, seatSize, handleSeatSelect]);

    return <div className="flex flex-col items-center w-full gap-2">{memoizedRows}</div>;
  }
);

SeatMap.displayName = "SeatMap";

const CinemaTheater: React.FC<{
  seats: SeatE[];
  taken: string[];
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
}> = ({ seats, taken, selectedSeats, setSelectedSeats }) => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-3/4 h-8 bg-gray-800 rounded-t-md mb-4 text-white text-center flex items-center justify-center">
        Écran
      </div>
      <SeatMap
        seats={seats}
        taken={taken}
        selectedSeats={selectedSeats}
        setSelectedSeats={setSelectedSeats}
        containerWidth={800}
        containerHeight={600}
      />
    </div>
  );
};

const TheatreView: React.FC<TheatreViewProps> = ({
  order,
  seats,
  roomName,
  selectedSeats,
  setSelectedSeats,
  maxSeats,
  takenSeats = [],
}) => {
  const { clearSelectedSeats, normalizedTakenSeats } = useTheatreView({
    seats,
    selectedSeats,
    setSelectedSeats,
    maxSeats,
    takenSeats,
  });

  if (!seats || seats.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Aucune donnée de siège disponible pour cette période et cet horaire.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 border-t border-b border-gray-300">
      <h2 className="text-xl font-bold mb-4">
        {roomName} (Période: {order.period_index}, Lieu: {order.location_index}, Horaire: {order.time_index})
      </h2>
      <div className="max-w-4xl w-full flex justify-center overflow-x-auto">
        <CinemaTheater
          seats={seats}
          taken={normalizedTakenSeats}
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
          <span className="font-semibold">Places occupées:</span> {normalizedTakenSeats.length} /{" "}
          {seats.filter((s) => !s.is_removed).length}
        </p>
        {normalizedTakenSeats.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">
            ({normalizedTakenSeats.sort().join(", ")})
          </p>
        )}
        <p className="text-sm text-gray-700 mt-2">
          <span className="font-semibold">Mes places:</span> {selectedSeats.length}
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
              Effacer les places sélectionnées
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TheatreView;
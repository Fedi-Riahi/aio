"use client";

import { useState, useCallback, useEffect } from "react";
import CinemaSeats from "@/components/cinema/CinemaSeats";
import { CinemaLayout, Seat } from "@/types/cinema";
import { Button } from "@/components/ui/button";

interface CinemaDrawerProps {
  layout: CinemaLayout;
  onSeatSelect?: (selectedSeats: Seat[]) => void;
  initialSelectedSeats?: Seat[];
  ticketQuantity: number;  // Accept ticket quantity as a prop
  className?: string;
}

export default function CinemaDrawer({
  layout,
  onSeatSelect,
  initialSelectedSeats = [],
  ticketQuantity,  // Use ticket quantity from props
  className,
}: CinemaDrawerProps) {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>(initialSelectedSeats);

  const handleSeatSelect = useCallback(
    (seat: Seat) => {
      console.log("handleSeatSelect: Processing seat:", seat);
      setSelectedSeats((prevSelectedSeats) => {
        if (prevSelectedSeats.length >= ticketQuantity && !prevSelectedSeats.some((s) => s.id === seat.id)) {
          alert(`You can only select up to ${ticketQuantity} seats.`);
          return prevSelectedSeats;
        }
        const isSeatSelected = prevSelectedSeats.some((s) => s.id === seat.id);
        const newSelection = isSeatSelected
          ? prevSelectedSeats.filter((s) => s.id !== seat.id)
          : [...prevSelectedSeats, seat];
        console.log("handleSeatSelect: New selection:", newSelection);
        return newSelection;
      });
    },
    [ticketQuantity]
  );
  
  useEffect(() => {
    console.log("useEffect: Notifying parent with selectedSeats:", selectedSeats);
    if (onSeatSelect) {
      onSeatSelect(selectedSeats);
    }
  }, [selectedSeats, onSeatSelect]);
  

  const clearSelection = useCallback(() => {
    console.log("Clearing selection...");
    setSelectedSeats([]);
    if (onSeatSelect) onSeatSelect([]);
  }, [onSeatSelect]);

  return (
    <div className={`w-full flex flex-col ${className}`}>
      {/* Cinema Seats Selection */}
      <div className="bg-card rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-center">{layout.name}</h2>
        <CinemaSeats
          layout={layout}
          onSeatSelect={handleSeatSelect}
          selectedSeats={selectedSeats}
        />
      </div>

      {/* Selected Seats Summary */}
      <div className="bg-card rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Selected Seats</h2>
        {selectedSeats.length > 0 ? (
          <div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedSeats.map((seat) => (
                <li key={seat.id} className="bg-secondary p-3 rounded-md">
                  <div className="font-medium">
                    Seat {seat.row}{seat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {seat.type.charAt(0).toUpperCase() + seat.type.slice(1)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-between items-center">
              <div>
                <span className="text-lg font-medium">
                  Total: {selectedSeats.length} seats
                </span>
              </div>
              <Button onClick={clearSelection} variant="destructive">
                Clear Selection
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No seats selected yet.</p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { CinemaLayout, Seat } from "@/types/cinema";
import SeatIcon from "@/components/cinema/SeatIcon";
import { cn } from "@/lib/utils";

interface CinemaSeatsProps {
  layout: CinemaLayout;
  onSeatSelect?: (seat: Seat) => void;
  selectedSeats?: Seat[];
  className?: string;
}

export default function CinemaSeats({
  layout,
  onSeatSelect,
  selectedSeats = [],
  className,
}: CinemaSeatsProps) {
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status !== 'available' && seat.status !== 'selected') return;
    
    if (onSeatSelect) {
      onSeatSelect(seat);
    }
  };

  const isSeatSelected = (seat: Seat) => {
    return selectedSeats.some(s => s.id === seat.id);
  };

  // Get the maximum number of seats in any row across all sections
  const maxSeatsInRow = Math.max(
    ...layout.sections.flatMap(section => 
      section.rows.map(row => row.seats.length)
    )
  );

  return (
    <div className={cn("w-full flex flex-col items-center", className)}>
      {/* Screen */}
      <div 
        className="w-full flex justify-center mb-10"
        style={{ maxWidth: `${layout.screen.width}%` }}
      >
        <div className="w-full h-6 bg-gradient-to-b from-main/90 to-transparent rounded-t-full transform perspective-500 rotateX-40">
          <div className="text-center text-xs text-gray-500 mt-8">SCREEN</div>
        </div>
      </div>

      {/* Sections */}
      <div className="w-full flex flex-col gap-8">
        {layout.sections.map((section) => (
          <div key={section.id} className="w-full">
            <h3 className="text-center font-medium mb-2">{section.name}</h3>
            <div className="flex flex-col items-center">
              {section.rows.map((row) => (
                <div key={row.id} className="flex items-center mb-2 w-full justify-center">
                  <div className="w-8 text-right mr-4 text-sm font-medium">
                    {row.name}
                  </div>
                  <div 
                    className="flex gap-1 justify-center flex-wrap"
                    style={{ 
                      maxWidth: `${maxSeatsInRow * 30}px`,
                      minHeight: '30px'
                    }}
                  >
                    {row.seats.map((seat) => {
                      // Create a copy of the seat with updated status if it's selected
                      const seatWithStatus = {
                        ...seat,
                        status: isSeatSelected(seat) ? 'selected' : seat.status,
                      };
                      
                      return (
                        <div 
                          key={seat.id} 
                          className="relative flex items-center justify-center"
                          onMouseEnter={() => setHoveredSeat(seat)}
                          onMouseLeave={() => setHoveredSeat(null)}
                        >
                          <SeatIcon 
                            seat={seatWithStatus} 
                            onClick={handleSeatClick}
                          />
                          {hoveredSeat?.id === seat.id && (
                            <div className="absolute -top-8 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                              {row.name}{seat.number} - {seat.type.charAt(0).toUpperCase() + seat.type.slice(1)}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="w-8 ml-4 text-sm font-medium">
                    {row.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-10 flex flex-wrap justify-center gap-6">
        <div className="flex items-center">
          <SeatIcon seat={{ id: '', row: '', number: 0, type: 'standard', status: 'available' }} />
          <span className="ml-2 text-sm">Standard</span>
        </div>
        <div className="flex items-center">
          <SeatIcon seat={{ id: '', row: '', number: 0, type: 'premium', status: 'available' }} />
          <span className="ml-2 text-sm">Premium</span>
        </div>
        <div className="flex items-center">
          <SeatIcon seat={{ id: '', row: '', number: 0, type: 'vip', status: 'available' }} />
          <span className="ml-2 text-sm">VIP</span>
        </div>
        <div className="flex items-center">
          <SeatIcon seat={{ id: '', row: '', number: 0, type: 'standard', status: 'selected' }} />
          <span className="ml-2 text-sm">Selected</span>
        </div>
        <div className="flex items-center">
          <SeatIcon seat={{ id: '', row: '', number: 0, type: 'standard', status: 'sold' }} />
          <span className="ml-2 text-sm">Sold</span>
        </div>
        <div className="flex items-center">
          <SeatIcon seat={{ id: '', row: '', number: 0, type: 'disabled', status: 'unavailable' }} />
          <span className="ml-2 text-sm">Unavailable</span>
        </div>
      </div>
    </div>
  );
}
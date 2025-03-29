import { useCallback, useMemo } from "react";
import { TheatreViewProps } from "../types/theatreView";
import { normalizeTakenSeats } from "../utils/theatreViewUtils";

export const useTheatreView = ({
  seats,
  selectedSeats,
  setSelectedSeats,
  maxSeats,
  takenSeats,
}: Pick<TheatreViewProps, "seats" | "selectedSeats" | "setSelectedSeats" | "maxSeats" | "takenSeats">) => {
  const normalizedTakenSeats = useMemo(() => normalizeTakenSeats(takenSeats), [takenSeats]);

  const handleSeatSelect = useCallback(
    (seatId: string) => {
      if (normalizedTakenSeats.includes(seatId)) {
        return;
      }
      setSelectedSeats((prev) => {
        if (prev.includes(seatId)) {
          return prev.filter((s) => s !== id);
        } else if (prev.length < maxSeats) {
          return [...prev, seatId];
        } else {
          alert(`You can only select up to ${maxSeats} seats.`);
          return prev;
        }
      });
    },
    [normalizedTakenSeats, maxSeats, setSelectedSeats]
  );

  const clearSelectedSeats = useCallback(() => {
    setSelectedSeats([]);
  }, [setSelectedSeats]);

  return { handleSeatSelect, clearSelectedSeats, normalizedTakenSeats };
};

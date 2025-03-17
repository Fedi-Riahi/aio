import { cn } from "@/lib/utils";
import { Seat } from "@/types/cinema";
import { 
  Armchair, 
  ArmchairIcon, 
  Sofa, 
  X 
} from "lucide-react";

interface SeatIconProps {
  seat: Seat;
  size?: number;
  onClick?: (seat: Seat) => void;
  className?: string;
}

export default function SeatIcon({ 
  seat, 
  size = 24, 
  onClick, 
  className 
}: SeatIconProps) {
  const handleClick = () => {
    if (seat.status !== 'unavailable' && seat.status !== 'sold' && onClick) {
      onClick(seat);
    }
  };

  const getSeatIcon = () => {
    if (seat.status === 'unavailable' || seat.type === 'disabled') {
      return <X size={size} className="text-gray-300" />;
    }

    switch (seat.type) {
      case 'premium':
        return <ArmchairIcon size={size} />;
      case 'vip':
        return <Sofa size={size} />;
      case 'standard':
      default:
        return <Armchair size={size} />;
    }
  };

  const getSeatColor = () => {
    if (seat.status === 'unavailable' || seat.type === 'disabled') {
      return "text-gray-300";
    }
    
    switch (seat.status) {
      case 'available':
        return seat.type === 'standard' 
          ? "text-blue-500 hover:text-blue-600" 
          : seat.type === 'premium' 
            ? "text-purple-500 hover:text-purple-600" 
            : "text-amber-500 hover:text-amber-600";
      case 'reserved':
        return "text-gray-500";
      case 'selected':
        return "text-green-500";
      case 'sold':
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <div 
      className={cn(
        "transition-all duration-200 ease-in-out cursor-pointer",
        getSeatColor(),
        seat.status === 'unavailable' || seat.status === 'sold' ? "cursor-not-allowed opacity-50" : "",
        className
      )}
      onClick={handleClick}
    >
      {getSeatIcon()}
    </div>
  );
}
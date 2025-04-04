import { useState, useEffect, useMemo } from "react";
import { Ticket } from "@/types/eventDetails";
import { DeliveryDetails, TicketOrder } from "@/types/ticketDrawer";
import { TicketData } from "@/types/paymentStep";
import { calculateTotal, applyCoupon } from "@/utils/ticketDrawerUtils";
import toast from "react-hot-toast";

// Define types (assumed from context; adjust as needed)
interface TicketType {
  id: string;
  name: string;
  price: number;
}

interface Seat {
  id: string;
  name: string;
}

// Utility function to build ticketDataList with ticket_index based on ticket type
const buildTicketDataList = (
  selectedTickets: { [key: string]: number },
  userNames: { [key: string]: string[] },
  tickets: Ticket[],
  ticketType: TicketType[],
  hasSeatTemplate: boolean | null,
  selectedSeats: string[]
): TicketData[] => {
  const ticketDataList: TicketData[] = [];
  Object.entries(selectedTickets).forEach(([ticketId, quantity]) => {
    const ticket = tickets.find((t) => t.id === ticketId);
    const ticketTypeData = ticketType.find((tt) => tt.id === ticketId);
    const ticketTypeIndex = ticketType.findIndex((tt) => tt.id === ticketId); // Get index of ticket type
    const names = userNames[ticketId] || [];

    for (let i = 0; i < quantity; i++) {
      ticketDataList.push({
        ticket_id: ticketId,
        name: names[i] || ticketTypeData?.name || ticket?.name || "Unnamed",
        ticket_index: ticketTypeIndex !== -1 ? ticketTypeIndex : 0, // Use ticket type index, default to 0 if not found
        seat_index: hasSeatTemplate && selectedSeats[i] ? selectedSeats[i] : "N/A",
      });
    }
  });
  return ticketDataList;
};

export const useTicketDrawer = (
  tickets: Ticket[],
  ticketType: TicketType[],
  eventId: string,
  periodIndex: number,
  locationIndex: number,
  timeIndex: number,
  hasSeatTemplate: boolean | null,
  seatData: { seats: { list_of_seat: Seat[] }; room_name: string; taken: string[] } | null,
  onClose: () => void
) => {
  // State declarations
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});
  const [userNames, setUserNames] = useState<{ [key: string]: string[] }>({});
  const [step, setStep] = useState<"selectQuantity" | "selectSeats" | "enterNames" | "payment" | "confirmation">(
    "selectQuantity"
  );
  const [paymentMode, setPaymentMode] = useState<"delivery" | "online" | null>(null);
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    name: "",
    prename: "",
    address: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [maxSeats, setMaxSeats] = useState<number>(0);

  // Update maxSeats based on selectedTickets
  useEffect(() => {
    const totalSelectedTickets = Object.values(selectedTickets).reduce((sum, quantity) => sum + quantity, 0);
    setMaxSeats(totalSelectedTickets);
    if (selectedSeats.length > totalSelectedTickets) {
      setSelectedSeats(selectedSeats.slice(0, totalSelectedTickets));
    }
  }, [selectedTickets]);

  // Memoize ticketDataList to prevent unnecessary recalculations
  const ticketDataList = useMemo(
    () => buildTicketDataList(selectedTickets, userNames, tickets, ticketType, hasSeatTemplate, selectedSeats),
    [selectedTickets, userNames, tickets, ticketType, hasSeatTemplate, selectedSeats]
  );


  // Handle ticket quantity changes
  const handleQuantityChange = (ticketId: string, quantity: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, quantity), // Prevent negative quantities
    }));
  };

  // Handle name input for each ticket
  const handleNameChange = (ticketId: string, index: number, name: string) => {
    setUserNames((prev) => {
      const updatedNames = [...(prev[ticketId] || Array(selectedTickets[ticketId] || 0).fill(""))];
      updatedNames[index] = name;
      return {
        ...prev,
        [ticketId]: updatedNames,
      };
    });
  };

  // Handle payment mode selection
  const handlePaymentModeChange = (mode: "delivery" | "online") => {
    setPaymentMode(mode);
  };

  // Handle delivery details input
  const handleDeliveryChange = (field: keyof DeliveryDetails, value: string) => {
    setDeliveryDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle coupon code input
  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
  };

  // Apply coupon and update discount
  const handleApplyCoupon = () => {
    const newDiscount = applyCoupon(couponCode);
    setDiscount(newDiscount);
  };

  // Cancel the ticket drawer process
  const handleCancel = () => {
    setSelectedTickets({});
    setUserNames({});
    setStep("selectQuantity");
    setPaymentMode(null);
    setCouponCode("");
    setDiscount(0);
    setSelectedSeats([]);
    onClose();
  };

  // Move to the next step with validation
  const handleContinue = () => {
    if (step === "selectQuantity") {
      const hasSelectedTickets = Object.values(selectedTickets).some((quantity) => quantity > 0);
      if (!hasSelectedTickets) {
        toast("Please select at least one ticket.");
        return;
      }
      setStep(hasSeatTemplate ? "selectSeats" : "enterNames");
    } else if (step === "selectSeats") {
      if (selectedSeats.length !== maxSeats) {
        toast(`Please select exactly ${maxSeats} seat${maxSeats !== 1 ? "s" : ""}. You have selected ${selectedSeats.length}.`)
        return;
      }
      setStep("enterNames");
    } else if (step === "enterNames") {
      const allNamesEntered = Object.entries(selectedTickets).every(([ticketId, quantity]) => {
        const ticketUsers = userNames[ticketId] || [];
        return ticketUsers.length === quantity && ticketUsers.every((name) => name.trim() !== "");
      });
      if (!allNamesEntered) {
        toast("Please enter names for all selected tickets.");
        return;
      }
      setStep("payment");
    } else if (step === "payment") {
        onClose();
    }

  };


  const handleBack = () => {
    if (step === "selectSeats") {
      setStep("selectQuantity");
    } else if (step === "enterNames") {
      setStep(hasSeatTemplate ? "selectSeats" : "selectQuantity");
    } else if (step === "payment") {
      setStep("enterNames");
    }
  };


  const order: TicketOrder = {
    event_id: { id: eventId },
    period_index: periodIndex,
    location_index: locationIndex,
    time_index: timeIndex,
    takenSeats: seatData?.taken || [],
  };

  // Calculate total cost
  const total = calculateTotal(tickets, selectedTickets, ticketType, paymentMode, discount);

  // Return all state and handlers
  return {
    selectedTickets,
    handleQuantityChange,
    userNames,
    handleNameChange,
    step,
    paymentMode,
    handlePaymentModeChange,
    deliveryDetails,
    handleDeliveryChange,
    couponCode,
    handleCouponChange,
    handleApplyCoupon,
    discount,
    selectedSeats,
    setSelectedSeats,
    maxSeats,
    handleCancel,
    handleContinue,
    handleBack,
    order,
    total,
    ticketDataList,
  };
};

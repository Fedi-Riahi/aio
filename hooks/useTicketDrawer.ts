import { useState, useEffect } from "react";
import { Ticket } from "@/types/eventDetails";
import { DeliveryDetails, TicketOrder } from "@/types/ticketDrawer";
import { TicketData } from "@/types/paymentStep"; // Assuming this is where TicketData is defined
import { calculateTotal, applyCoupon } from "@/utils/ticketDrawerUtils";

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
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});
  const [userNames, setUserNames] = useState<{ [key: string]: string[] }>({});
  const [step, setStep] = useState<"selectQuantity" | "selectSeats" | "enterNames" | "payment" | "confirmation">("selectQuantity");
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

  // Log ticketDataList for debugging
  const ticketDataList = buildTicketDataList(selectedTickets, userNames, tickets, ticketType, hasSeatTemplate, selectedSeats);
  useEffect(() => {
    console.log("ticketDataList in useTicketDrawer:", ticketDataList);
  }, [ticketDataList]); // Dependency on ticketDataList directly

  const handleQuantityChange = (ticketId: string, quantity: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, quantity), // Prevent negative quantities
    }));
  };

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

  const handlePaymentModeChange = (mode: "delivery" | "online") => {
    setPaymentMode(mode);
  };

  const handleDeliveryChange = (field: keyof DeliveryDetails, value: string) => {
    setDeliveryDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
  };

  const handleApplyCoupon = () => {
    const newDiscount = applyCoupon(couponCode);
    setDiscount(newDiscount);
  };

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

  const handleContinue = () => {
    if (step === "selectQuantity") {
      const hasSelectedTickets = Object.values(selectedTickets).some((quantity) => quantity > 0);
      if (!hasSelectedTickets) {
        alert("Please select at least one ticket.");
        return;
      }
      setStep(hasSeatTemplate ? "selectSeats" : "enterNames");
    } else if (step === "selectSeats") {
      if (selectedSeats.length !== maxSeats) {
        alert(`Please select exactly ${maxSeats} seat${maxSeats !== 1 ? "s" : ""}. You have selected ${selectedSeats.length}.`);
        return;
      }
      setStep("enterNames");
    } else if (step === "enterNames") {
      const allNamesEntered = Object.entries(selectedTickets).every(([ticketId, quantity]) => {
        const ticketUsers = userNames[ticketId] || [];
        return ticketUsers.length === quantity && ticketUsers.every((name) => name.trim() !== "");
      });
      if (!allNamesEntered) {
        alert("Please enter names for all selected tickets.");
        return;
      }
      setStep("payment");
    } else if (step === "payment") {
      setStep("confirmation");
    } else if (step === "confirmation") {
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
    } else if (step === "confirmation") {
      setStep("payment");
    }
  };

  const order: TicketOrder = {
    event_id: { id: eventId },
    period_index: periodIndex,
    location_index: locationIndex,
    time_index: timeIndex,
    takenSeats: seatData?.taken || [],
  };

  const total = calculateTotal(tickets, selectedTickets, ticketType, paymentMode, discount);

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

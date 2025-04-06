import { useState, useEffect, useMemo, useCallback } from "react";
import { Ticket } from "@/types/eventDetails";
import { DeliveryDetails, TicketOrder } from "@/types/ticketDrawer";
import { TicketData } from "@/types/paymentStep";
import { calculateTotal, applyCoupon } from "@/utils/ticketDrawerUtils";
import toast from "react-hot-toast";

interface TicketType {
  id: string;
  name: string;
  price: number;
}

interface Seat {
  id: string;
  name: string;
}

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
    const ticketTypeIndex = ticketType.findIndex((tt) => tt.id === ticketId);
    const names = userNames[ticketId] || [];

    for (let i = 0; i < quantity; i++) {
      ticketDataList.push({
        ticket_id: ticketId,
        name: names[i] || ticketTypeData?.name || ticket?.name || "Unnamed",
        ticket_index: ticketTypeIndex !== -1 ? ticketTypeIndex : 0,
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
  const [step, setStep] = useState<"selectQuantity" | "selectSeats" | "enterNames" | "payment">("selectQuantity");
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

  useEffect(() => {
    const totalSelectedTickets = Object.values(selectedTickets).reduce((sum, quantity) => sum + quantity, 0);
    setMaxSeats(totalSelectedTickets);
    if (selectedSeats.length > totalSelectedTickets) {
      setSelectedSeats(selectedSeats.slice(0, totalSelectedTickets));
    }
  }, [selectedTickets]);

  const ticketDataList = useMemo(
    () => buildTicketDataList(selectedTickets, userNames, tickets, ticketType, hasSeatTemplate, selectedSeats),
    [selectedTickets, userNames, tickets, ticketType, hasSeatTemplate, selectedSeats]
  );

  const handleQuantityChange = (ticketId: string, quantity: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, quantity),
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

  const resetOrderState = useCallback(() => {
    setSelectedTickets({});
    setUserNames({});
    setPaymentMode(null);
    setDeliveryDetails({ name: "", prename: "", address: "" });
    setCouponCode("");
    setDiscount(0);
    setSelectedSeats([]);
    setMaxSeats(0);
    setStep("selectQuantity");
  }, []);

  const handleCancel = useCallback(() => {
    resetOrderState();
    onClose();
  }, [resetOrderState, onClose]);

  const handleContinue = useCallback(() => {
    if (step === "selectQuantity") {
      const hasSelectedTickets = Object.values(selectedTickets).some((quantity) => quantity > 0);
      if (!hasSelectedTickets) {
        toast("Please select at least one ticket.");
        return;
      }
      setStep(hasSeatTemplate ? "selectSeats" : "enterNames");
    } else if (step === "selectSeats") {
      if (selectedSeats.length !== maxSeats) {
        toast(`Please select exactly ${maxSeats} seat${maxSeats !== 1 ? "s" : ""}. You have selected ${selectedSeats.length}.`);
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
      resetOrderState();
    }
  }, [step, selectedTickets, hasSeatTemplate, selectedSeats, maxSeats, userNames, resetOrderState]);

  const handleBack = useCallback(() => {
    if (step === "selectSeats") {
      setStep("selectQuantity");
    } else if (step === "enterNames") {
      setStep(hasSeatTemplate ? "selectSeats" : "selectQuantity");
    } else if (step === "payment") {
      setStep("enterNames");
    }
  }, [step, hasSeatTemplate]);

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
    setStep,
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
    resetOrderState,
  };
};

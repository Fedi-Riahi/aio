import { useState, useEffect } from "react";
import { Ticket } from "@/types/eventDetails";
import { DeliveryDetails, TicketOrder, TicketData } from "@/types/ticketDrawer";
import { calculateTotal, applyCoupon, buildTicketDataList } from "@/utils/ticketDrawerUtils";

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

  useEffect(() => {
    const totalSelectedTickets = Object.values(selectedTickets).reduce((sum, quantity) => sum + quantity, 0);
    setMaxSeats(totalSelectedTickets);
    if (selectedSeats.length > totalSelectedTickets) {
      setSelectedSeats(selectedSeats.slice(0, totalSelectedTickets));
    }
  }, [selectedTickets]);

  const handleQuantityChange = (ticketId: string, quantity: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: quantity,
    }));
  };

  const handleNameChange = (ticketId: string, index: number, name: string) => {
    setUserNames((prev) => {
      const updatedNames = [...(prev[ticketId] || [])];
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
      if (hasSelectedTickets) {
        setStep(hasSeatTemplate ? "selectSeats" : "enterNames");
      } else {
        alert("Please select at least one ticket.");
      }
    } else if (step === "selectSeats") {
      if (selectedSeats.length === maxSeats) {
        setStep("enterNames");
      } else {
        alert(`Please select exactly ${maxSeats} seat${maxSeats !== 1 ? "s" : ""}. You have selected ${selectedSeats.length}.`);
      }
    } else if (step === "enterNames") {
      const allNamesEntered = Object.entries(selectedTickets).every(([ticketId, quantity]) => {
        const ticketUsers = userNames[ticketId] || [];
        return ticketUsers.length === quantity && ticketUsers.every((name) => name.trim() !== "");
      });

      if (allNamesEntered) {
        setStep("payment");
      } else {
        alert("Please enter names for all selected tickets.");
      }
    } else if (step === "payment") {
      setStep("confirmation");
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
  const ticketDataList = buildTicketDataList(selectedTickets, userNames, tickets, ticketType, hasSeatTemplate, selectedSeats);

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

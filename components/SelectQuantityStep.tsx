import React from "react";
import { IconMinus, IconPlus, IconTicket } from "@tabler/icons-react";
import { SelectQuantityStepProps } from "../types/selectQuantityStep";
import { calculateTotal, getAvailableTicketCount, getTicketInfo } from "../utils/selectQuantityStepUtils";
import { useSelectQuantityStep } from "../hooks/useSelectQuantityStep";

const SelectQuantityStep: React.FC<SelectQuantityStepProps> = ({
  tickets,
  selectedTickets,
  handleQuantityChange,
  ticketType = [],
  ticketsGroups,
  periodIndex,
  locationIndex,
  timeIndex,
}) => {
  const { handleQuantityUpdate } = useSelectQuantityStep(
    tickets,
    selectedTickets,
    handleQuantityChange,
    ticketsGroups,
    periodIndex,
    locationIndex,
    timeIndex
  );

  const total = calculateTotal(tickets, selectedTickets, ticketType);

  return (
    <div className="flex flex-col gap-6">
      {tickets.map((ticket, ticketIndex) => {
        const ticketQuantity = selectedTickets[ticket.ticket_id] || 0;
        const { name: ticketName, price: ticketPrice } = getTicketInfo(ticket, ticketType);
        const availableCount = getAvailableTicketCount(ticket, ticketIndex, ticketsGroups, periodIndex, locationIndex, timeIndex);
        const isSoloTicket = ticket.type.toLowerCase() === "solo";

        return (
          <div
            key={ticket.ticket_id}
            className="flex flex-col md:flex-row justify-between items-center p-6 bg-offwhite backdrop-blur-sm rounded-xl shadow-sm hover:bg-offwhite90 hover:shadow-md transition duration-300"
          >
            <div className="flex items-center gap-6">
              <div className="p-3 bg-main/10 rounded-full">
                <IconTicket stroke={2} width={32} height={32} className="text-main" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white">Billet {ticketName}</h4>
                <p className="text-lg text-main font-medium">{ticketPrice}.00 DT</p>

              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <button
                className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                  ticketQuantity === 0
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-main text-white hover:bg-main/90"
                }`}
                onClick={() => handleQuantityUpdate(ticket, ticketIndex, -1)}
                disabled={ticketQuantity === 0}
              >
                <IconMinus stroke={2} width={20} height={20} />
              </button>
              <span className="text-xl font-medium text-white">{ticketQuantity}</span>
              <button
                className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                  ticketQuantity >= availableCount
                    ? "bg-gray-200 cursor-not-allowed"
                    : "bg-main text-white hover:bg-main/90"
                }`}
                onClick={() => handleQuantityUpdate(ticket, ticketIndex, 1)}
                disabled={ticketQuantity >= availableCount}
              >
                <IconPlus stroke={2} width={20} height={20} />
              </button>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end mt-6">
        <div className="p-6 border bg-offwhite backdrop-blur-sm rounded-xl border-white/20 shadow-sm">
          <h3 className="text-2xl font-semibold text-white">
            Total : <span className="text-main">{total}.00 DT</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default SelectQuantityStep;

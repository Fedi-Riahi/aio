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
    <div className="flex flex-col gap-4">
      {tickets.map((ticket, ticketIndex) => {
        const ticketQuantity = selectedTickets[ticket.ticket_id] || 0;
        const { name: ticketName, price: ticketPrice } = getTicketInfo(ticket, ticketType);
        const availableCount = getAvailableTicketCount(ticket, ticketIndex, ticketsGroups, periodIndex, locationIndex, timeIndex);
        const isSoloTicket = ticket.type.toLowerCase() === "solo";

        return (
          <div
            key={ticket.ticket_id}
            className="flex flex-col md:flex-row justify-between items-center p-5 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="p-3 bg-gradient-to-br from-main to-main/90 rounded-xl shadow-md">
                <IconTicket stroke={2} width={28} height={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white">Billet {ticketName}</h4>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-medium bg-gradient-to-r from-main to-main/90 bg-clip-text text-transparent">
                    {ticketPrice}.00 DT
                  </p>
                  {availableCount > 0 && !isSoloTicket && (
                    <span className="text-xs text-gray-400">
                      ({availableCount} disponibles)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-normal">
              <button
                className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                  ticketQuantity === 0
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600 hover:shadow-md"
                }`}
                onClick={() => handleQuantityUpdate(ticket, ticketIndex, -1)}
                disabled={ticketQuantity === 0}
                aria-label="Réduire la quantité"
              >
                <IconMinus stroke={2} width={18} height={18} />
              </button>

              <div className="min-w-[40px] text-center">
                <span className="text-xl font-medium text-white">{ticketQuantity}</span>
              </div>

              <button
                className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                  ticketQuantity >= availableCount
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 text-white hover:bg-gray-600 hover:shadow-md"
                }`}
                onClick={() => handleQuantityUpdate(ticket, ticketIndex, 1)}
                disabled={ticketQuantity >= availableCount}
                aria-label="Augmenter la quantité"
              >
                <IconPlus stroke={2} width={18} height={18} />
              </button>
            </div>
          </div>
        );
      })}

      <div className="sticky bottom-0 bg-gray-900/90 backdrop-blur-md py-4 px-6 rounded-xl border border-gray-700 shadow-2xl mt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-medium text-gray-300">Total</h3>
          <div className="text-2xl font-bold bg-gradient-to-r from-main to-main/90 bg-clip-text text-transparent">
            {total}.00 DT
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectQuantityStep;

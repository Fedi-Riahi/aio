import React from "react";
import { IconTicket } from "@tabler/icons-react";
import { EnterNamesStepProps } from "../types/enterNamesStep";
import { getTicketInfo } from "@/utils/enterNamesStepUtils";
import { useEnterNamesStep } from "@/hooks/useEnterNamesStep";

const EnterNamesStep: React.FC<EnterNamesStepProps & {
  eventId: string;
  locationIndex?: number;
  periodIndex?: number;
  timeIndex?: number;
}> = ({
  tickets,
  selectedTickets,
  userNames,
  handleNameChange,
  ticketType,
}) => {
  const { onNameChange } = useEnterNamesStep({
    tickets,
    selectedTickets,
    userNames,
    handleNameChange,
    ticketType,
  });

  return (
    <div className="space-y-6 max-h-[calc(80vh-100px)] overflow-y-auto pr-2">
      {tickets.map((ticket) => {
        const ticketQuantity = selectedTickets[ticket.ticket_id] || 0;
        if (ticketQuantity === 0) return null;

        const { name: ticketName, price: ticketPrice } = getTicketInfo(ticket, ticketType);

        return (
          <div
            key={ticket.ticket_id}
            className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 shadow-lg"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-main to-main/90 rounded-lg shadow-md">
                <IconTicket stroke={2} width={24} height={24} className="text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">Billet {ticketName}</h4>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-main to-main/90 font-medium">
                  {ticketPrice}.00 DT
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {ticketQuantity} {ticketQuantity > 1 ? "billets" : "billet"}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {[...Array(ticketQuantity)].map((_, index) => (
                <div key={index} className="space-y-2">
                  <label
                    className="block text-sm font-medium text-gray-300"
                    htmlFor={`name-${ticket.ticket_id}-${index}`}
                  >
                    Nom complet du participant #{index + 1}
                  </label>
                  <div className="relative">
                    <input
                      id={`name-${ticket.ticket_id}-${index}`}
                      type="text"
                      placeholder="Entrez le nom complet"
                      className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-main focus:ring-1 focus:ring-main outline-none transition-all"
                      value={userNames[ticket.ticket_id]?.[index] || ""}
                      onChange={(e) => onNameChange(ticket.ticket_id, index, e.target.value)}
                      disabled={false}
                      autoComplete="name"
                    />
                    {userNames[ticket.ticket_id]?.[index] && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EnterNamesStep;

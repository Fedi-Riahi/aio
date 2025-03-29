import React from "react";
import { IconTicket } from "@tabler/icons-react";
import { EnterNamesStepProps } from "../types/enterNamesStep";
import { getTicketInfo } from "@/utils/enterNamesStepUtils";
import { useEnterNamesStep } from "@/hooks/useEnterNamesStep";

const EnterNamesStep: React.FC<EnterNamesStepProps> = ({
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
    <div className="space-y-6 max-h-[80vh] overflow-y-auto p-4">
      {tickets.map((ticket) => {
        const ticketQuantity = selectedTickets[ticket.ticket_id] || 0;
        if (ticketQuantity === 0) return null;

        const { name: ticketName, price: ticketPrice } = getTicketInfo(ticket, ticketType);

        return (
          <div
            key={ticket.ticket_id}
            className="p-6 border bg-offwhite backdrop-blur-sm rounded-xl border-foreground/20 shadow-sm flex flex-col gap-4 hover:shadow-md transition duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-main/10 rounded-full">
                <IconTicket stroke={2} width={32} height={32} className="text-main" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-foreground">Billet {ticketName}</h4>
                <p className="text-main font-medium">{ticketPrice}.00 DT</p>
              </div>
            </div>

            <div className="grid gap-3">
              {[...Array(ticketQuantity)].map((_, index) => (
                <div key={index} className="relative">
                  <label
                    className="block text-sm font-medium text-foreground py-2"
                    htmlFor={`name-${ticket.ticket_id}-${index}`}
                  >
                    Propriétaire du billet #{index + 1}
                  </label>
                  <input
                    id={`name-${ticket.ticket_id}-${index}`}
                    type="text"
                    placeholder="Entrez le nom complet"
                    className="w-full p-3 rounded-lg bg-offwhite text-foreground focus:ring-1 focus:ring-gray-500 focus:outline-none"
                    value={userNames[ticket.ticket_id]?.[index] || ""}
                    onChange={(e) => onNameChange(ticket.ticket_id, index, e.target.value)}
                  />
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

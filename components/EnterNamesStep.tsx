import React from "react";
import { IconTicket } from "@tabler/icons-react";
import { Ticket } from "@/types/event";

interface EnterNamesStepProps {
  tickets: Ticket[];
  selectedTickets: { [key: string]: number };
  userNames: { [key: string]: string[] };
  handleNameChange: (ticketId: string, index: number, name: string) => void;
}

const EnterNamesStep: React.FC<EnterNamesStepProps> = ({ tickets, selectedTickets, userNames, handleNameChange }) => {
  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto p-4">
      {tickets.map((ticket) => {
        const ticketQuantity = selectedTickets[ticket.ticket_id] || 0;
        if (ticketQuantity === 0) return null;

        return (
          <div
            key={ticket.ticket_id}
            className="p-6 border  bg-white backdrop-blur-sm rounded-xl border-white/20 shadow-sm flex flex-col gap-4  hover:shadow-md transition duration-300"
          >
            <div className="flex items-center gap-4">
             <div className="p-3 bg-main/10 rounded-full">
                <IconTicket stroke={2} width={32} height={32} className="text-main" />
            </div>
              <div>
                <h4 className="text-lg font-semibold text-black">{ticket.type} Ticket</h4>
                <p className="text-main font-medium ">{ticket.price}.00 DT</p>
              </div>
            </div>

            <div className="grid gap-3">
              {[...Array(ticketQuantity)].map((_, index) => (
                <div key={index} className="relative">
                  <label className="block text-sm font-medium text-gray-700 py-2" htmlFor={`name-${ticket.ticket_id}-${index}`}>
                    Ticket Owner #{index + 1}
                  </label>
                  <input
                    id={`name-${ticket.ticket_id}-${index}`}
                    type="text"
                    placeholder="Enter full name"
                    className="w-full p-3 border rounded-lg text-gray-700 border-gray-300 focus:ring-1 focus:ring-main focus:outline-none"
                    value={userNames[ticket.ticket_id]?.[index] || ""}
                    onChange={(e) => handleNameChange(ticket.ticket_id, index, e.target.value)}
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

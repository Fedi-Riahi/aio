import React from "react";
import { IconMinus, IconPlus, IconTicket } from "@tabler/icons-react";
import { Ticket } from "@/types/event";

interface SelectQuantityStepProps {
  tickets: Ticket[];
  selectedTickets: { [key: string]: number };
  handleQuantityChange: (ticketId: string, quantity: number) => void;
}

const SelectQuantityStep: React.FC<SelectQuantityStepProps> = ({
  tickets,
  selectedTickets,
  handleQuantityChange,
}) => {

  const calculateTotal = () => {
    return tickets.reduce((total, ticket) => {
      const quantity = selectedTickets[ticket.ticket_id] || 0;
      return total + quantity * ticket.price;
    }, 0);
  };

  const total = calculateTotal();

  const handleQuantityUpdate = (ticketId: string, newQuantity: number, availableCount: number) => {

    if (newQuantity >= 0 && newQuantity <= availableCount) {
      handleQuantityChange(ticketId, newQuantity);
    }
  };

  return (
    <div className="flex flex-col gap-6 ">

      {tickets.map((ticket) => {
        const ticketQuantity = selectedTickets[ticket.ticket_id] || 0;

        return (
          <div
            key={ticket.ticket_id}
            className="flex flex-col md:flex-row justify-between items-center p-6   bg-offwhite backdrop-blur-sm rounded-xl  shadow-sm hover:bg-offwhite90 hover:shadow-md transition duration-300"
          >

            <div className="flex items-center gap-6">
              <div className="p-3 bg-main/10 rounded-full">
                <IconTicket stroke={2} width={32} height={32} className="text-main" />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-white">{ticket.type} Ticket</h4>
                <p className="text-lg text-main font-medium">{ticket.price}.00 DT</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <button
                className={`flex items-center justify-center p-2 rounded-lg transition-all ${
                  ticketQuantity === 0
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-main text-white hover:bg-main/90"
                }`}
                onClick={() =>
                  handleQuantityUpdate(ticket.ticket_id, Math.max(0, ticketQuantity - 1), ticket.count)
                }
                disabled={ticketQuantity === 0}
              >
                <IconMinus stroke={2} width={20} height={20} />
              </button>
              <span className="text-xl font-medium text-white">{ticketQuantity}</span>
              <button
                className={`flex items-center justify-center p-2 rounded-lg  transition-all ${ticketQuantity >= ticket.count ? "bg-gray-200 cursor-not-allowed": "bg-main text-white hover:bg-main/90"}`}
                onClick={() =>
                  handleQuantityUpdate(ticket.ticket_id, ticketQuantity + 1, ticket.count)
                }
                disabled={ticketQuantity >= ticket.count}
              >
                <IconPlus stroke={2} width={20} height={20} />
              </button>
            </div>
          </div>
        );
      })}


      <div className="flex justify-end mt-6">
        <div className="p-6 border   bg-offwhite backdrop-blur-sm rounded-xl border-white/20 shadow-sm">
          <h3 className="text-2xl font-semibold text-white">
            Total : <span className="text-main">{total}.00 DT</span>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default SelectQuantityStep;

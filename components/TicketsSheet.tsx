"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { TicketComponent } from "./Ticket";
import { TicketDrawer } from "../types/ticketsSheet";
import { useTicketsSheet } from "@/hooks/useTicketsSheet";
import { Clock, Loader2 } from "lucide-react";
import { MdOutlineSupportAgent } from "react-icons/md";
import { IconRosetteDiscountCheck, IconTicket, IconTruckDelivery } from "@tabler/icons-react";

export const TicketsSheet = ({ open, onOpenChange }: TicketDrawer) => {
  const {
    closeDrawer,
    ticketRefs,
    cancelOrder,
    handleDownloadPDF,
    handleDownloadAllTickets,
    ticketData,
    orders,
    selectedOrder,
    fetchTicketsForOrder,
    isLoading,
    error,
  } = useTicketsSheet({
    open,
    onOpenChange,
  });

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/80 z-50 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeDrawer}
      ></div>

      <div
        className={`fixed top-0 right-0 z-50 w-full sm:w-96 h-full bg-background text-white shadow-lg transition-transform transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {selectedOrder ? "Vos billets" : "Vos commandes"}
            </h2>
            <Button
              onClick={selectedOrder ? () => fetchTicketsForOrder("") : closeDrawer}
              variant="ghost"
              size="icon"
              className="hover:bg-gray-800 rounded-full text-md text-white hover:text-white/90 transition duration-300"
            >
              {selectedOrder ? "Retour" : "Fermer"}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : selectedOrder ? (
              <div className="flex flex-col gap-6">
                {ticketData.length > 0 ? (
                  <>
                    <Button
                      className="w-full bg-[#e91e63] text-white hover:bg-[#d81557] transition-colors duration-200"
                      onClick={handleDownloadAllTickets}
                    >
                      Télécharger tous les billets (PDF)
                    </Button>
                    {ticketData.map((ticket, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <div ref={(el) => { ticketRefs.current[index] = el; }}>
                          <TicketComponent
                            eventName={ticket.eventName}
                            date={ticket.date}
                            time={ticket.time}
                            location={ticket.location}
                            referenceCode={ticket.referenceCode}
                            qrValue={`https://your-ticket-validation-site.com/ticket/${encodeURIComponent(
                              ticket.referenceCode
                            )}`}
                            background_thumbnail={ticket.background_thumbnail}
                            className="w-full max-w-[280px] mx-auto"
                          />
                        </div>
                        <Button
                          className="w-1/2 max-w-[280px] bg-[#e91e63] text-white hover:bg-[#d81557] transition-colors duration-200"
                          onClick={() => handleDownloadPDF(index.toString())}
                        >
                          Télécharger PDF
                        </Button>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-center text-gray-400">
                    {error || "Aucun billet disponible pour cette commande."}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div
                      key={order.order_id}
                      className="bg-[#1a2636] rounded-lg overflow-hidden cursor-pointer transition-all duration-300"
                      onClick={() => fetchTicketsForOrder(order.order_id)}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-white">{order.event_name}</h3>
                            <p className="text-sm text-gray-400">{order.owners}</p>
                          </div>
                          <div className="text-[#e91e63] font-bold">
                            {order.totalPrice.toFixed(2)}
                            <span className="text-sm ml-1">DT</span>
                          </div>
                        </div>

                        {order.paymentState === "pending" && (
                          <div className="mb-3 text-sm text-main flex items-center gap-2">
                            <MdOutlineSupportAgent size={18} />
                            <span>Un agent vous contactera pour confirmer</span>
                          </div>
                        )}

                        <div className="border-t border-dashed border-foreground mt-4 pt-4">
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex flex-col items-center justify-center">
                              <div className="text-gray-400 mb-1">Tickets</div>
                              <div className="text-white flex items-center gap-1">
                                <IconTicket size={20} className="text-main" />
                                <span>{order.ticketsCount}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <div className="text-gray-400 mb-1">Payment</div>
                              <div className="text-white flex items-center gap-1">
                                <IconTruckDelivery size={20} className="text-main" />
                                <span>{order.paymentMethod}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <div className="text-gray-400 mb-1">Etat</div>
                              <div className="text-white">
                                {order.paymentState === "Payé" ? (
                                  <div className="flex items-center gap-1">
                                    <IconRosetteDiscountCheck size={20} className="text-main" />
                                    <span>{order.paymentState}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <Clock size={20} className="text-main" />
                                    <span>{order.paymentState}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {order.paymentMethod === "Delivery" && order.paymentState !== "Failed" &&(
                          <div className="mt-4">
                            <button
                              className="w-full text-main font-medium hover:text-main/90 py-2 px-3 rounded-md"
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelOrder(order.order_id);
                              }}
                              disabled={isLoading}
                            >
                              Annuler la commande
                            </button>
                          </div>
                        )}
                        {order.paymentState === "Failed" && (
                            <span className="w-full flex items-center justify-center mt-4 text-main font-medium hover:text-main/90 py-2 px-3">
                                Commande Annulé
                            </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">Aucune commande disponible.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketsSheet;

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import TicketComponent from "@/components/Ticket";
import { TicketDrawer } from "../types/ticketsSheet";
import { useTicketsSheet } from "../hooks/useTicketsSheet";
import { Loader2 } from "lucide-react";

export const TicketsSheet = ({ open, onOpenChange }: TicketDrawer) => {
  const {
    closeDrawer,
    ticketRefs,
    handleDownloadPDF,
    handleDownloadAllTickets,
    ticketData,
    orders,
    selectedOrder,
    fetchTicketsForOrder,
    isLoading,
  } = useTicketsSheet({
    open,
    onOpenChange,
  });

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          backdropFilter: open ? "blur(4px)" : "none",
          transition: "opacity 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out",
        }}
        onClick={closeDrawer}
      ></div>

      <div
        className={`fixed top-0 right-0 z-50 w-full sm:w-96 h-full bg-background shadow-lg transition-transform transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          transitionDuration: "0.3s",
          transitionProperty: "transform",
        }}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {selectedOrder ? "Vos billets" : "Vos commandes"}
            </h2>
            <Button
              onClick={selectedOrder ? () => fetchTicketsForOrder("") : closeDrawer} // Reset to orders view or close
              variant="ghost"
              size="icon"
              className="hover:bg-muted rounded-full text-md text-main hover:text-main/90 transition duration-300"
            >
              {selectedOrder ? "Retour" : "Fermer"}
            </Button>
          </div>

          <div className="bg-muted/20 p-6 rounded-lg transition duration-300 hover:shadow-md flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : selectedOrder ? (
              <div className="flex flex-col gap-6">
                {ticketData.length > 0 ? (
                  <>
                    <Button
                      className="w-full bg-main text-white hover:bg-primary/90 transition-colors duration-200"
                      onClick={handleDownloadAllTickets}
                    >
                      Télécharger tous les billets (PDF)
                    </Button>
                    {ticketData.map((ticket, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <div
                          ref={(el) => {
                            ticketRefs.current[index] = el;
                          }}
                        >
                          <TicketComponent
                            eventName={ticket.eventName}
                            date={ticket.date}
                            time={ticket.time}
                            location={ticket.location}
                            referenceCode={ticket.referenceCode}
                            qrValue={`https://your-ticket-validation-site.com/ticket/${encodeURIComponent(
                              ticket.referenceCode
                            )}`}
                            background_thumbnail={ticket.background_thumbnail} // Pass background_thumbnail
                            className="w-full max-w-[280px] mx-auto"
                          />
                        </div>
                        <Button
                          className="w-1/2 max-w-[280px] bg-main text-white hover:bg-primary/90 transition-colors duration-200"
                          onClick={() => handleDownloadPDF(index)}
                        >
                          Télécharger PDF
                        </Button>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-center text-muted-foreground">Aucun billet disponible.</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div
                      key={order.order_id}
                      className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => fetchTicketsForOrder(order.order_id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{order.event_name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {order.ticketsCount} billet{order.ticketsCount > 1 ? "s" : ""}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Organisateur: {order.owners}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Méthode de paiement: {order.paymentMethod}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          {order.totalPrice.toFixed(2)} DT
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between text-sm">
                        <span
                          className={`px-2 py-1 rounded ${
                            order.paymentState === "paid"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.paymentState === "paid" ? "Payé" : "En attente"}
                        </span>
                        <span className="text-muted-foreground">
                          {new Date(order._id).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">Aucune commande disponible.</p>
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

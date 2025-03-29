"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import TicketComponent from "@/components/Ticket";
import { TicketDrawer } from "../types/ticketsSheet";
import { useTicketsSheet } from "../hooks/useTicketsSheet";


export const TicketsSheet = ({ open, onOpenChange }: TicketDrawer) => {
  const { closeDrawer, ticketRefs, handleDownloadPDF, ticketData } = useTicketsSheet({
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
            <h2 className="text-2xl font-bold text-foreground">Vos billets</h2>
            <Button
              onClick={closeDrawer}
              variant="ghost"
              size="icon"
              className="hover:bg-muted rounded-full text-md text-main hover:text-main/90 transition duration-300"
            >
              Fermer
            </Button>
          </div>

          <div className="bg-muted/20 p-6 rounded-lg transition duration-300 hover:shadow-md flex-1 overflow-y-auto">
            <div className="flex flex-col gap-6">
              {ticketData.length > 0 ? (
                ticketData.map((ticket, index) => (
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
                        className="w-full max-w-[280px] mx-auto"
                      />
                    </div>
                    <Button
                      className="w-full max-w-[280px] bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
                      onClick={() => handleDownloadPDF(index)}
                    >
                      Télécharger PDF
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">Aucun billet disponible.</p>
              )}
            </div>
          </div>
        </div>
      </div>
</>
  );
};

export default TicketsSheet;

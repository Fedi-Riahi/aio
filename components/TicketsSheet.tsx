"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

interface TicketDrawer {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const TicketsSheet = ({ open, onOpenChange }: TicketDrawer) => {
  const closeDrawer = () => {
    onOpenChange(false);
  };

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
            <h2 className="text-2xl font-bold text-foreground">Your Tickets</h2>
            <Button
              onClick={closeDrawer}
              variant="ghost"
              size="icon"
              className="hover:bg-muted rounded-full text-md text-main hover:text-main/90 transition duration-300"
            >
             Close
            </Button>
          </div>


          <div className="bg-muted/20 p-6 rounded-lg transition duration-300 hover:shadow-md bg-offwhite">
            <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">18/02/2025 - 20:00</span>
                <h3 className="text-lg font-semibold text-foreground">Un parfait inconnu</h3>
              </div>

   
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">

                  <div className="relative flex items-center justify-center">
                    <div className="bg-primary/10 p-4 rounded-full absolute" />
                     <div className="p-3 bg-main/10 rounded-full">
                        <Ticket size={24} className="text-main" />
                      </div>
                  </div>


                  <div>
                    <h4 className="text-lg font-semibold text-foreground">Solo Ticket</h4>
                    <p className="text-lg font-bold text-primary">120.00 DT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className="mt-auto pt-6 border-t border-muted">
            <Button className="w-full bg-primary text-white hover:bg-primary/90 transition-colors duration-200">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
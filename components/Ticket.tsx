// ./components/Ticket.tsx
import React from "react";
import { cn } from "../lib/utils";
import { QRCodeCanvas } from "qrcode.react";
import Image from "next/image";

interface TicketProps {
  eventName?: string;
  date?: string;
  time?: string;
  location?: string;
  referenceCode?: string;
  qrValue?: string;
  className?: string;
  background_thumbnail?: string;
}

export function TicketComponent(props: Partial<TicketProps>) {
  const {
    eventName,
    date,
    time,
    location,
    referenceCode,
    qrValue,
    className,
    background_thumbnail,
  } = props;

  const defaultBackground = "./bg-ticket.webp";

  return (
    <div
      className={cn(
        "relative w-[300px] h-[800px] md:w-[300px] md:h-[800px] rounded-[20px] overflow-hidden shadow-lg text-white",
        className
      )}
      style={{
        backgroundImage: `url(${background_thumbnail || defaultBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 h-full">
        {/* Upper Section */}
        <div className="mt-20 mr-0 flex flex-col items-start justify-between gap-10 rotate-90">
          <Image src="/fichier_2.png" alt="AIO" width={80} height={10} />
          <div>
            <p className="text-md font-bold text-foreground mt-1 text-stroke-sm ">First Name</p>
            <div className="w-1/2 border-t border-white border-dashed " />
            <p className="text-md font-bold text-foreground mt-1 text-stroke-sm">{date}</p>
            <div className="w-1/2 border-t border-white border-dashed" />
            <p className="text-md font-bold text-foreground mt-1 text-stroke-sm">{time}</p>
            <div className="w-1/2 border-b border-white border-dashed " />
            <p className="text-md font-bold text-foreground mt-1 text-stroke-sm">{location}</p>
          </div>
        </div>

        <div className="rotate-90 absolute top-80 right-10">
          <p className="text-md w-[280px] font-bold text-foreground mt-1 text-stroke-sm">
            ACCÈS NORMAL • SECOND RELEASE
          </p>
          <h1 className="text-2xl font-bold text-foreground mt-1 text-stroke-sm">{eventName}</h1>
        </div>

        {/* Dashed Line */}
        <div className="absolute bottom-60 w-full border-t border-white border-dashed py-2" />

        {/* Lower Section */}
        <div className="absolute bottom-16 w-full flex flex-col items-center p-5 rotate-90">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider opacity-60">REFERENCE</p>
            <p className="text-xs font-medium tracking-wider">{referenceCode}</p>
          </div>
          <QRCodeCanvas
            value={qrValue || ""}
            size={120}
            bgColor="transparent"
            fgColor="#ffffff"
            level="H"
            includeMargin={false}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
}
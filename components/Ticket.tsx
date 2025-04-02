import React from "react";
import { cn } from "../lib/utils";
import { QRCodeCanvas } from "qrcode.react";

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

export function Ticket(props: Partial<TicketProps>) {
  const {
    eventName = "HARDWAVE TEK",
    date = "23 NOV 2024",
    time = "00:00 - 05:00",
    location = "CERCLE CLUB GAMMARTH",
    referenceCode = "S_ESRBTLV4O_",
    qrValue = "QR-VALUE",
    className,
    background_thumbnail,
  } = props;

  const defaultBackground = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819";
  const circleSize = 30;
  const frameAdjustment = 40;

  return (
    <div
      className={cn(
        "relative w-[300px] h-[800px] rounded-[20px] overflow-hidden shadow-lg text-white",
        className
      )}
      style={{
        backgroundImage: `url(${background_thumbnail || defaultBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#1E2A44",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative z-10 h-full">

        {/* Logo */}
        <div className="absolute top-14 right-6 rotate-90">
          <h2 className="text-2xl font-bold tracking-wider">AiO</h2>
        </div>
        {/* Upper Section */}
        <div className="absolute -top-4 left-14 flex flex-col items-start justify-center  p-5 rotate-90">

          <p className="text-lg font-bold mt-4">First Name</p>
          <div className="w-full border-t border-white border-dashed py-2"/>
          <p className="text-lg font-bold mt-4">{date}</p>
          <div className="w-full border-t border-white border-dashed py-2"/>
          <p className="text-sm opacity-80">{time}</p>
          <div className="w-full border-b border-white border-dashed py-2"/>
          <p className="text-sm opacity-80 mt-2">{location}</p>
        </div>

        <div className="rotate-90 absolute top-80 right-10 ">
          <p className="text-sm font-medium mb-1">ACCÈS NORMAL • SECOND RELEASE</p>
          <h1 className="text-xl font-bold tracking-wide">{eventName}</h1>

        </div>

        {/* Dashed Line with Circles */}

<div className="absolute bottom-52 w-full border-t border-white border-dashed py-2"/>
        {/* Lower Section */}
        <div className="absolute bottom-0 w-full flex flex-col items-center p-5 rotate-90">

          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider opacity-60">REFERENCE</p>
            <p className="text-xs font-medium tracking-wider">{referenceCode}</p>
          </div>
          <QRCodeCanvas
            value={qrValue}
            size={120}
            bgColor="transparent"
            fgColor="#ffffff"
            level="H"
            includeMargin={false}
            className="mt-2"
          />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent to-purple-500 opacity-30" />
    </div>
  );
}

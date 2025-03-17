"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { QRCodeCanvas } from "qrcode.react"; // Use named export QRCodeCanvas
import Image from "next/image";

interface TicketProps {
  eventName: string;
  date: string;
  time: string;
  location: string;
  referenceCode: string;
  qrValue?: string;
  className?: string;
}

export default function Ticket({
  eventName = "HARDWAVE TEK SECOND RELEASE",
  date = "23 NOV 2024",
  time = "00:30",
  location = "CERCLE - GAMMARTH CLUB",
  referenceCode = "S.BRTV0C",
  qrValue = `https://your-ticket-validation-site.com/ticket/${encodeURIComponent(referenceCode)}`,
  className,
}: TicketProps) {
  return (
    <div
      className={cn(
        "relative w-[300px] h-[500px] bg-gradient-to-b from-gray-900 to-black rounded-[20px] overflow-hidden shadow-lg p-6 text-white",
        className
      )}
    >
      {/* Top-left gradient semicircle */}
      <div
        className="absolute top-0 left-0 w-[150px] h-[150px] bg-gradient-to-r from-main to-transparent rounded-full transform -translate-y-1/2"
      />
      {/* Bottom-right gradient semicircle */}
      <div
        className="absolute -bottom-20 -right-10 w-[150px] h-[150px] bg-gradient-to-r from-main to-transparent rounded-full transform -translate-y-1/2"
      />

      {/* Branding/Logo (AIO) */}
      <div className="absolute top-4 right-4 text-3xl font-bold text-purple-300 z-20">
        <Image src="/aio-events-logo.png" alt="" width={50} height={50}/>
      </div>

      {/* Event Details */}
      <div className="relative z-10 mt-16">
        <p className="text-sm uppercase tracking-wider">ACCÈS</p>
        <h2 className="text-2xl font-semibold mt-2">{eventName}</h2>
        <div className="mt-4 space-y-1 text-sm">
          <p>{date}</p>
          <p>{time}</p>
          <p>{location}</p>
        </div>
      </div>

      {/* Perforated Line */}
      <div className="absolute left-0 right-0 top-[60%] h-px bg-white/20">
        <div className="w-full h-1 bg-transparent border-dashed border-t-2 border-white/20"></div>
      </div>

      {/* QR Code Section */}
      <div className="relative z-10 mt-20 flex flex-col items-center">
        <QRCodeCanvas
          value={qrValue} // Dynamically set QR code value
          size={110} // Size in pixels
          bgColor="#1a202c" // Match background color (dark gray)
          fgColor="#ffffff" // White foreground for contrast
          level="H" // Error correction level (High)
          includeMargin={true}
          className="rounded"
        />
        <p className="mt-2 text-xs uppercase tracking-wider text-gray-400">
          REFERENCE: {referenceCode}
        </p>
      </div>
    </div>
  );
}
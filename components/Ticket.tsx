"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { QRCodeCanvas } from "qrcode.react";
import Image from "next/image";
import { TicketProps } from "../types/ticket";
import { useTicket } from "../hooks/useTicket";

export default function Ticket(props: Partial<TicketProps>) {
  const { ticketProps } = useTicket(props);
  const { eventName, date, time, location, referenceCode, qrValue, className } = ticketProps;

  return (
    <div
      className={cn(
        "relative w-[300px] h-[500px] bg-gradient-to-b from-gray-900 to-black rounded-[20px] overflow-hidden shadow-lg text-white",
        className
      )}
    >
      <div
        className="absolute top-0 left-0 w-[150px] h-[150px] bg-gradient-to-r from-main to-transparent rounded-full transform -translate-y-1/2"
      />
      <div
        className="absolute -bottom-20 -right-10 w-[150px] h-[150px] bg-gradient-to-r from-main to-transparent rounded-full transform -translate-y-1/2"
      />

      <div className="absolute top-4 right-4 z-20">
        <Image
          src="/aio-events-logo.png"
          alt="Logo AIO Events"
          width={50}
          height={50}
          className="opacity-80"
        />
      </div>

      <div className="relative z-10 mt-12 px-6">
        <p className="text-xs uppercase tracking-widest text-gray-300">Billet d&apos;entrée</p>
        <h2 className="text-xl font-bold mt-2 leading-tight">{eventName}</h2>
        <div className="mt-3 space-y-1 text-xs tracking-wide">
          <p>{time}</p>
          <p>{date}</p>
          <p>{location}</p>
        </div>
      </div>

      <div className="absolute left-0 right-0 top-[60%] h-px">
        <div className="w-full h-1 bg-transparent border-dashed border-t-2 border-white/30"></div>
      </div>

      <div className="relative z-10 mt-16 flex flex-col items-center">
        <QRCodeCanvas
          value={qrValue}
          size={100}
          bgColor="transparent"
          fgColor="#ffffff"
          level="H"
          includeMargin={true}
          className="rounded"
        />
        <p className="mt-3 text-[10px] uppercase tracking-widest text-gray-400">
          Référence: {referenceCode}
        </p>
      </div>
    </div>
  );
}

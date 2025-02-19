"use client"
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { eventData } from "@/data/data";
import {  Users, Tag, ArrowLeft, Info, Ticket } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import TicketDrawer from "@/components/TicketDrawer";
import { IconCopy } from '@tabler/icons-react';

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const event = eventData.find((event) => event.id === id);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState(event?.periods[0]);
  const [selectedLocation, setSelectedLocation] = useState(selectedPeriod?.locations[0]);
  const [selectedTime, setSelectedTime] = useState(selectedLocation?.times[0]);

  if (!event) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Loading event details...</div>;
  }

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <div className="max-w-7xl mx-auto px-4 my-10 md:my-20 ">

      <Link href="/" className="flex items-center gap-2  text-foreground w-fit py-2 px-4 rounded-lg ">
        <ArrowLeft size={24} />
        <span className="text-lg">Back</span>
      </Link>


      <div className="relative w-full h-[40vh] md:h-[50vh] my-8 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
        <Image src={event.thumbnail[1] || event.thumbnail[0]  } alt={event.event_name} layout="fill" className="object-cover" quality={100} />
        <div className="absolute top-4 right-4 z-20">
            <IconCopy stroke={2} className="w-10 h-10 rounded-lg text-foreground bg-black/20 p-2 cursor-pointer hover:bg-black/40 transition duration-300" />
        </div>
        <div className="absolute bottom-6 left-6 z-20">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-foreground/10 text-foreground rounded-full text-sm font-medium flex items-center gap-1">
              <Tag className="w-4 h-4" />
              {event.categories}
            </span>
            <span className="px-3 py-1 bg-foreground/10 text-foreground rounded-full text-sm font-medium flex items-center gap-1">
              <Users className="w-4 h-4" />
              {event.views} Views
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">{event.event_name}</h1>
        </div>
      </div>


      <div className="flex flex-col lg:flex-row gap-8">

        <div className="w-full lg:w-1/2 space-y-8">

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Event Period</h2>
            <div className="flex flex-wrap gap-4">
              {event.periods.map((period, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${
                    selectedPeriod === period
                      ? 'bg-main text-foreground'
                      : 'bg-offwhite  text-foreground hover:bg-foreground/20'
                  }`}
                >
                  {period.start_day ? new Date(period.start_day).toLocaleDateString("en-US", { day: "numeric", month: "short" }) : "N/A"} -{" "}
                  {period.end_day ? new Date(period.end_day).toLocaleDateString("en-US", { day: "numeric", month: "short" }) : "N/A"}
                </button>
              ))}
            </div>
          </div>


          {selectedPeriod && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Event Schedule</h2>
              <div className="space-y-6">
                {selectedPeriod.locations.map((location, locationIndex) => (
                  <div key={locationIndex} className="space-y-4">
                    <h3 className="text-xl font-semibold text-foreground">
                      Location : <span className="text-main">{location.location}</span>
                    </h3>
                    <div className="flex flex-wrap gap-4">
                      {location.times.map((time, timeIndex) => (
                        <button
                          key={timeIndex}
                          onClick={() => {
                            setSelectedLocation(location);
                            setSelectedTime(time);
                          }}
                          className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${
                            selectedTime === time
                              ? 'bg-main text-foreground'
                              : 'bg-offwhite  text-foreground hover:bg-foreground/20'
                          }`}
                        >
                          {new Date(time.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}


          {selectedTime && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Available Tickets</h2>
              <div className="space-y-4">
                {selectedTime.tickets.map((ticket, ticketIndex) => (
                  <div
                    key={ticketIndex}
                    className="bg-offwhite backdrop-blur-sm rounded-xl p-6 border border-black/10 hover:border-black/20 shadow-sm hover:shadow-lg flex items-center justify-between  transition duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-main/10 rounded-full">
                        <Ticket size={24} className="text-main" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">{ticket.type} Ticket</h4>
                        <p className="text-lg font-bold text-main">{ticket.price}.00 DT</p>
                      </div>
                    </div>
                    <button
                      onClick={openDrawer}
                      className="bg-main text-foreground px-6 py-2 rounded-lg hover:bg-main transition duration-300"
                    >
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-foreground/60">
            <Info size={24} />
            <p>If there are no tickets left, dont worry! Come back later.</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold text-blacks mb-4">Event Description</h2>
          <div className="bg-offwhite backdrop-blur-sm rounded-xl p-6 ">
            <p className="text-lg text-foreground/80 leading-relaxed">{event.description}</p>
          </div>
        </div>
      </div>


      <TicketDrawer
        tickets={selectedTime?.tickets || []}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />
    </div>
  );
};

export default EventDetails;
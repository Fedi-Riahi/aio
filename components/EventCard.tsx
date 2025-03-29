
"use client";

import React, { useState, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconBolt, IconFlame } from "@tabler/icons-react";
import { Event, EventCardProps } from "../types/event";
import { checkEventAdVideo } from "../utils/eventUtils";
import { AdVideoPopup } from "./AdVideoPopup";

const EventCard: React.FC<EventCardProps> = ({
  searchQuery,
  selectedCategory,
  visibleEvents,
}) => {
  const [adVideoUrl, setAdVideoUrl] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [navigateTo, setNavigateTo] = useState<string | null>(null);

  const handleEventNameClick = async (eventId: string) => {
    try {
      const response = await checkEventAdVideo(eventId);
      if (response.success && response.hasAdVideo && response.videoUrl) {
        setAdVideoUrl(response.videoUrl);
        setIsPopupOpen(true);
      } else {

        setNavigateTo(`/event-details/${eventId}`);
      }
    } catch (error) {
      console.error("Erreur dans handleEventNameClick:", error);
      setNavigateTo(`/event-details/${eventId}`);
    }
  };


  useEffect(() => {
    if (!isPopupOpen && navigateTo) {
      window.location.href = navigateTo;
      setNavigateTo(null);
    }
  }, [isPopupOpen, navigateTo]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
        {visibleEvents.map((event: Event) => {
          const startDate = new Date(event.event_date);
          const price = event.tickets[0]?.details.price;
          const location = event.owner[0]?.organization_name;

          return (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: visibleEvents.indexOf(event) * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="relative bg-offwhite rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={event.thumbnail}
                    alt={event.event_name}
                    className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    layout="fill"
                    priority
                  />
                  {price && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-medium">
                      {price} DT
                    </div>
                  )}
                  {event.type && (
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full">
                      {event.type === "new" ? (
                        <>
                          <IconFlame size={16} className="text-main" />
                          <span className="text-sm font-medium capitalize">
                            {event.type === "new" ? "nouveau" : event.type}
                          </span>
                        </>
                      ) : (
                        <>
                          <IconBolt size={16} className="text-yellow-400" />
                          <span className="text-sm font-medium capitalize">
                            {event.type === "trending" ? "tendance" : event.type}
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3
                    onClick={() => handleEventNameClick(event._id)}
                    className="text-xl font-semibold text-card-foreground group-hover:text-primary line-clamp-2 hover:text-main transition-all duration-300 cursor-pointer"
                  >
                    {event.event_name}
                  </h3>

                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2.5" />
                      <span className="text-sm">
                        {startDate.toLocaleDateString("fr-FR", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {location && (
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2.5" />
                        <span className="text-sm">{location}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {event.categories?.map((category, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-2 bg-offwhite text-secondary-foreground rounded-full text-xs font-medium border border-offwhite"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {isPopupOpen && adVideoUrl && (
        <AdVideoPopup
          videoUrl={adVideoUrl}
          onClose={() => {
            setIsPopupOpen(false);
            setAdVideoUrl(null);
            if (navigateTo) {
              window.location.href = navigateTo;
              setNavigateTo(null);
            }
          }}
        />
      )}
    </div>
  );
};

export default EventCard;

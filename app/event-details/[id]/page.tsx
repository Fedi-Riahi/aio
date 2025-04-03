"use client";

import React, { useState } from "react";
import { Users, Tag, ArrowLeft, Info, Ticket, Phone, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TicketDrawer from "@/components/TicketDrawer";
import { IconBrandFacebook, IconBrandInstagram, IconCopy, IconPhoneRinging } from "@tabler/icons-react";
import { useEventDetails } from "@/hooks/useEventDetails";
import { getTicketPrice, getAvailableTicketCount, getLocationName, getTimeDisplay, getPeriodDisplay, isEventTimePassed } from "@/utils/eventDetailsUtils";
import { useNavbar } from "@/hooks/useNavbar";

const EventDetails: React.FC = () => {
  const {
    event,
    loading,
    error,
    selectedPeriod,
    setSelectedPeriod,
    selectedLocation,
    setSelectedLocation,
    selectedTime,
    setSelectedTime,
    seatData,
    hasSeatTemplate,
  } = useEventDetails();
  const { session } = useNavbar();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Chargement des détails de l'événement...</div>;
  }

  if (error || !event) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-500">Erreur: {error || "Événement introuvable"}</div>;
  }

  const openDrawer = () => {
    if (process.env.NODE_ENV === "development") {
      console.log("selectedTime.tickets:", selectedTime?.tickets);
      console.log("event.ticket_type:", event.ticket_type);
    }
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href; // Get the current page URL
      await navigator.clipboard.writeText(currentUrl); // Copy to clipboard
      setIsCopied(true); // Show feedback
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const hasValidTicketType = event.ticket_type && Array.isArray(event.ticket_type) && event.ticket_type.length > 0 && event.ticket_type.every(entry => entry.ticket && typeof entry.ticket === 'object');

  const ownerPhone = event.owner[0]?.phone || "N/A";
  const ownerEmail = event.owner[0]?.email || "N/A";
  const ownerSocialLinks = event.owner[0]?.social_links || [];
  console.log(event)

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <IconBrandInstagram size={20} className="text-main" />;
      case "facebook":
        return <IconBrandFacebook size={20} className="text-main" />;
      default:
        return <Mail size={18} className="text-main" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 my-40 md:my-40">
      <Link href="/" className="flex items-center gap-2 text-foreground w-fit py-2 px-4 rounded-lg">
        <ArrowLeft size={24} />
        <span className="text-lg">Retour</span>
      </Link>

      <div className="relative w-full h-[40vh] md:h-[50vh] my-8 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
        <Image
          src={event.thumbnail?.[1] || event.thumbnail?.[0] || "/default-image.jpg"}
          alt={event.event_name}
          layout="fill"
          className="object-cover"
          quality={100}
        />
        <div className="absolute top-4 right-4 z-20">
        <button
            onClick={handleCopyLink}
            className={`w-10 h-10 rounded-lg bg-black/20 p-2 transition duration-300 flex items-center justify-center ${
              isCopied ? "bg-green-500/50" : "text-foreground hover:bg-black/40"
            }`}
            title={isCopied ? "Lien copié !" : "Copier le lien"}
          >
            <IconCopy stroke={2} className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute bottom-6 left-6 z-20">
          <div className="flex items-center gap-4 mb-4">
            <span className="px-3 py-1 bg-foreground/10 text-foreground rounded-full text-sm font-medium flex items-center gap-1">
              <Users className="w-4 h-4" />
              {event.likes.length || 0} Vues
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">{event.event_name}</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Périodes de l'événement</h2>
            <div className="flex flex-wrap gap-4">
              {event.periods.length > 0 ? (
                event.periods.map((period, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setSelectedLocation(period.locations[0] || null);
                      setSelectedTime(period.locations[0]?.times[0] || null);
                    }}
                    className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${
                      selectedPeriod === period
                        ? "bg-main text-foreground"
                        : "bg-offwhite text-foreground hover:bg-foreground/20"
                    }`}
                  >
                    {getPeriodDisplay(period)}
                  </button>
                ))
              ) : (
                <p>Aucune période disponible pour cet événement.</p>
              )}
            </div>
          </div>

          {selectedPeriod && (
  <div>
    <h2 className="text-2xl font-bold text-foreground mb-4">Programme de l'événement</h2>
    <div className="space-y-6">
      {selectedPeriod.locations?.map((location, locationIndex) => {
        // Get the location name
        const locationName = getLocationName(location.location, event.owner[0]?.organization_name);
        const locationNameMap = locationName + ",Tunisia";

        // Simplified Google Maps URL (not embed, for opening in a new tab)
        const mapUrl = `https://www.google.com/maps/search/?q=${encodeURIComponent(locationNameMap)}`;

        // Log for debugging
        console.log("Location Name:", locationName);
        console.log("Map URL:", mapUrl);

        return (
          <div key={locationIndex} className="space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-foreground">
                Lieu: <span className="text-main">{locationName}</span>
              </h3>
        
              <button
                onClick={() => window.open(mapUrl, "_blank", "noopener,noreferrer")}
                className="px-4 py-2 bg-main text-foreground rounded-lg font-medium transition duration-300 hover:bg-main/90"
                title="Voir sur Google Maps"
              >
                Voir la carte
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              {location.times?.map((time, timeIndex) => (
                <button
                  key={timeIndex}
                  onClick={() => {
                    setSelectedLocation(location);
                    setSelectedTime(time);
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${
                    selectedTime === time && selectedLocation === location
                      ? "bg-main text-foreground"
                      : "bg-offwhite text-foreground hover:bg-foreground/20"
                  }`}
                >
                  {getTimeDisplay(time.start_time, time.end_time, time.tickets)}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

          {selectedTime && selectedLocation && hasValidTicketType && !isEventTimePassed(selectedTime) ? (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Billets disponibles</h2>
              {selectedTime.tickets.length > 0 ? (
                <div className="space-y-4">
                  {selectedTime.tickets.map((ticket, ticketIndex) => {
                    const price = getTicketPrice(ticket.ticket_id, event.ticket_type);
                    const periodIndex = selectedPeriod?.originalIndex || 0;
                    const locationIndex = selectedPeriod?.locations.indexOf(selectedLocation!) || 0;
                    const timeIndex = selectedLocation?.times.indexOf(selectedTime!) || 0;

                    const availableCount = getAvailableTicketCount(
                      ticket.ticket_id,
                      periodIndex,
                      locationIndex,
                      timeIndex,
                      ticketIndex,
                      ticket.count,
                      event.ticketsGroups
                    );

                    const isSoloTicket = ticket.type.toLowerCase() === "solo";
                    const isDisabled = isSoloTicket && availableCount <= 0;
                    const isAvailable = !isDisabled;

                    return (
                      <div
                        key={ticketIndex}
                        className="bg-offwhite backdrop-blur-sm rounded-xl p-6 border border-black/10 hover:border-black/20 shadow-sm hover:shadow-lg flex items-center justify-between transition duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-main/10 rounded-full">
                            <Ticket size={24} className="text-main" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-foreground">Billet {ticket.type}</h4>
                            <p className="text-lg font-bold text-main">
                              {price === "N/A" ? "Prix N/A" : `${price}.00 DT`}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={openDrawer}
                          disabled={(!session) || (isDisabled && session)}
                          className={`px-6 py-2 rounded-lg transition duration-300 ${
                            isAvailable
                              ? "bg-main text-foreground hover:bg-main/90"
                              : "bg-gray-400 text-gray-700 cursor-not-allowed"
                          }`}
                        >
                          Acheter
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">Aucun billet disponible pour ce créneau horaire.</p>
              )}
            </div>
          ) : selectedTime && selectedLocation && hasValidTicketType && isEventTimePassed(selectedTime) ? (
            <div className="flex items-center gap-2 text-foreground/60">
              <Info size={24} />
              <p className="text-red-500 font-semibold">Événement terminé</p>
            </div>
          ) : null}

          <div className="my-6">
            {!hasValidTicketType && (
              <div className="flex items-center justify-start gap-2">
                <IconPhoneRinging className="text-main" size={24} />
                <span className="text-main font-medium text-lg">
                  Veuillez contacter l'organisateur pour obtenir des billets.
                </span>
              </div>
            )}
          </div>

          {!hasValidTicketType && (
            <div className="mt-6 rounded-lg space-y-2 text-foreground/80">
              <h2 className="text-2xl font-bold text-foreground mb-4">Informations</h2>
              <p className="flex items-center gap-3 bg-offwhite py-3 px-4 rounded-md">
                <Phone size={20} className="text-main" />
                <span className="font-semibold text-foreground">{ownerPhone}</span>
              </p>
              <p className="flex items-center gap-3 bg-offwhite py-3 px-4 rounded-md">
                <Mail size={20} className="text-main" />
                <span className="font-semibold text-foreground">{ownerEmail}</span>
              </p>
              {ownerSocialLinks.length > 0 && (
                <div className="space-y-2">
                  {ownerSocialLinks.map((link) => (
                    <p key={link.platform} className="flex items-center gap-3 bg-offwhite py-3 px-4 rounded-md">
                      {getSocialIcon(link.platform)}
                      <Link
                        href={link.social_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-foreground"
                      >
                        {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                      </Link>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-foreground/60">
            <Info size={24} />
            <p>Si tous les billets sont vendus, ne vous inquiétez pas ! Revenez plus tard.</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold text-blacks mb-4">Description de l'événement</h2>
          <div className="bg-offwhite backdrop-blur-sm rounded-xl p-6">
            <p className="text-lg/6 text-foreground/80 leading-relaxed text-justify">{event.description}</p>
          </div>
        </div>
      </div>

      <TicketDrawer
        tickets={selectedTime?.tickets || []}
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        eventType="cinema"
        ticketType={event.ticket_type || []}
        eventId={event._id}
        periodIndex={selectedPeriod?.originalIndex || 0}
        locationIndex={selectedPeriod?.locations.indexOf(selectedLocation!) || 0}
        timeIndex={selectedLocation?.times.indexOf(selectedTime!) || 0}
        ticketIndex={0}
        ticketsGroups={event.ticketsGroups || []}
        hasSeatTemplate={hasSeatTemplate}
        seatData={seatData}
        paymentMethods={event.paymentMethods || []} // Pass paymentMethods from event
      />
    </div>
  );
};

export default EventDetails;

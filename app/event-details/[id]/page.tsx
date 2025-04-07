"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Info, Ticket, Phone, Mail, MessageSquare, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import TicketDrawer from "@/components/TicketDrawer";
import { IconBrandFacebook, IconBrandInstagram, IconCopy, IconMap2, IconMapPin, IconPhoneRinging } from "@tabler/icons-react";
import { useEventDetails } from "@/hooks/useEventDetails";
import { getTicketPrice, getAvailableTicketCount, getLocationName, getTimeDisplay, getPeriodDisplay, isEventTimePassed } from "@/utils/eventDetailsUtils";
import { useNavbar } from "@/hooks/useNavbar";
import toast from "react-hot-toast";

// Define the ExtendedTicket interface locally
interface ExtendedTicket {
  _id: string;
  name: string;
  price: number;
  description?: string; 
}

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
    comments,
    isLoadingComments,
    hasMoreComments,
    toggleLike,
    isProcessingLike
  } = useEventDetails();
  const { session } = useNavbar();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);


  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUserId(userData._id || null);
      } catch (err) {
        console.error("Failed to parse userData from localStorage:", err);
      }
    }
  }, []);
  useEffect(() => {
    if (userId && event?._id) {
      const userLikedEventsKey = `likedEvents_${userId}`;
      const storedLikes = localStorage.getItem(userLikedEventsKey);
      const likedEvents = storedLikes ? JSON.parse(storedLikes) : {};
      if (event.likes?.includes(userId) && !likedEvents[event._id]) {
        likedEvents[event._id] = true;
        localStorage.setItem(userLikedEventsKey, JSON.stringify(likedEvents));
      }
    }
  }, [event, userId]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold">Chargement des détails de l&apos;événement...</div>;
  }

  if (error || !event) {
    return <div className="flex justify-center items-center h-screen text-xl font-semibold text-red-500">Erreur: {error || "Événement introuvable"}</div>;
  }

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast.success("Event URL Copied");
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const handleLikeToggle = async () => {
    if (!userId) {
      toast.error("Please login to like this event");
      return;
    }
  
    try {
      await toggleLike(userId);
  
      const userLikedEventsKey = `likedEvents_${userId}`;
      const storedLikes = localStorage.getItem(userLikedEventsKey);
      const likedEvents = storedLikes ? JSON.parse(storedLikes) : {};
      likedEvents[event._id] = !event.likes?.includes(userId);
      localStorage.setItem(userLikedEventsKey, JSON.stringify(likedEvents));
    } catch (err) {
      if (err instanceof Error) {
        if (!err.message.includes("Unexpected API")) {
          toast.error(err.message || "Failed to update like status");
        }
      } else {
        // Handle non-Error cases (e.g., if err is a string or something else)
        toast.error("An unexpected error occurred");
      }
    }
  };

  const hasValidTicketType = event.ticket_type && Array.isArray(event.ticket_type) && event.ticket_type.length > 0 && event.ticket_type.every(entry => entry.ticket && typeof entry.ticket === 'object');

  const ownerPhone = event.owner[0]?.phone || "N/A";
  const ownerEmail = event.owner[0]?.email || "N/A";
  const ownerSocialLinks = event.owner[0]?.social_links || [];

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram": return <IconBrandInstagram size={20} className="text-main" />;
      case "facebook": return <IconBrandFacebook size={20} className="text-main" />;
      default: return <Mail size={18} className="text-main" />;
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
          <button
            onClick={handleLikeToggle}
            disabled={isProcessingLike || !userId}
            className="like-button"
          >
            <Heart
              className={`heart-icon ${
                userId && event?.likes?.includes(userId)
                  ? "text-red-500 fill-red-500"
                  : "text-foreground"
              }`}
            />
            {event?.likes?.length || 0} Likes
          </button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">{event.event_name}</h1>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Périodes de l&apos;événement</h2>
            <div className="flex flex-wrap gap-4">
              {event.periods.length > 0 ? (
                event.periods.map((period, index) => {
                  const { display, isPassed } = getPeriodDisplay(period);
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        if (!isPassed) {
                          setSelectedPeriod(period);
                          setSelectedLocation(period.locations[0] || null);
                          setSelectedTime(period.locations[0]?.times[0] || null);
                        }
                      }}
                      disabled={isPassed}
                      className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${
                        isPassed
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : selectedPeriod === period
                          ? "bg-foreground text-background"
                          : "bg-offwhite text-foreground hover:bg-foreground/20"
                      }`}
                    >
                      {display}
                      {isPassed && <span className="ml-2 text-sm">(Terminé)</span>}
                    </button>
                  );
                })
              ) : (
                <p>Aucune période disponible pour cet événement.</p>
              )}
            </div>
          </div>

          {selectedPeriod && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Localisation</h2>
              <div className="space-y-6">
                {selectedPeriod.locations?.map((location, locationIndex) => {
                  const locationName = getLocationName(location.location, event.owner[0]?.organization_name);
                  const locationNameMap = locationName + ",Tunisia";
                  const mapUrl = `https://www.google.com/maps/search/?q=${encodeURIComponent(locationNameMap)}`;

                  return (
                    <div key={locationIndex} className="space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-xl font-semibold text-foreground flex items-center gap-4">
                          <div className="bg-foreground/10 p-4 flex items-center justify-center rounded-full">
                            <IconMapPin className="text-main" size={30}/>
                          </div>
                          <span className="text-foreground/80">{locationName}</span>
                        </h3>
                        <button
                          onClick={() => window.open(mapUrl, "_blank", "noopener,noreferrer")}
                          className="flex items-center gap-2 px-4 py-2 text-main rounded-lg font-medium transition duration-300 hover:text-main/90 cursor-pointer"
                          title="Voir sur Google Maps"
                        >
                          Voir Carte
                          <IconMap2 size={30} className="text-main"/>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {location.times?.map((time, timeIndex) => {
                          const { display, isPassed } = getTimeDisplay(time.start_time, time.end_time);
                          return (
                            <button
                              key={timeIndex}
                              onClick={() => {
                                if (!isPassed) {
                                  setSelectedLocation(location);
                                  setSelectedTime(time);
                                }
                              }}
                              disabled={isPassed}
                              className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${
                                isPassed
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : selectedTime === time && selectedLocation === location
                                  ? "bg-foreground text-background"
                                  : "bg-offwhite text-foreground hover:bg-foreground/20"
                              }`}
                            >
                              {display}
                              {isPassed && <span className="ml-2 text-sm">(Terminé)</span>}
                            </button>
                          );
                        })}
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

                // Explicitly type ticket_type with ExtendedTicket
                const ticketType = event.ticket_type.find((t: { _id?: string; ticket: ExtendedTicket }) =>
                  t._id === ticket.ticket_id || (t.ticket as ExtendedTicket)._id === ticket.ticket_id
                ) as { _id?: string; ticket: ExtendedTicket } | undefined;

                return (
                  <div
                    key={ticketIndex}
                    className="bg-offwhite backdrop-blur-sm rounded-xl p-6 border border-black/10 hover:border-black/20 shadow-sm hover:shadow-lg flex items-center justify-between transition duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-main/10 rounded-full">
                        <Ticket size={24} className="text-main" />
                      </div>
                      <div className="relative">
                        <h4 className="text-lg font-normal text-foreground opacity-80">
                          <span className="font-semibold relative group">
                            {ticketType?.ticket?.name}
                            {ticketType?.ticket?.description && (
                              <span className="absolute left-0 -bottom-10 hidden group-hover:block bg-gray-800 text-white text-sm rounded py-2 px-3 z-10 max-w-xs whitespace-normal">
                                {ticketType.ticket.description}
                              </span>
                            )}
                          </span> - Billet
                        </h4>
                        <p className="text-lg font-bold text-main">
                          {price === "N/A" ? "Prix N/A" : `${price}.00 DT`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={openDrawer}
                      disabled={!session || (isDisabled && !!session)}
                      className={`px-6 py-3 rounded-lg font-medium cursor-pointer transition duration-300 ${
                        isAvailable
                          ? "bg-foreground text-background hover:bg-gray-300"
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
                  Veuillez contacter l&apos;organisateur pour obtenir des billets.
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-foreground/60">
            <Info size={24} />
            <p>Si tous les billets sont vendus, ne vous inquiétez pas ! Revenez plus tard.</p>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl font-bold text-blacks mb-4">Description de l&apos;événement</h2>
          <div className="bg-offwhite backdrop-blur-sm rounded-xl p-6">
            <p className="text-lg/6 text-foreground/80 leading-relaxed text-justify">{event.description}</p>
          </div>
          {hasValidTicketType && (
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
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <MessageSquare size={24} />
          Commentaires ({comments.length})
        </h2>

        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment._id}
                className="bg-offwhite rounded-xl p-6 border border-black/10 shadow-sm"
              >
                <div className="flex items-center gap-4 mb-3">
                  <Image
                    src={comment.profilePicture || "/default-avatar.jpg"}
                    alt={comment.username}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{comment.username}</p>
                    <p className="text-sm text-foreground/60">
                      {new Date(comment.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-foreground/80">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-foreground/60">Aucun commentaire pour le moment.</p>
          )}

          {isLoadingComments && (
            <div className="text-center py-4">
              <p className="text-foreground/60">Chargement des commentaires...</p>
            </div>
          )}

          {!hasMoreComments && comments.length > 0 && (
            <div className="text-center py-4">
              <p className="text-foreground/60">Tous les commentaires ont été chargés</p>
            </div>
          )}
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
        paymentMethods={event.paymentMethods || []}
      />
    </div>
  );
};

export default EventDetails;

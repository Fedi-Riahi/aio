import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Event, Period, Location, Time, SeatData } from "../types/eventDetails";
import { fetchEventData, fetchSeatData } from "../utils/eventDetailsUtils";

export const useEventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<Period | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedTime, setSelectedTime] = useState<Time | null>(null);
  const [seatData, setSeatData] = useState<SeatData | null>(null);
  const [hasSeatTemplate, setHasSeatTemplate] = useState<boolean | null>(null);

  useEffect(() => {
    const loadEventData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const eventData = await fetchEventData(id as string);

        if (eventData.ticket_type) {
          eventData.ticket_type = eventData.ticket_type.filter(
            (type: any) => type?.ticket && type.ticket._id && type.ticket.price
          );
        } else {
          eventData.ticket_type = [];
        }

        if (eventData.periods) {
          eventData.periods = eventData.periods.map((period: any, index: number) => ({
            ...period,
            originalIndex: index,
            locations: period.locations?.map((location: any) => ({
              ...location,
              times: location.times?.map((time: any) => ({
                ...time,
                tickets: time.tickets?.filter((ticket: any) => {
                  if (!ticket?.ticket_id) return false;
                  return eventData.ticket_type.some((type: any) => type.ticket._id === ticket.ticket_id);
                }) || [],
              })) || [],
            })) || [],
          }));
        } else {
          eventData.periods = [];
        }

        if (process.env.NODE_ENV === "development") {
          console.log("Validated event data:", eventData);
        }

        setEvent(eventData);

        if (eventData.periods.length > 0) {
          const firstPeriod = eventData.periods[0];
          setSelectedPeriod(firstPeriod);
          const firstLocation = firstPeriod.locations[0];
          if (firstLocation) {
            setSelectedLocation(firstLocation);
            if (firstLocation.times?.length > 0) {
              setSelectedTime(firstLocation.times[0]);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadEventData();
  }, [id]);

  useEffect(() => {
    const loadSeatData = async () => {
      if (!id || !selectedPeriod || !selectedLocation || !selectedTime) return;

      const periodIndex = selectedPeriod.originalIndex || 0;
      const locationIndex = selectedPeriod.locations.indexOf(selectedLocation) || 0;
      const timeIndex = selectedLocation.times.indexOf(selectedTime) || 0;

      try {
        const data = await fetchSeatData(id as string, periodIndex, locationIndex, timeIndex);
        setHasSeatTemplate(!!data);
        setSeatData(data);
      } catch (err) {
        setHasSeatTemplate(false);
        setSeatData(null);
      }
    };

    loadSeatData();
  }, [id, selectedPeriod, selectedLocation, selectedTime]);

  return {
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
  };
};

import apiClient from "@/utils/apiClient";
import { Event, Period, Time, SeatData, TicketType, TicketGroup, LocationData, Ticket } from "@/types/eventDetails";

export const fetchEventData = async (id: string): Promise<Event> => {
  try {
    console.log(`Fetching event data for event ${id}`);
    const eventResponse = await apiClient.get(`/event/${id}`);

    const eventData = eventResponse.data;
    const eventDetails = eventData.respond?.data || eventData;
    if (!eventDetails || !eventDetails._id) {
      throw new Error("Invalid event data structure");
    }

    const periodsFromEvent = eventDetails.periods || [];
    const periodsWithLocations: Period[] = [];
    let periodIndex = 0;
    let continueFetching = true;

    while (continueFetching) {
      try {
        console.log(`Fetching periods for event ${id} with periodIndex=${periodIndex}`);
        const periodsResponse = await apiClient.get(`/event/getperiods/getdays/${id}`, {
          params: { periodIndex },
        });

        const periodsData = periodsResponse.data;
        const periodDetails = periodsData.respond?.data || periodsData;
        if (!periodDetails || !periodDetails.locations || !Array.isArray(periodDetails.locations)) {
          if (periodIndex === 0) {
            throw new Error("Invalid periods response: Missing or invalid 'locations' field");
          }
          continueFetching = false;
          break;
        }

        const matchingEventPeriod = periodsFromEvent[periodIndex] || { locations: [] };
        const locationsWithTimes = periodDetails.locations.map((loc: any) => {
          const matchingLocation = matchingEventPeriod.locations.find(
            (eventLoc: any) => eventLoc.location === loc.location._id
          );
          return {
            location: loc.location,
            times: matchingLocation ? matchingLocation.times : [],
          };
        });

        periodsWithLocations.push({
          locations: locationsWithTimes,
          deliveryClosed: periodDetails.deliveryClosed || false,
          start_day: matchingEventPeriod.start_day,
          end_day: matchingEventPeriod.end_day,
          originalIndex: matchingEventPeriod.originalIndex,
        });

        periodIndex++;
      } catch (error) {
        if (error.response?.status === 404 && periodIndex > 0) {
          console.log(`No more periods found for event ${id} at periodIndex=${periodIndex}`);
          continueFetching = false;
          break;
        }
        throw new Error(`Failed to fetch periods for event ${id}: ${error.response?.status || "Unknown"} - ${error.response?.data?.details || error.message || "No details"}`);
      }
    }

    return {
      ...eventDetails,
      periods: periodsWithLocations.length > 0 ? periodsWithLocations : periodsFromEvent.length > 0 ? periodsFromEvent : [{ locations: [], deliveryClosed: false, originalIndex: 0 }],
      ticketsGroups: eventDetails.ticketsGroups || [],
    };
  } catch (error) {
    throw new Error(`Failed to fetch event details for event ${id}: ${error.response?.status || "Unknown"} - ${error.response?.data?.details || error.message || "No details"}`);
  }
};

export const fetchSeatData = async (
  id: string,
  periodIndex: number,
  locationIndex: number,
  timeIndex: number
): Promise<SeatData | null> => {
  try {
    console.log(`Fetching seat data for event ${id} with periodIndex=${periodIndex}, locationIndex=${locationIndex}, timeIndex=${timeIndex}`);
    const response = await apiClient.get(`/event/getperiods/seats/${id}`, {
      params: {
        period_index: periodIndex,
        location_index: locationIndex,
        time_index: timeIndex,
        ticket_index: 0,
      },
    });

    const result = response.data;
    if (result.success) {
      return {
        seats: result.respond.data.seats,
        room_name: result.respond.data.room_name,
        taken: result.respond.data.taken || [],
      };
    }
    console.warn("Seat data request succeeded but success flag is false:", result);
    return null;
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error(`Failed to fetch seat data for event ${id}:`, {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        details: error.response?.data?.details,
      });
    }
    return null;
  }
};

export const getTicketPrice = (ticketId: string, ticketType: TicketType[]): string => {
  if (!ticketType || !Array.isArray(ticketType)) return "N/A";
  const ticket = ticketType.find((t) => t?.ticket?._id === ticketId);
  return ticket?.ticket.price !== undefined ? `${ticket.ticket.price}` : "N/A";
};

export const getAvailableTicketCount = (
  ticketId: string,
  periodIndex: number,
  locationIndex: number,
  timeIndex: number,
  ticketIndex: number,
  totalCount: number,
  ticketsGroups: TicketGroup[]
): number => {
  if (!ticketsGroups || !Array.isArray(ticketsGroups)) return totalCount;

  const ticketGroup = ticketsGroups.find((group) => {
    const id = group._id;
    return (
      id.ticket_ref === ticketId &&
      id.period_index === String(periodIndex) &&
      id.location_index === String(locationIndex) &&
      id.time_index === String(timeIndex) &&
      id.ticket_index === String(ticketIndex)
    );
  });

  const takenCount = ticketGroup ? ticketGroup.count : 0;
  return totalCount - takenCount;
};

export const getLocationName = (location: LocationData, ownerName?: string): string => {
  return location.household_name || ownerName || "Unknown Location";
};

export const getLocalDate = (utcDateString?: string | string[]): string => {
  if (!utcDateString) return "N/A";
  const dateString = Array.isArray(utcDateString) ? utcDateString[0] : utcDateString;
  const utcDate = new Date(dateString);
  return utcDate.toLocaleDateString("en-US", { day: "numeric", month: "short", timeZone: "UTC" });
};

export const getTimeDisplay = (startTime: string | string[], endTime: string | string[], tickets: Ticket[]): string => {
  const startTimeString = Array.isArray(startTime) ? startTime[0] : startTime;
  const endTimeString = Array.isArray(endTime) ? endTime[0] : endTime;

  const startDisplay = startTimeString.split('T')[1]?.substring(0, 5) || startTimeString;
  const endDisplay = endTimeString ? (endTimeString.split('T')[1]?.substring(0, 5) || endTimeString) : '';

  const ticketTypes = tickets.map(ticket => ticket.type).join(", ");
  const timeDisplay = endDisplay ? `${startDisplay} - ${endDisplay}` : startDisplay;
  return ticketTypes ? `${timeDisplay} (${ticketTypes})` : timeDisplay;
};

export const getPeriodDisplay = (period: Period): string => {
  const start = period.start_day
    ? getLocalDate(period.start_day)
    : period.locations?.[0]?.times?.[0]?.start_time
    ? getLocalDate(period.locations[0].times[0].start_time)
    : "N/A";
  const end = period.end_day
    ? getLocalDate(period.end_day)
    : period.locations?.[0]?.times?.[0]?.end_time
    ? getLocalDate(period.locations[0].times[0].end_time)
    : start;
  return `${start} - ${end}`;
};

export const isEventTimePassed = (time: Time | null): boolean => {
    if (!time || !time.end_time) return false;

    const currentDate = new Date();

    const endTimeString = Array.isArray(time.end_time) ? time.end_time[0] : time.end_time;
    const eventEndTime = new Date(endTimeString);

    if (isNaN(eventEndTime.getTime())) {
      console.warn("Invalid end_time format:", endTimeString);
      return false;
    }

    return eventEndTime < currentDate;
  };

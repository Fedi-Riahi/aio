import apiClient from "@/utils/apiClient";
import { Event, Period, Time, SeatData, TicketType, TicketGroup, LocationData, Comment } from "@/types/eventDetails";

export const fetchEventData = async (id: string): Promise<Event> => {
  try {
    console.log(`Fetching event data for event ${id}`);
    const eventResponse = await apiClient.get(`/event/${id}`);

    const eventData = eventResponse.data;
    console.log("event data", eventData);
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
    const response = await apiClient.get(`/event/getperiods/seats/${id}`, {
      params: {
        period_index: periodIndex,
        location_index: locationIndex,
        time_index: timeIndex,
        ticket_index: 0,
      },
      _handle404: true
    });

    if (response.data.success === false) {
      return null;
    }

    return {
      seats: response.data.respond.data.seats,
      room_name: response.data.respond.data.room_name,
      taken: response.data.respond.data.taken || [],
    };
  } catch (error) {
    console.error("Unexpected error fetching seat data:", error);
    return null;
  }
};

export const fetchEventComments = async (
  eventId: string,
  startCount: number,
  maxCount: number
): Promise<Comment[]> => {
  try {
    const response = await apiClient.get(`/comment/${eventId}/comments`, {
      params: { startCount, maxCount }
    });

    const commentsData = response.data.respond?.data || response.data;
    if (!Array.isArray(commentsData)) {
      throw new Error("Invalid comments data structure");
    }

    return commentsData.map((comment: any) => ({
      _id: comment._id,
      content: comment.content,
      profilePicture: comment.profile_picture,
      username: comment.username,
      ownerId: comment.owner_id,
      date: comment.date
    }));
  } catch (error) {
    console.error(`Failed to fetch comments for event ${eventId}:`, error);
    return [];
  }
};

export const toggleEventLike = async (eventId: string): Promise<boolean> => {
    try {
      const response = await apiClient.post(`/normalaccount/like/event/${eventId}`);
      const responseData = response.data;


      if (responseData?.success && typeof responseData?.respond?.data?.liked === 'boolean') {
        return responseData.respond.data.liked;
      }


      if (typeof responseData?.liked === 'boolean') {
        return responseData.liked;
      }

      throw new Error("Unexpected API response format");
    } catch (error) {
      console.error("Like API Error:", {
        error: error.message,
        response: error.response?.data
      });
      throw new Error("Failed to toggle like status");
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

export const getTimeDisplay = (startTime: string | string[], endTime: string | string[]): { display: string; isPassed: boolean } => {
  const startTimeString = Array.isArray(startTime) ? startTime[0] : startTime;
  const endTimeString = Array.isArray(endTime) ? endTime[0] : endTime;

  const startDisplay = startTimeString.split('T')[1]?.substring(0, 5) || startTimeString;
  const endDisplay = endTimeString ? (endTimeString.split('T')[1]?.substring(0, 5) || endTimeString) : '';
  const display = endDisplay ? `${startDisplay} - ${endDisplay}` : startDisplay;

  const currentDate = new Date();
  const isPassed = endTimeString ? new Date(endTimeString) < currentDate : false;

  return { display, isPassed };
};

export const getPeriodDisplay = (period: Period): { display: string; isPassed: boolean } => {
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

  const display = start === end ? start : `${start} - ${end}`;

  const currentDate = new Date();
  let isPassed = false;

  if (period.end_day) {
    const endDateString = Array.isArray(period.end_day) ? period.end_day[0] : period.end_day;
    const periodEndDate = new Date(endDateString);
    isPassed = periodEndDate < currentDate;
  } else {
    const allTimes = period.locations.flatMap(loc => loc.times || []);
    if (allTimes.length > 0) {
      const latestTime = allTimes.reduce((latest, current) => {
        const currentEnd = Array.isArray(current.end_time) ? current.end_time[0] : current.end_time;
        const latestEnd = Array.isArray(latest.end_time) ? latest.end_time[0] : latest.end_time;
        return new Date(currentEnd) > new Date(latestEnd) ? current : latest;
      });
      const endTimeString = Array.isArray(latestTime.end_time) ? latestTime.end_time[0] : latestTime.end_time;
      const periodEndTime = new Date(endTimeString);
      isPassed = periodEndTime < currentDate;
    }
  }

  return { display, isPassed };
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

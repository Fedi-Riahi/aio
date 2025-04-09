import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Event, Period, Location, Time, SeatData, Comment } from "../types/eventDetails";
import { fetchEventData, fetchSeatData, fetchEventComments, toggleEventLike } from "../utils/eventDetailsUtils";

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentPage, setCommentPage] = useState(0);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isProcessingLike, setIsProcessingLike] = useState(false);

  useEffect(() => {
    const loadEventData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const eventData = await fetchEventData(id as string);


        if (!Array.isArray(eventData.likes)) {
          eventData.likes = [];
        }
        if (!Array.isArray(eventData.ticket_type)) {
          eventData.ticket_type = [];
        }
        if (!Array.isArray(eventData.periods)) {
          eventData.periods = [];
        }

        eventData.ticket_type = eventData.ticket_type.filter(
          (type: any) => type?.ticket && type.ticket._id && type.ticket.price
        );

        // Process periods data
        eventData.periods = eventData.periods.map((period: any, index: number) => ({
          ...period,
          originalIndex: index,
          locations: period.locations?.map((location: any) => ({
            ...location,
            times: location.times?.map((time: any) => ({
              ...time,
              tickets: time.tickets?.filter((ticket: any) => {
                if (!ticket?.ticket_id) return false;
                return eventData.ticket_type.some(
                  (type: any) => type.ticket._id === ticket.ticket_id
                );
              }) || [],
            })) || [],
          })) || [],
        }));

        setEvent(eventData);

        // Select first valid period and time
        if (eventData.periods.length > 0) {
          const firstValidPeriod = eventData.periods.find(
            period => !isPeriodPassed(period)
          ) || eventData.periods[0];
          setSelectedPeriod(firstValidPeriod);

          if (firstValidPeriod.locations?.[0]) {
            const firstLocation = firstValidPeriod.locations[0];
            setSelectedLocation(firstLocation);

            if (firstLocation.times?.[0]) {
              const firstValidTime = firstLocation.times.find(
                time => !isTimePassed(time)
              ) || firstLocation.times[0];
              setSelectedTime(firstValidTime);
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
      const locationIndex = selectedPeriod.locations.indexOf(selectedLocation);
      const timeIndex = selectedLocation.times.indexOf(selectedTime);

      try {
        const data = await fetchSeatData(
          id as string,
          periodIndex,
          locationIndex,
          timeIndex
        );
        setHasSeatTemplate(!!data);
        setSeatData(data);
      } catch (err) {
        setHasSeatTemplate(false);
        setSeatData(null);
      }
    };

    loadSeatData();
  }, [id, selectedPeriod, selectedLocation, selectedTime]);

  const loadComments = async (page: number) => {
    if (!id || !hasMoreComments || isLoadingComments) return;

    setIsLoadingComments(true);
    const maxCount = 10;
    const startCount = page * maxCount;

    try {
      const newComments = await fetchEventComments(id as string, startCount, maxCount);
      setComments(prev => [...prev, ...newComments]);
      setHasMoreComments(newComments.length === maxCount);
      setCommentPage(page);
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadComments(0);
    }
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
        hasMoreComments &&
        !isLoadingComments
      ) {
        loadComments(commentPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [commentPage, hasMoreComments, isLoadingComments, id]);

  const isPeriodPassed = (period: Period): boolean => {
    if (!period.end_day && !period.locations?.length) return false;

    const currentDate = new Date();

    if (period.end_day) {
      const endDateString = Array.isArray(period.end_day) ? period.end_day[0] : period.end_day;
      const periodEndDate = new Date(endDateString);
      return periodEndDate < currentDate;
    }

    const allTimes = period.locations.flatMap(loc => loc.times || []);
    if (!allTimes.length) return false;

    const latestTime = allTimes.reduce((latest, current) => {
      const currentEnd = Array.isArray(current.end_time) ? current.end_time[0] : current.end_time;
      const latestEnd = Array.isArray(latest.end_time) ? latest.end_time[0] : latest.end_time;
      return new Date(currentEnd) > new Date(latestEnd) ? current : latest;
    });

    const endTimeString = Array.isArray(latestTime.end_time) ? latestTime.end_time[0] : latestTime.end_time;
    const periodEndTime = new Date(endTimeString);
    return periodEndTime < currentDate;
  };

  const isTimePassed = (time: Time): boolean => {
    if (!time.end_time) return false;

    const currentDate = new Date();
    const endTimeString = Array.isArray(time.end_time) ? time.end_time[0] : time.end_time;
    const timeEndDate = new Date(endTimeString);

    return timeEndDate < currentDate;
  };

  const toggleLike = async (userId: string) => {
    if (!event || !Array.isArray(event.likes)) {
      throw new Error("Event data not loaded properly");
    }

    const wasLiked = event.likes.includes(userId);


    setEvent(prev => prev ? {
      ...prev,
      likes: wasLiked
        ? prev.likes.filter(id => id !== userId)
        : [...prev.likes, userId]
    } : null);

    try {
      const isNowLiked = await toggleEventLike(event._id);


      if (isNowLiked === wasLiked) {
        throw new Error("Like status didn't change as expected");
      }


      return isNowLiked;
    } catch (err) {
      setEvent(prev => prev ? {
        ...prev,
        likes: wasLiked
          ? [...prev.likes, userId]
          : prev.likes.filter(id => id !== userId)
      } : null);
    
      if (err instanceof Error) {
        console.warn("Like operation:", err.message);
      } else {
        console.warn("Like operation failed with unknown error");
      }
      throw err;
    }
  };

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
    comments,
    isLoadingComments,
    hasMoreComments,
    isPeriodPassed,
    isTimePassed,
    toggleLike,
    isLiking,
    isProcessingLike
  };
};

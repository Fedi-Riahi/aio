import apiClient from "./apiClient";
import { Event } from "../types/event";

export const fetchHomeData = async (): Promise<Event[]> => {
  try {
    const response = await apiClient.get("/normalaccount/home");

    const data = response.data; 
    if (!data.respond || !Array.isArray(data.respond.data)) {
      throw new Error("Unexpected data format");
    }

    const homeData = data.respond.data[0];
    const eventMap: { [key: string]: Event } = {};

    const addUniqueEvents = (eventList: any[], type: Event["type"]) => {
      if (!Array.isArray(eventList)) return;

      eventList.forEach((event) => {
        if (!eventMap[event._id]) {
          eventMap[event._id] = {
            ...event,
            type,
            thumbnail: event.thumbnail || "/default-image.jpg",
            categories: [],
            visibility: event.visibility || "Public",
          };
        } else {
          if (
            type === "sponsored" ||
            (type === "trendy" && eventMap[event._id].type === "new")
          ) {
            eventMap[event._id].type = type;
          }
        }
      });
    };

    addUniqueEvents(homeData.sponsoredEvents, "sponsored");
    addUniqueEvents(homeData.trendyEvents, "trendy");
    addUniqueEvents(homeData.newestEvents, "new");

    return Object.values(eventMap);
  } catch (error) {
    throw new Error(`Failed to fetch home data: ${error.response?.status || "Unknown"} - ${error.response?.data?.details || error.message || "No details"}`);
  }
};

export const fetchCategoriesForEvents = async (eventList: Event[]): Promise<Event[]> => {
  return Promise.all(
    eventList.map(async (event) => {
      try {
        const response = await apiClient.get(`/event/${event._id}`);
        const categoryData = response.data;
        return {
          ...event,
          categories: categoryData?.respond?.data?.categorie?.map((category: any) => category.name) || ["Uncategorized"],
        };
      } catch (error) {
        console.error(`Failed to fetch categories for event ${event._id}:`, error.response?.status || error.message);
        return { ...event, categories: ["Uncategorized"] };
      }
    })
  );
};

export const filterEvents = (
  events: Event[],
  searchQuery: string,
  selectedCategory: string
): Event[] => {
  return events.filter((event) => {
    const matchesSearchQuery = event.event_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? event.categories?.includes(selectedCategory)
      : true;
    return matchesSearchQuery && matchesCategory;
  });
};

interface AdVideoResponse {
  success: boolean;
  hasAdVideo: boolean;
  videoUrl?: string;
}

export const checkEventAdVideo = async (eventId: string): Promise<AdVideoResponse> => {
  try {
    const response = await apiClient.get(`/user/getad/video?event_id=${eventId}`);

    const { success, respond } = response.data;
    if (!success) {
      return { success: false, hasAdVideo: false };
    }

    const { data } = respond;

    if (data.noAd) {
      return { success: true, hasAdVideo: false };
    }

    if (data.result && Array.isArray(data.result)) {
      const videoAd = data.result.find((ad: any) => ad.ad?.file_type === "video");
      if (videoAd) {
        return {
          success: true,
          hasAdVideo: true,
          videoUrl: videoAd.ad.url,
        };
      }
      return { success: true, hasAdVideo: false };
    }

    return { success: true, hasAdVideo: false };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return { success: false, hasAdVideo: false };
    }
    if (error.response?.status === 403) {
      return { success: false, hasAdVideo: false };
    }
    return { success: false, hasAdVideo: false };
  }
};

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
    console.error("Error fetching home data:", error);
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

export const fetchEventsByCategory = async (categoryId: string): Promise<Event[]> => {
    try {
      const response = await apiClient.get("/event/geteventsbycategory", {
        params: {
          startCount: 0,
          maxCount: 10,
          category_id: categoryId,
        },
      });
      const data = response.data;
      if (!data.success || !Array.isArray(data.respond?.data)) {
        throw new Error("Unexpected data format");
      }

      return data.respond.data.map((event: any) => ({
        _id: event._id,
        event_name: event.event_name,
        event_date: event.event_date,
        thumbnail: event.thumbnail || "/default-image.jpg",
        tickets: event.tickets.length
          ? event.tickets.map((ticket: any) => ({
              _id: ticket._id,
              discount: ticket.discount || 0,
              details: {
                price: ticket.details.price || 0,
                phases: ticket.details.phases || [],
              },
            }))
          : [{ details: { price: 0, phases: [] } }],
        owner: event.owner.map((org: any) => ({
          _id: org._id,
          organization_name: org.organization_name,
          profile_picture: org.profile_picture || "/default-org-image.jpg",
        })),
        categories: [],
        type: "category",
        visibility: event.isValid ? "Public" : "Private",
        likes: event.likes || [],
        isValid: event.isValid,
      }));
    } catch (error) {
      console.error(
        `Failed to fetch events for category ${categoryId}:`,
        error.response?.status || error.message
      );
      return [];
    }
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

// "use client";
// import React, { useState, useEffect } from "react";
// import { Calendar, MapPin, Slice } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import { IconBolt } from "@tabler/icons-react";

// interface Event {
//   _id: string;
//   event_name: string;
//   thumbnail: string;
//   event_date: string;
//   owner: {
//     _id: string;
//     organization_name: string;
//     profile_picture: string;
//   }[];
//   tickets: {
//     _id: string;
//     discount: number;
//     details: {
//       price: number;
//       phases: {
//         Release: string;
//         price: number;
//         effective_date: string;
//         _id: string;
//       }[];
//     };
//   }[];
//   categories?: string[];
//   visibility?: string;
//   type?: "new" | "sponsored" | "trendy";
// }

// interface EventCardProps {
//   searchQuery: string;
//   selectedCategory: string;
//   visibleEvents: number;
// }

// const EventCard: React.FC<EventCardProps> = ({
//   searchQuery,
//   selectedCategory,
//   visibleEvents,
// }) => {
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchHomeData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/api/proxy/api/normalaccount/home");

//         if (!response.ok) {
//           throw new Error(`Failed to fetch home data: ${response.status}`);
//         }

//         const data = await response.json();
//         if (!data.respond || !Array.isArray(data.respond.data)) {
//           throw new Error("Unexpected data format");
//         }

//         const homeData = data.respond.data[0];

//         const eventMap: { [key: string]: Event } = {}; // Prevents duplicates

//         const addUniqueEvents = (eventList: any[], type: Event["type"]) => {
//           if (!Array.isArray(eventList)) return;

//           eventList.forEach((event) => {
//             if (!eventMap[event._id]) {
//               eventMap[event._id] = {
//                 ...event,
//                 type,
//                 thumbnail: event.thumbnail || "/default-image.jpg",
//                 categories: [], // Initialize empty, fetch later
//                 visibility: event.visibility || "Public",
//               };
//             } else {
//               if (
//                 type === "sponsored" ||
//                 (type === "trendy" && eventMap[event._id].type === "new")
//               ) {
//                 eventMap[event._id].type = type;
//               }
//             }
//           });
//         };

//         addUniqueEvents(homeData.sponsoredEvents, "sponsored");
//         addUniqueEvents(homeData.trendyEvents, "trendy");
//         addUniqueEvents(homeData.newestEvents, "new");

//         const eventsArray = Object.values(eventMap);
//         setEvents(eventsArray);

//         // Fetch categories for each event
//         fetchCategoriesForEvents(eventsArray);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred");
//         setEvents([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHomeData();
//   }, []);

//   const fetchCategoriesForEvents = async (eventList: Event[]) => {
//     const updatedEvents = await Promise.all(
//       eventList.map(async (event) => {
//         try {
//           const categoryRes = await fetch(`/api/proxy/api/event/${event._id}`);
//           if (!categoryRes.ok) throw new Error(`Failed to fetch categories for ${event._id}`);
//           const categoryData = await categoryRes.json();

//           console.log("Event Categories", categoryData);

//           // Assuming categories are available in categoryData.respond.data.categorie
//           return {
//             ...event,
//             categories: categoryData?.respond?.data?.categorie?.map((category: any) => category.name) || ["Uncategorized"],
//           };
//         } catch {
//           return { ...event, categories: ["Uncategorized"] };
//         }
//       })
//     );
//     setEvents(updatedEvents);
//   };


//   const filteredEvents = events.filter((event) => {
//     const matchesSearchQuery = event.event_name
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());

//     const matchesCategory = selectedCategory
//       ? event.categories?.includes(selectedCategory)
//       : true; // If selectedCategory is empty, return true (show all)

//     return matchesSearchQuery && matchesCategory;
//   });

//   const eventsToShow = filteredEvents.slice(0, visibleEvents);

//   if (loading) {
//     return <div className="text-center py-10">Loading events...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-10 text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-10">
//         {eventsToShow.map((event) => {
//           const startDate = new Date(event.event_date);
//           const price = event.tickets[0]?.details.price;
//           const location = event.owner[0]?.organization_name;

//           return (
//             <motion.div
//               key={event._id}
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{
//                 duration: 0.5,
//                 delay: eventsToShow.indexOf(event) * 0.1,
//               }}
//               viewport={{ once: true }}
//             >
//               <div className="border-2 border-transparent rounded-lg overflow-hidden shadow-sm bg-offwhite backdrop-blur-lg hover:shadow-xl transition-all duration-300 flex hover:border-gray-200">
//                 <div className="relative lg:w-1/3 w-2/3 h-51 overflow-hidden">
//                   <Image
//                     src={event.thumbnail}
//                     alt={event.event_name}
//                     className="w-full h-full object-cover p-2 rounded-2xl"
//                     layout="fill"
//                   />
//                   {price && (
//                     <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-lg text-white px-3 py-1 rounded-full text-sm font-semibold">
//                       {price}.00 DT
//                     </div>
//                   )}


//                 </div>
//                 <div className="p-2">

//                 <div className="px-2 ">
//                     <div className="flex items-center gap-1 rounded-md bg-offwhite tracking-wider p-1 w-fit">
//                         <IconBolt size={20} className="text-yellow-500" />
//                         {event.type && (
//                             <div
//                             className={` p-1 rounded-full text-sm font-semibold ${
//                                 event.type === "new"
//                                 ? "text-white"
//                             : event.type === "sponsored"
//                             ? "text-white"
//                             : "text-white"
//                         }`}
//                         >
//                         {event.type.charAt(0).toUpperCase()+ event.type.slice(1).toLowerCase()}
//                         </div>
//                     )}
//                     </div>
//                   </div>
//                 <div className="px-4">
//                   <Link href={`/event-details/${event._id}`}>
//                     <h3 className="text-lg font-semibold text-white my-3 hover:text-main cursor-pointer">
//                       {event.event_name}
//                     </h3>
//                   </Link>

//                   <div className="space-y-2">
//                     <div className="flex items-center text-white-600">
//                       <Calendar className="w-4 h-4 mr-2" />
//                       <span className="text-sm">
//                         {startDate.toLocaleDateString("en-US", {
//                             month: "long",
//                             day: "numeric",
//                             year: "numeric",
//                         })}
//                       </span>
//                     </div>

//                     {location && (
//                       <div className="flex items-center text-white-600">
//                         <MapPin className="w-4 h-4 mr-2" />
//                         <span className="text-sm">{location}</span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="mt-4 flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                       {event.categories?.map((category, idx) => (
//                           <span
//                           key={idx}
//                           className="px-3 py-1 bg-foreground/10 text-foreground rounded-full text-xs font-medium"
//                           >
//                           {category}
//                         </span>
//                       ))}
//                             </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default EventCard;
"use client";
import React, { useState, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconBolt } from "@tabler/icons-react";

interface Event {
  _id: string;
  event_name: string;
  thumbnail: string;
  event_date: string;
  owner: {
    _id: string;
    organization_name: string;
    profile_picture: string;
  }[];
  tickets: {
    _id: string;
    discount: number;
    details: {
      price: number;
      phases: {
        Release: string;
        price: number;
        effective_date: string;
        _id: string;
      }[];
    };
  }[];
  categories?: string[];
  visibility?: string;
  type?: "new" | "sponsored" | "trendy";
}

interface EventCardProps {
  searchQuery: string;
  selectedCategory: string;
  visibleEvents: number;
}

const EventCard: React.FC<EventCardProps> = ({
  searchQuery,
  selectedCategory,
  visibleEvents,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/proxy/api/normalaccount/home");

        if (!response.ok) {
          throw new Error(`Failed to fetch home data: ${response.status}`);
        }

        const data = await response.json();
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

        const eventsArray = Object.values(eventMap);
        setEvents(eventsArray);
        fetchCategoriesForEvents(eventsArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const fetchCategoriesForEvents = async (eventList: Event[]) => {
    const updatedEvents = await Promise.all(
      eventList.map(async (event) => {
        try {
          const categoryRes = await fetch(`/api/proxy/api/event/${event._id}`);
          if (!categoryRes.ok) throw new Error(`Failed to fetch categories for ${event._id}`);
          const categoryData = await categoryRes.json();
          return {
            ...event,
            categories: categoryData?.respond?.data?.categorie?.map((category: any) => category.name) || ["Uncategorized"],
          };
        } catch {
          return { ...event, categories: ["Uncategorized"] };
        }
      })
    );
    setEvents(updatedEvents);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearchQuery = event.event_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? event.categories?.includes(selectedCategory)
      : true;
    return matchesSearchQuery && matchesCategory;
  });

  const eventsToShow = filteredEvents.slice(0, visibleEvents);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-destructive">
        <p className="text-lg font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
        {eventsToShow.map((event) => {
          const startDate = new Date(event.event_date);
          const price = event.tickets[0]?.details.price;
          const location = event.owner[0]?.organization_name;

          return (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: eventsToShow.indexOf(event) * 0.1 }}
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
                      <IconBolt size={16} className="text-yellow-400" />
                      <span className="text-sm font-medium capitalize">
                        {event.type}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <Link href={`/event-details/${event._id}`}>
                    <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary  line-clamp-2 hover:text-main transition-all duration-300">
                      {event.event_name}
                    </h3>
                  </Link>

                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2.5" />
                      <span className="text-sm">
                        {startDate.toLocaleDateString("en-US", {
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
                        className="px-3 py-2 bg-secondary text-secondary-foreground rounded-full text-xs font-medium border border-offwhite"
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
    </div>
  );
};

export default EventCard;

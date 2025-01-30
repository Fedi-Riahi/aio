import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { eventData } from '@/data/data';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconArrowRight } from '@tabler/icons-react';
interface EventCardProps {
  searchQuery: string;
  selectedCategory: string;
  onItemClick: (category: string) => void;
  visibleEvents: number; 
}

const EventCard: React.FC<EventCardProps> = ({
  searchQuery,
  selectedCategory,
  visibleEvents,
}) => {
  const filteredEvents = eventData.filter((event) => {
    const matchesSearchQuery = event.event_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());


    const matchesCategory = selectedCategory
      ? event.categories.includes(selectedCategory) 
      : true;

    return matchesSearchQuery && matchesCategory;
  });


  const eventsToShow = filteredEvents.slice(0, visibleEvents);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-10">
        {eventsToShow.map((event, index) => {
          const startDate = new Date(event.periods[0].start_day);
          const time = event.periods[0].locations[0]?.times[0]?.start_time;
          const price = event.periods[0].locations[0]?.times[0]?.tickets[0]?.price;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className=" border-2 border-transparent rounded-lg overflow-hidden shadow-sm bg-foreground/10 backdrop-blur-sm hover:shadow-xl transition-all duration-300 flex hover:border-gray-200">

                <div className="relative w-1/3 h-48 overflow-hidden">
                  <Image
                    src={event.thumbnail[0]}
                    alt={event.event_name}
                    className="w-full h-full object-cover p-2 rounded-2xl"
                    layout='fill'
                  />
                  {price && (
                    <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded-full text-sm font-semibold">
                      {price}.00 DT
                    </div>
                  )}
                </div>


                <div className="w-2/3 p-4">

                  <Link href={`/event-details/${event.id}`}>
                    <h3 className="text-lg font-semibold text-white mb-3 hover:text-main cursor-pointer">
                      {event.event_name}
                    </h3>
                  </Link>


                  <div className="space-y-2">
                    <div className="flex items-center text-white-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {startDate.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    {time && (
                      <div className="flex items-center text-white-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {new Date(time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}

                    {event.periods[0].locations[0] && (
                      <div className="flex items-center text-white-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {event.periods[0].locations[0].location}
                        </span>
                      </div>
                    )}
                  </div>


                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {event.visibility === "Public" ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {event.visibility}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {event.visibility}
                        </span>
                      )}
                      {event.categories && (
                        <div className="flex gap-2">
                          {event.categories.map((category, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-purple-100 text-main rounded-full text-xs font-medium"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Link href={`/event-details/${event.id}`} className='flex items-center justify-center gap-1 text-main hover:text-main/90'>
                      <button className="text-sm font-medium">
                        View Details
                      </button>
                      <IconArrowRight width={18} height={18} />
                    </Link>
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
import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { eventData } from '@/data/data';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IconBolt  } from '@tabler/icons-react';
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
              <div className=" border-2 border-transparent rounded-lg overflow-hidden shadow-sm bg-foreground/10 backdrop-blur-lg hover:shadow-xl transition-all duration-300 flex hover:border-gray-200">

                <div className="relative w-1/3 h-51 overflow-hidden">
                  <Image
                    src={event.thumbnail[0]}
                    alt={event.event_name}
                    className="w-full h-full object-cover p-2 rounded-2xl"
                    layout='fill'
                  />
                  {price && (
                    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-lg text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {price}.00 DT
                    </div>
                  )}
                </div>


                <div className="w-2/3 p-4">
                <div className='flex items-center gap-1 rounded-md'>
                        <IconBolt size={20} className='text-yellow-500'/>
                        <span className='text-sm'>Instant Reservation</span>
                      </div>
                  <Link href={`/event-details/${event.id}`}>
                    <h3 className="text-lg font-semibold text-white my-3 hover:text-main cursor-pointer">
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
                        <span className="px-3 py-1 bg-green-100 text-green-500  rounded-full text-xs font-medium">
                          {event.visibility}
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-green-100 text-black rounded-full text-xs font-medium">
                          {event.visibility}
                        </span>
                      )}
                      {event.categories && (
                        <div className="flex gap-2">
                          {event.categories.map((category, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-foreground/10 text-foreground rounded-full text-xs font-medium"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                      
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
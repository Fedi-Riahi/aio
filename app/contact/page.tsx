import TheatreView from "../../components/TheatreView"; // Adjust path as needed

export default function TheatrePage({
  searchParams,
}: {
  searchParams: { ticket_index?: string };
}) {
  const order = {
    event_id: { id: "123" },
    period_index: 1,
    location_index: 2,
    time_index: 3,
    ticketDataList: [],
    takenSeats: {},
  };

  return <TheatreView order={order} ticketIndex={searchParams.ticket_index} />;
}
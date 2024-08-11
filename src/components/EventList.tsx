import React from "react";
import { Event } from "../types";
import EventItem from "./EventItem";
import Typography from "./common/Typography";
import useCalendarStore from "@/stores/useCalendarStore";

interface EventListProps {
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  const { selectedDate } = useCalendarStore();
  return (
    <div className="bg-white p-4 shadow-md">
      <div className="mb-4">
        <Typography as="h2">Upcoming Events</Typography>
        <Typography as="p" className="text-neutral-500 font-semibold">
          {selectedDate.format("D MMM")}
        </Typography>
      </div>
      <div className="overflow-y-auto max-h-64">
        {events.length > 0 ? (
          events.map((event) => <EventItem key={event.id} event={event} />)
        ) : (
          <Typography as="span" className="text-neutral-500 text-sm">
            No upcoming events
          </Typography>
        )}
      </div>
    </div>
  );
};

export default EventList;

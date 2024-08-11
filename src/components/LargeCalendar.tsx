import React, { useState } from "react";
import { Calendar, Badge, Button } from "antd";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Event, EventType } from "../types";
import useCalendarStore from "@/stores/useCalendarStore";
import EventModal from "./CreateEventModal";
import { cn } from "@/utils";
import Typography from "./common/Typography";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(advancedFormat);

interface LargeCalendarProps {
  selectedDate: dayjs.Dayjs;
  onSelectDate: (date: dayjs.Dayjs) => void;
  events: Event[];
}

const LargeCalendar: React.FC<LargeCalendarProps> = ({
  selectedDate,
  onSelectDate,
  events,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const { setSelectedEvent, selectedEvent } = useCalendarStore();

  const dateCellRender = (date: dayjs.Dayjs) => {
    const dayEvents = events.filter((event) =>
      dayjs(event.startTime).isSame(date, "day")
    );
    // const hasEvents = dayEvents.length > 0;

    return (
      <div
        className={cn(
          "flex flex-col w-full h-32 items-center text-xs border-[1.5px]",
          date.isSame(selectedDate, "day") ? "text-white bg-calendar-tile" : ""
        )}
      >
        <Typography
          className={cn(
            "rounded-full mt-2 flex items-center justify-center",
            date.isSame(selectedDate, "day") ? "bg-calendar-tile" : ""
          )}
        >
          {date.date()}
        </Typography>
        <div className="flex w-full flex-col gap-2 overflow-auto !overflow-x-hidden">
          {dayEvents.map((event) => (
            <div
              className={cn(
                "relative rounded-md bg-light-blue w-full py-1 hover:opacity-70",
                event.type === EventType.WEBINAR ? "bg-dark-orange" : ""
              )}
              onClick={() => handleEventClick(event)}
            >
              <div
                className={cn(
                  "w-1 h-full absolute rounded-l-md z-10 bg-dark-orange top-0 left-0",
                  event.type === EventType.WEBINAR ? "bg-light-blue" : ""
                )}
              />
              <Typography
                as="p"
                className={cn(
                  "text-start pl-4 text-nowrap",
                  event.type === EventType.WEBINAR
                    ? "text-light-blue"
                    : "text-light-orange"
                )}
              >
                {event.title}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const fullRenderCell = (current: dayjs.Dayjs, info: { type: string }) => {
    if (info.type === "date") {
      return dateCellRender(current);
    }
    return null;
  };

  const handleEventClick = (event: Event) => {
    if (!event) return;
    setModalMode("edit");
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCreateEvent = () => {
    setModalMode("create");
    setIsModalOpen(true);
  };

  return (
    <>
      {/* <Button onClick={handleCreateEvent}>Create Event</Button> */}
      {/* <div className="w-full h-full flex justify-center"> */}
      <Calendar
        value={selectedDate}
        onSelect={(date) => {
          onSelectDate(date);
          if (
            events.some((event) => dayjs(event.startTime).isSame(date, "day"))
          ) {
            return;
          }
          setSelectedEvent(null);
          setModalMode("create");
          setIsModalOpen(true);
        }}
        cellRender={dateCellRender}
        fullCellRender={fullRenderCell}
        // className="bg-white shadow-md w-5/6"
      />
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        selectedDate={selectedDate}
      />
    </>
  );
};

export default LargeCalendar;

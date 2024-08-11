import React, { useState } from "react";
import { Calendar, Badge, Button, Select } from "antd";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Event, EventType, RecurrenceType } from "../types";
import useCalendarStore from "@/stores/useCalendarStore";
import EventModal from "./CreateEventModal";
import { cn } from "@/utils";
import Typography from "./common/Typography";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const { setSelectedEvent } = useCalendarStore();

  const headerRender = ({ value, type, onChange, onTypeChange }: any) => {
    const current = value.clone();
    const handleMonthChange = (newMonth: number) => {
      const newDate = current.month(newMonth);
      onChange(newDate);
    };

    return (
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <button
            className="px-4 py-2 text-dark-blue text-base border-2 border-dark-blue !rounded-2xl hover:bg-blue-50"
            onClick={() => onChange(dayjs())}
          >
            Today
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onChange(current.subtract(1, "month"))}
              className="text-dark-blue"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => onChange(current.add(1, "month"))}
              className="text-dark-blue"
            >
              <ChevronRight />
            </button>
          </div>
          <Typography as="h2" className="font-bold">
            {current.format("MMMM YYYY")}
          </Typography>
        </div>
        <Select value={type} onChange={(newType) => onTypeChange(newType)}>
          <Select.Option value="month">Month</Select.Option>
          <Select.Option value="year">Year</Select.Option>
        </Select>
      </div>
    );
  };

  const dateCellRender = (date: dayjs.Dayjs) => {
    const dayEvents = events.filter((event) => {
      if (dayjs(event.startTime).isSame(date, "day")) {
        return true;
      }

      if (event.recurrence) {
        const startDate = dayjs(event.startTime);
        const endDate = event.recurrence.endDate
          ? dayjs(event.recurrence.endDate)
          : null;

        if (endDate && date.isAfter(endDate)) {
          return false;
        }

        switch (event.recurrence.type) {
          case RecurrenceType.DAILY:
            return (
              date.diff(startDate, "day") % event.recurrence.interval === 0
            );
          case RecurrenceType.WEEKLY:
            return (
              date.diff(startDate, "week") % event.recurrence.interval === 0 &&
              (event.recurrence.daysOfWeek?.includes(date.day()) ||
                date.day() === startDate.day())
            );
          case RecurrenceType.MONTHLY:
            return (
              date.diff(startDate, "month") % event.recurrence.interval === 0 &&
              date.date() === startDate.date()
            );
          case RecurrenceType.YEARLY:
            return (
              date.diff(startDate, "year") % event.recurrence.interval === 0 &&
              date.month() === startDate.month() &&
              date.date() === startDate.date()
            );
          default:
            return false;
        }
      }

      return false;
    });

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
              key={event.id}
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

  return (
    <>
      <Calendar
        value={selectedDate}
        onSelect={(date) => {
          onSelectDate(date);
          if (
            date.month() !== selectedDate.month() ||
            date.year() !== selectedDate.year()
          )
            return;

          if (
            events.find(
              (event) =>
                !!event.id && dayjs(event.startTime).isSame(date, "day")
            )
          ) {
            return;
          }
          setSelectedEvent(null);
          setModalMode("create");
          setIsModalOpen(true);
        }}
        cellRender={dateCellRender}
        fullCellRender={fullRenderCell}
        headerRender={headerRender}
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

import React from "react";
import { Calendar } from "antd";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { Event } from "../types";
import { cn } from "@/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(advancedFormat);

interface SmallCalendarProps {
  selectedDate: dayjs.Dayjs;
  onSelectDate: (date: dayjs.Dayjs) => void;
  events: Event[];
}

const SmallCalendar: React.FC<SmallCalendarProps> = ({
  selectedDate,
  onSelectDate,
  events,
}) => {
  const fullCellRender = (current: dayjs.Dayjs, info: { type: string }) => {
    if (info.type === "date") {
      return renderDateCell(current);
    }
    if (info.type === "month") {
      return renderMonthCell(current);
    }
    return null;
  };

  const renderDateCell = (date: dayjs.Dayjs) => {
    const dayEvents = events.filter((event) =>
      dayjs(event.startTime).isSame(date, "day")
    );
    const hasEvents = dayEvents.length > 0;

    return (
      <div
        className={cn(
          "flex flex-col h-full items-center justify-center text-sm aspect-square hover:bg-neutral-200 hover:rounded-full mx-1",
          hasEvents ? "bg-light-orange rounded-full" : "",
          date.isSame(selectedDate, "day")
            ? "text-white bg-light-blue rounded-full"
            : ""
        )}
      >
        {date.date()}
      </div>
    );
  };

  const renderMonthCell = (date: dayjs.Dayjs) => {
    const monthEvents = events.filter((event) =>
      dayjs(event.startTime).isSame(date, "month")
    );
    const hasEvents = monthEvents.length > 0;

    return (
      <div
        className={cn("flex flex-col h-full", hasEvents ? "bg-blue-50" : "")}
      >
        <div className="flex-1 p-2 flex flex-col justify-center items-center">
          <span className="text-lg font-bold">{date.format("MMM")}</span>
          {hasEvents && (
            <span className="text-xs text-gray-500 mt-1">
              {monthEvents.length} event{monthEvents.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Calendar
      className="[&_.ant-picker-calendar-date]:h-full px-8 py-2 rounded-none border-b-2"
      value={selectedDate}
      onSelect={onSelectDate}
      fullCellRender={fullCellRender}
      fullscreen={false}
      headerRender={({ value, type, onChange }) => (
        <div className="flex justify-between items-center px-4 py-2 text-dark-blue">
          <button onClick={() => onChange(value.clone().subtract(1, type))}>
            <ChevronLeft />
          </button>
          <span className="text-lg font-semibold">
            {value.format(type === "month" ? "MMM YYYY" : "YYYY")}
          </span>
          <button onClick={() => onChange(value.clone().add(1, type))}>
            <ChevronRight />
          </button>
        </div>
      )}
    />
  );
};

export default SmallCalendar;

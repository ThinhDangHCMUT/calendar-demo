import React from "react";
import dayjs from "dayjs";
import { Event, EventType } from "../types";
import Typography from "./common/Typography";
import Link from "next/link";
import { Image } from "antd";
import { cn } from "@/utils";
import { VideoIcon } from "lucide-react";

interface EventItemProps {
  event: Event;
}

const EventItem: React.FC<EventItemProps> = ({ event }) => {
  const isClientInfo = !!event.clientInfo?.name;

  return (
    <div
      className={cn(
        "bg-light-blue w-full relative rounded-xl flex flex-row gap-1 mb-4 p-4 pl-6",
        event.type === EventType.WEBINAR ? "bg-light-orange" : ""
      )}
    >
      <div className="flex flex-col w-full gap-1">
        <div
          className={cn(
            "h-full w-2 absolute left-0 top-0 rounded-l-xl",
            event.type === EventType.APPOINTMENT
              ? "bg-dark-orange"
              : "bg-light-blue"
          )}
        />
        <Typography
          as="h4"
          className={cn(
            "text-light-orange capitalize font-semibold",
            event.type === EventType.WEBINAR ? "text-light-blue" : ""
          )}
        >
          {event.title}
        </Typography>
        <Typography
          as="span"
          className={cn(
            "text-light-blue",
            event.type === EventType.APPOINTMENT ? "text-light-orange" : ""
          )}
        >
          {`${dayjs(event.startTime).format("HH:mm")} - ${dayjs(
            event.endTime
          ).format("HH:mm")} GMT+8`}
        </Typography>
        {isClientInfo && (
          <div className="flex items-center gap-2">
            <Image
              src={event.clientInfo?.avatar}
              alt={event.clientInfo?.name}
              preview={false}
              className="rounded-full"
              width={24}
              height={24}
            />
            <Link href={event.clientInfo?.profileUrl!}>
              <Typography
                as="span"
                className={cn(
                  "text-md underline text-light-blue",
                  event.type === EventType.APPOINTMENT
                    ? "text-light-orange"
                    : ""
                )}
              >
                {event.clientInfo?.name}
              </Typography>
            </Link>
          </div>
        )}
      </div>
      {event.type === EventType.APPOINTMENT && (
        <div className="bg-light-orange h-fit p-2 rounded-full">
          <VideoIcon className="text-light-blue" />
        </div>
      )}
    </div>
  );
};

export default EventItem;

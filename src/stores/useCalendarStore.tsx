import { create } from "zustand";
import { produce } from "immer";
import { Event, EventType, RecurrenceType } from "../types";
import dayjs from "dayjs";

interface CreateEventForm {
  title: string;
  startTime: string;
  endTime: string;
  type: EventType;
  clientInfo?: {
    name: string;
    profileUrl: string;
  };
  description?: string;
  recurrence?: {
    type: RecurrenceType;
    interval: number;
    endDate?: string;
    daysOfWeek?: number[];
  };
}

interface CalendarState {
  events: Event[];
  selectedDate: dayjs.Dayjs;
  selectedEvent: Event | null;
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  createEventForm: CreateEventForm;
  createEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: string) => void;
  setSelectedDate: (date: dayjs.Dayjs) => void;
  setSelectedEvent: (event: Event | null) => void;
}

const initialCreateEventForm: CreateEventForm = {
  title: "",
  startTime: "",
  endTime: "",
  type: EventType.APPOINTMENT,
  description: "",
};

const eventsMockData: Event[] = [
  {
    id: "1",
    title: "Meeting with John",
    startTime: dayjs().startOf("day").add(10, "hour").toISOString(),
    endTime: dayjs().startOf("day").add(11, "hour").toISOString(),
    type: EventType.APPOINTMENT,
    clientInfo: {
      name: "John Doe",
      avatar:
        "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
      profileUrl:
        "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
    },
  },
  {
    id: "2",
    title: "Webinar",
    startTime: dayjs().startOf("day").add(13, "hour").toISOString(),
    endTime: dayjs().startOf("day").add(14, "hour").toISOString(),
    type: EventType.WEBINAR,
  },
  {
    id: "3",
    title: "Meeting with Jane",
    startTime: dayjs().startOf("day").add(15, "hour").toISOString(),
    endTime: dayjs().startOf("day").add(16, "hour").toISOString(),
    type: EventType.APPOINTMENT,
    clientInfo: {
      name: "Jane Doe",
      avatar: "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk",
      profileUrl: "https://i.pravatar.cc/250?u=mail@ashallendesign.co.uk",
    },
  },
];

const useCalendarStore = create<CalendarState>()((set) => ({
  events: eventsMockData,
  selectedDate: dayjs(),
  selectedEvent: null,
  isCreateModalOpen: false,
  isEditModalOpen: false,
  createEventForm: initialCreateEventForm,
  createEvent: (event) =>
    set(
      produce((state) => {
        state.events.push(event);
      })
    ),
  updateEvent: (event) =>
    set(
      produce((state) => {
        const index = state.events.findIndex((e: Event) => e.id === event.id);
        if (index !== -1) {
          state.events[index] = event;
        }
      })
    ),
  deleteEvent: (eventId) =>
    set(
      produce((state) => {
        state.events = state.events.filter(
          (event: Event) => event.id !== eventId
        );
      })
    ),
  setSelectedDate: (date) =>
    set(
      produce((state) => {
        state.selectedDate = date;
      })
    ),
  setSelectedEvent: (event) =>
    set(
      produce((state) => {
        state.selectedEvent = event;
      })
    ),
}));

export default useCalendarStore;

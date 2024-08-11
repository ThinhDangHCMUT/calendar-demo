export enum RecurrenceType {
  NONE = "none",
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export enum EventType {
  APPOINTMENT = "appointment",
  WEBINAR = "webinar",
}

export interface RecurrenceRule {
  type: RecurrenceType;
  interval: number;
  endDate?: string;
  daysOfWeek?: number[];
}

export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: EventType;
  clientInfo?: {
    name: string;
    avatar: string;
    profileUrl: string;
  };
  description?: string;
  recurrence?: RecurrenceRule;
}

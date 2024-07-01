import { EventInput } from "@fullcalendar/core";
import { EventImpl } from "@fullcalendar/core/internal";
import { v4 as uuidv4 } from "uuid";

const todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

export interface CalendarEventType {
    id?:                string,
    title?:             string,
    attendeeStatus?:    {
                            [key: string]: boolean,
                        },
    startTime?:         Date,
    endTime?:           Date,
    allDay?:            boolean,
    description?:       string
}

export const createEventId = (): string => {
    return uuidv4();
};

export const INITIAL_EVENTS: EventInput[] = [
    {
        id: createEventId(),
        title: "All-day event",
        start: todayStr,
    },
    {
        id: createEventId(),
        title: "Timed event",
        start: todayStr + "T12:00:00",
    },
];

export const formatToCalendarInput = (inputEvent: CalendarEventType): EventInput => {
    return {
        id: inputEvent.id || createEventId(),
        title: inputEvent.title || "Untitled Event",
        allDay: inputEvent.allDay || false,
        start: inputEvent.startTime instanceof Date ? inputEvent.startTime : new Date(inputEvent.startTime || Date.now()),
        end: inputEvent.endTime instanceof Date ? inputEvent.endTime : new Date(inputEvent.endTime || (Date.now()+30*60*1000)),
        extendedProps: {
            attendees: inputEvent.attendeeStatus,
            description: inputEvent.description,
        },
    }
}

export const formatToCalendarEventType = (inputEvent: EventInput | EventImpl): CalendarEventType => {
    const extendedProps = inputEvent.extendedProps
    return {
        id: inputEvent.id,
        title: inputEvent.title,
        attendeeStatus: extendedProps?.attendees,
        startTime: inputEvent.start,
        endTime: inputEvent.end,
        allDay: inputEvent.allDay,
        description: extendedProps?.description
    }
}

export const getNearestHalfPeriod = (date:Date|string|number): Date => {
    const formattedDate = typeof date === "string" || typeof date === "number" ?
        new Date(date) : date
    if (0 <= formattedDate.getMinutes() && formattedDate.getMinutes() <= 30) {
        formattedDate.setMinutes(30)
    } else {
        formattedDate.setHours((formattedDate.getHours() + 1)%24, 0)
    }
    return formattedDate
}

import { EventInput } from "@fullcalendar/core";
import { EventImpl } from "@fullcalendar/core/internal";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { v4 as uuidv4 } from "uuid";

const todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

const parseDate = (dateString: string): Date => {
    const dateParts = dateString.match(/(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);

    if (dateParts) {
        const year = parseInt(dateParts[1], 10);
        const month = parseInt(dateParts[2], 10) - 1;
        const day = parseInt(dateParts[3], 10);
        const hours = parseInt(dateParts[4], 10);
        const minutes = parseInt(dateParts[5], 10);
        const seconds = parseInt(dateParts[6], 10);

        return new Date(year, month, day, hours, minutes, seconds);
    } else {
        throw new Error("Invalid date format");
    }
};

export interface CalendarEventType {
    id?: string;
    title?: string;
    attendeeStatus?: {
        [key: string]: boolean;
    };
    startTime?: Date;
    endTime?: Date;
    allDay?: boolean;
    description?: string;
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
        start:
            inputEvent.startTime instanceof Date ? inputEvent.startTime : new Date(inputEvent.startTime || Date.now()),
        end:
            inputEvent.endTime instanceof Date
                ? inputEvent.endTime
                : new Date(inputEvent.endTime || Date.now() + 30 * 60 * 1000),
        extendedProps: {
            attendees: inputEvent.attendeeStatus,
            description: inputEvent.description,
        },
    };
};

export const formatToCalendarEventType = (inputEvent: EventInput | EventImpl): CalendarEventType => {
    const extendedProps = inputEvent.extendedProps;
    return {
        id: inputEvent.id,
        title: inputEvent.title,
        attendeeStatus: extendedProps?.attendees,
        startTime: inputEvent.start,
        endTime: inputEvent.end,
        allDay: inputEvent.allDay,
        description: extendedProps?.description,
    };
};

export const getNearestHalfPeriod = (date: Date | string | number): Date => {
    const formattedDate = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
    if (0 <= formattedDate.getMinutes() && formattedDate.getMinutes() <= 30) {
        formattedDate.setMinutes(30);
    } else {
        formattedDate.setHours((formattedDate.getHours() + 1) % 24, 0);
    }
    return formattedDate;
};

export const getEvent = (currentUserId: string): Promise<CalendarEventType[]> => {
    const url = SettingsStore.getValue("reportsApiUrl");
    return fetch(url + "/api/calendar_task/get_task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: currentUserId,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            return data.data.map(
                (item: {
                    id: string;
                    title: string;
                    attendees: {
                        [key: string]: boolean;
                    };
                    start_time: string;
                    end_time: string;
                    allday: boolean;
                    description: string;
                }) => {
                    return {
                        id: item.id,
                        title: item.title,
                        attendeeStatus: item.attendees,
                        startTime: parseDate(item.start_time),
                        endTime: parseDate(item.end_time),
                        allDay: item.allday,
                        description: item.description,
                    };
                },
            );
        })
        .catch((error) => {
            console.error("Error saving event:", error);
        });
};

export const saveEvent = (event: EventInput, currentUserId: string): void => {
    const url = SettingsStore.getValue("reportsApiUrl");
    const formattedBody = formatToCalendarEventType(event);
    fetch(url + "/api/calendar_task/set_task", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: formattedBody.id,
            user_id: currentUserId,
            title: formattedBody.title,
            attendeeStatus: formattedBody.attendeeStatus,
            startTime: Math.floor(formattedBody.startTime?.valueOf() / 1000),
            endTime: Math.floor(formattedBody.endTime?.valueOf() / 1000),
            allDay: formattedBody.allDay,
            description: formattedBody.description,
            location: null,
        }),
    });
    // .then((response) => response.json())
    // .then((data) => {
    //     if (data.success) {
    //         console.log("Event saved");
    //     }
    // })
    // .catch((error) => {
    //     console.error("Error saving event:", error);
    // });
};

export const deleteEvent = (event: EventInput): void => {
    const url = SettingsStore.getValue("reportsApiUrl");
    fetch(url + "/api/calendar_task/delete-event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: event.id,
        }),
    });
    // .then((response) => response.json())
    // .then((data) => {
    //     if (data.success) {
    //         console.log("Event deleted");
    //     }
    // })
    // .catch((error) => {
    //     console.error("Error deleting event:", error);
    // });
};

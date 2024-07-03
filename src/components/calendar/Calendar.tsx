import React, { useEffect, useRef, useState } from "react";
import { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate, CalendarApi } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
    CalendarEventType,
    getNearestHalfPeriod,
    deleteEvent,
    formatToCalendarEventType,
    formatToCalendarInput,
    getEvent,
    saveEvent,
} from "./event-utils";
import { EventDialog } from "./EventDialog";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

interface CalendarAppState {
    weekendsVisible: boolean;
    currentEvents: EventApi[];
}

const Calendar = (): React.JSX.Element => {
    const client = useMatrixClientContext();
    const [calState, setCalState] = useState<CalendarAppState>({
        weekendsVisible: true,
        currentEvents: [],
    });
    const [selectedEventInfo, setSelectedEventInfo] = useState<CalendarEventType>({});
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const calendarRef = useRef(null);

    const updateCalendarViewCallback = (eventInfo: CalendarEventType): void => {
        const calendarApi = calendarRef.current.getApi();
        const currCalendarEvent = eventInfo.id && calendarApi.getEventById(eventInfo.id);
        if (currCalendarEvent) {
            currCalendarEvent.remove();
        }
        const formattedEvent = formatToCalendarInput(eventInfo);
        calendarApi.addEvent(formattedEvent);
    };

    const handleWeekendsToggle = (): void => {
        setCalState((prevState) => ({
            ...prevState,
            weekendsVisible: !calState.weekendsVisible,
        }));
    };

    const handleDateSelect = (selectInfo: DateSelectArg): void => {
        const calendarApi = calendarRef.current.getApi();
        const startTime = selectInfo.start;
        const endTime = selectInfo.end;
        const currentTime = new Date();
        if (endTime.valueOf() - startTime.valueOf() === 86400000) {
            startTime.setHours(currentTime.getHours());
            startTime.setMinutes(currentTime.getMinutes());
            endTime.setDate(startTime.getDate());
            endTime.setMonth(startTime.getMonth());
            endTime.setFullYear(startTime.getFullYear());
            endTime.setHours(new Date(currentTime.valueOf() + 30 * 60 * 1000).getHours());
            endTime.setMinutes(new Date(currentTime.valueOf() + 30 * 60 * 1000).getMinutes());
        } else {
            startTime.setHours(currentTime.getHours());
            startTime.setMinutes(currentTime.getMinutes());
            endTime.setHours(currentTime.getHours());
            endTime.setMinutes(currentTime.getMinutes());
        }
        const newEvent: CalendarEventType = {
            startTime: getNearestHalfPeriod(startTime),
            endTime: getNearestHalfPeriod(endTime),
        };
        setSelectedEventInfo(newEvent);
        calendarApi.unselect();
        setDialogOpen(true);
    };

    const handleEventClick = (clickInfo: EventClickArg): void => {
        const calendarApi = calendarRef.current.getApi();
        setSelectedEventInfo(formatToCalendarEventType(clickInfo.event));
        calendarApi.unselect();
        setDialogOpen(true);
    };

    const handleEvents = (events: EventApi[]): void => {
        setCalState((prevState) => ({
            ...prevState,
            currentEvents: events,
        }));
    };

    const updateEventCallback = (info: any): void => {
        const userId = client.getUserId();
        saveEvent(info.event, userId);
    };

    const removeEventCallback = (info: any): void => {
        deleteEvent(info.event);
    };

    useEffect(() => {
        const userId = client.getUserId();
        const calendarApi = calendarRef.current.getApi();
        getEvent(userId).then((res) => {
            res.forEach((item) => {
                calendarApi.addEvent(formatToCalendarInput(item));
            });
        });
    }, []);

    return (
        <div className="flex h-full font-sans text-sm">
            {/* {this.renderSidebar()} */}
            <EventDialog
                trigger={<></>}
                eventInfo={selectedEventInfo}
                open={dialogOpen}
                setOpen={setDialogOpen}
                saveCallback={updateCalendarViewCallback}
            />
            <div className="grow p-3">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay",
                    }}
                    buttonText={{
                        today: "Today",
                        dayGridMonth: "Month",
                        timeGridWeek: "Week",
                        timeGridDay: "Day",
                    }}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={calState.weekendsVisible}
                    // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
                    select={handleDateSelect}
                    eventContent={renderEventContent} // custom render function
                    eventClick={handleEventClick}
                    eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                    height="100%"
                    eventAdd={updateEventCallback}
                    eventChange={updateEventCallback}
                    eventRemove={removeEventCallback}
                />
            </div>
        </div>
    );
};

const renderEventContent = (eventContent: EventContentArg): React.JSX.Element => {
    return (
        <>
            <b>{eventContent.timeText}</b>
            <i>{eventContent.event.title}</i>
        </>
    );
};

export default Calendar;

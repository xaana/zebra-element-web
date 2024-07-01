import React, {useRef, useState} from "react";
import { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate, CalendarApi } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { CalendarEventType, INITIAL_EVENTS, createEventId, formatToCalendarEventType, formatToCalendarInput } from "./event-utils";
import { EventDialog } from "./EventDialog";

interface CalendarAppState {
    weekendsVisible: boolean;
    currentEvents: EventApi[];
}

const Calendar = (): React.JSX.Element => {
    const [calState, setCalState] = useState<CalendarAppState>({
        weekendsVisible: true,
        currentEvents: [],
    });
    const [selectedEventInfo, setSelectedEventInfo] = useState<CalendarEventType>({});
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const calendarRef = useRef(null);

    const updateCalendarViewCallback = (
        eventInfo: CalendarEventType,
    ):void => {
        const calendarApi = calendarRef.current.getApi();
        const currCalendarEvent = eventInfo.id && calendarApi.getEventById(eventInfo.id);
        if (currCalendarEvent) {
            currCalendarEvent.remove();
        }
        const formattedEvent = formatToCalendarInput(eventInfo)
        calendarApi.addEvent(formattedEvent);
    }

    const handleWeekendsToggle = (): void => {
        setCalState(prevState => ({
            ...prevState,
            weekendsVisible: !calState.weekendsVisible,
        }));
    };

    const handleDateSelect = (selectInfo: DateSelectArg): void => {
        const calendarApi = calendarRef.current.getApi();
        const newEvent: CalendarEventType = {
            startTime: selectInfo.start,
            endTime: selectInfo.end,
        }
        setSelectedEventInfo(newEvent);
        calendarApi.unselect();
        setDialogOpen(true);
    }

    const handleEventClick = (clickInfo: EventClickArg): void => {
        const calendarApi = calendarRef.current.getApi();
        // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        //     clickInfo.event.remove();
        // }
        setSelectedEventInfo(formatToCalendarEventType(clickInfo.event));
        calendarApi.unselect();
        setDialogOpen(true);
    };

    const handleEvents = (events: EventApi[]):void => {
        setCalState(prevState => ({
            ...prevState,
            currentEvents: events,
        }));
    };

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
                        timeGridDay: "Day"
                    }}
                    initialView="dayGridMonth"
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={calState.weekendsVisible}
                    initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
                    select={handleDateSelect}
                    eventContent={renderEventContent} // custom render function
                    eventClick={handleEventClick}
                    eventsSet={handleEvents} // called after events are initialized/added/changed/removed
                    height="100%"
                    /* you can update a remote database when these fire:
                    eventAdd={function(){}}
                    eventChange={function(){}}
                    eventRemove={function(){}}
                    */
                />
            </div>
        </div>
    );

    // renderSidebar() {
    //     return (
    //         <div className="demo-app-sidebar">
    //             <div className="demo-app-sidebar-section">
    //                 <h2>Instructions</h2>
    //                 <ul>
    //                     <li>Select dates and you will be prompted to create a new event</li>
    //                     <li>Drag, drop, and resize events</li>
    //                     <li>Click an event to delete it</li>
    //                 </ul>
    //             </div>
    //             <div className="demo-app-sidebar-section">
    //                 <label>
    //                     <input
    //                         type="checkbox"
    //                         checked={this.state.weekendsVisible}
    //                         onChange={this.handleWeekendsToggle}
    //                     ></input>
    //                     toggle weekends
    //                 </label>
    //             </div>
    //             <div className="demo-app-sidebar-section">
    //                 <h2>All Events ({this.state.currentEvents.length})</h2>
    //                 <ul>{this.state.currentEvents.map(renderSidebarEvent)}</ul>
    //             </div>
    //         </div>
    //     );
    // }
};

const renderEventContent = (eventContent: EventContentArg): React.JSX.Element => {
    return (
        <>
            <b>{eventContent.timeText}</b>
            <i>{eventContent.event.title}</i>
        </>
    );
}

// const renderSidebarEvent = (event: EventApi): React.JSX.Element => {
//     return (
//         <li key={event.id}>
//             <b>{formatDate(event.start!, { year: "numeric", month: "short", day: "numeric" })}</b>
//             <i>{event.title}</i>
//         </li>
//     );
// }

export default Calendar;

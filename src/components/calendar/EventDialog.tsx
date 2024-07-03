import React, { useEffect } from "react";
import { Pencil, UserRoundPlus, Text, Clock, MoveRight } from "lucide-react";

import { CalendarEventType, createEventId, getNearestHalfPeriod } from "./event-utils";
import { Textarea } from "../ui/TextareaAlt";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

export const EventDialog = ({
    trigger,
    eventInfo,
    open,
    setOpen,
    saveCallback,
}: {
    trigger?: React.JSX.Element;
    eventInfo?: CalendarEventType;
    open?: boolean;
    setOpen?: (open: boolean) => void;
    saveCallback?: (event: CalendarEventType) => void;
}): React.JSX.Element => {
    const eventId = eventInfo?.id || createEventId();
    const [title, setTitle] = React.useState<string>(eventInfo?.title || "");
    const [startTime, setStartTime] = React.useState<Date>(eventInfo?.startTime || getNearestHalfPeriod(Date.now()));
    const [endTime, setEndTime] = React.useState<Date>(
        eventInfo?.endTime || getNearestHalfPeriod(Date.now() + 30 * 60 * 1000),
    );
    const [attendees, setAttendees] = React.useState<{
        [key: string]: boolean;
    }>(eventInfo?.attendeeStatus || {});
    const [allDayEvent, setAllDayEvent] = React.useState<boolean>(eventInfo?.allDay || false);
    const [description, setDescription] = React.useState<string>(eventInfo?.description || "");

    const matrixClient = useMatrixClientContext();

    useEffect(() => {
        if (eventInfo) {
            setTitle(eventInfo?.title || ""),
                setStartTime(eventInfo?.startTime || getNearestHalfPeriod(eventInfo?.startTime || Date.now()));
            setEndTime(eventInfo?.endTime || getNearestHalfPeriod(eventInfo?.endTime || Date.now() + 30 * 60 * 1000));
            setAttendees(eventInfo?.attendeeStatus || {});
            setAllDayEvent(eventInfo?.allDay || false);
            setDescription(eventInfo?.description || "");
        }
    }, [eventInfo]);

    const handleSaveClick = (): void => {
        saveCallback &&
            saveCallback({
                id: eventId,
                title: title,
                attendeeStatus: attendees,
                startTime: startTime,
                endTime: endTime,
                allDay: allDayEvent,
                description: description,
            });
    };

    const handleRemoveClick = (): void => {};

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {(open !== undefined && setOpen !== undefined && trigger) || (
                <DialogTrigger asChild>
                    <Button variant="outline">Share</Button>
                </DialogTrigger>
            )}
            <DialogContent className="overflow-hidden" style={{ gap: 0, width: 1100, height: "80%" }}>
                <DialogHeader>
                    <DialogTitle>{eventInfo ? "Edit Event" : "New Event"}</DialogTitle>
                    <DialogDescription>Edit the event</DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <Pencil />
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="title" className="sr-only">
                            Title
                        </Label>
                        <Input
                            id="title"
                            placeholder="Add title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <UserRoundPlus />
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="attendees" className="sr-only">
                            Attendees
                        </Label>
                        <Input
                            id="attendees"
                            placeholder="Add required attendees, split by ','"
                            value={Object.keys(attendees).join(",")}
                            onChange={(e) => {
                                const allAttendees = e.target.value.split(",");
                                const attendeeStatus: { [key: string]: boolean } = {};
                                allAttendees.forEach((item) => {
                                    attendeeStatus[item] = item === matrixClient.getUserId();
                                });
                                setAttendees(attendeeStatus);
                            }}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Clock />
                    <div className="flex flex-1 gap-2">
                        <Label htmlFor="startTime" className="sr-only">
                            Start Time
                        </Label>
                        <Input
                            type="datetime-local"
                            className="w-1/4"
                            id="startTime"
                            value={startTime
                                .toLocaleString("sv", { timeZoneName: "short" })
                                .slice(0, 16)
                                .replace(" ", "T")}
                            step={1800}
                            onChange={(e) => {
                                setStartTime(new Date(e.target.value));
                            }}
                        />
                        <MoveRight />
                        <Label htmlFor="endTime" className="sr-only">
                            End Time
                        </Label>
                        <Input
                            type="datetime-local"
                            className="w-1/4"
                            id="endTime"
                            min={startTime
                                .toLocaleString("sv", { timeZoneName: "short" })
                                .slice(0, 16)
                                .replace(" ", "T")}
                            value={endTime
                                .toLocaleString("sv", { timeZoneName: "short" })
                                .slice(0, 16)
                                .replace(" ", "T")}
                            step={1800}
                            onChange={(e) => {
                                setEndTime(new Date(e.target.value));
                            }}
                        />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Text />
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="description" className="sr-only">
                            {description || "Description"}
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Add Description"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                        />
                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={handleRemoveClick}>
                            Remove
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={handleSaveClick}>
                            Save
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

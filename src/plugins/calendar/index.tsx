import { Plugin } from "../plugin";
import { MainPanel } from "./MainPanel";

import { IconCalendar } from "@/components/ui/icons";

export const CalendarPlugin: Plugin = {
    name: "calendar",
    label: "Calendar",
    Icon: IconCalendar,
    MainPanel: MainPanel,
};

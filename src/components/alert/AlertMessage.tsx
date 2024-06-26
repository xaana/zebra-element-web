import React from "react";
import SpaceStore from "matrix-react-sdk/src/stores/spaces/SpaceStore";
import defaultDispatcher from "matrix-react-sdk/src/dispatcher/dispatcher";

import { Card, CardContent, CardHeader } from "../ui/card";
import { generateAlertBody, generateAlertFromCols } from "./AlertHelper";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import { PluginActions } from "../../plugins";

import { init } from "@/vector/routing";

const BUTTON_STYLE =
    "bg-gray-300 hover:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center h-8 my-1 w-full";

export const AlertMessagePanel = (props: any): React.JSX.Element => {
    const { content } = props;
    const alertBody = generateAlertBody(content);

    React.useEffect(() => {
        init();
    }, []);

    const buttonClickHandler = (uri: string): void => {
        localStorage.setItem("pluginUri", uri);
        window.location.hash = "/plugins/algology";
        window.matrixChat.setState({ activePluginName: "algology" });
        SpaceStore.instance.setActiveSpace("plugin.algology");
        defaultDispatcher.dispatch({ action: PluginActions.LoadPlugin, plugin: "algology" });
    };

    return (
        <Card className="w-[600px]">
            <CardHeader>{content.status !== "firing" ? `🔔${content.title}` : `❗️${content.title}`}</CardHeader>
            <CardContent className="p-2 pt-3">
                {alertBody.length >= 1 && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[16px]">No.</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead className="w-[72px]">Options</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {alertBody.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index}</TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>
                                        {typeof item.value === "object"
                                            ? Object.entries(item.value).map(([key, value]) => {
                                                  return (
                                                      <p>
                                                          {key} : {value}
                                                      </p>
                                                  );
                                              })
                                            : item.value.length > 40
                                              ? item.value.substring(0, 37) + "..."
                                              : item.value}
                                    </TableCell>
                                    <TableCell>
                                        {item.panelURL ? (
                                            <Button
                                                className={BUTTON_STYLE}
                                                onClick={() => buttonClickHandler(item.panelURL)}
                                            >
                                                View Panel
                                            </Button>
                                        ) : null}
                                        {item.dashboardURL ? (
                                            <Button
                                                className={BUTTON_STYLE}
                                                onClick={() => buttonClickHandler(item.dashboardURL)}
                                            >
                                                View Dashboard
                                            </Button>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};

export const AlertMessageWithColsPanel = (props: {
    data: { [key: string]: any }[];
    targetCols: string[];
    status?: "alert" | "resolved" | undefined;
}): React.JSX.Element => {
    const formatedData = generateAlertFromCols(props.data, props.targetCols)
    return (
        <Card className="w-full">
            <CardHeader>
                <div className="font-bold text-2xl">
                    {props.status === "alert" ? `❗️Alerting` : `🔔Resolved`}
                </div>
            </CardHeader>
            <CardContent className="p-2 pt-3">
                {formatedData.length >= 1 && (
                    <Table>
                        <TableCaption>
                            A new tender has been posted and requires our attention.
                            Please review the details above and determine who should be assigned to work on it.
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                {props.targetCols.map(item=>{
                                    return (<TableHead>{item}</TableHead>)
                                })}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {formatedData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{index+1}</TableCell>
                                    {Object.values(item).map(i=>
                                        <TableCell>
                                            {
                                                i.length > 100
                                                ? i.substring(0, 97) + "..."
                                                : i
                                            }
                                        </TableCell>)}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
};

import React from "react";

import {
    Card,
    CardContent,
    CardHeader,
  } from "../ui/card";
import { generateAlertBody } from "./AlertHelper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";

const BUTTON_STYLE = "bg-gray-300 hover:bg-gray-500 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center h-8";
const OPTION_COLUMN_STYLE = "";

const AlertMessagePanel = (props:any) => {
    const {content} = props;
    const alertBody = generateAlertBody(content);
    return (
        <Card className="w-[600px]">
            <CardHeader>
                {content.status=="firing"?`🔥${content.title}`:`🥳${content.title}`}
                {/* <h2>{content.title}</h2> */}
            </CardHeader>
            <CardContent>
                
                {alertBody.length >= 1 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[16px]">No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead className="w-[96px]">Options</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {alertBody.map((item, index)=>(
                        <TableRow key={index}>
                            <TableCell>{index}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                                {item.value.length > 40 ? item.value.substring(0,37)+"...": item.value}
                            </TableCell>
                            <TableCell>
                                {item.alertURL ? (<a href={item.alertURL}><Button className={BUTTON_STYLE}>View Alert</Button></a>): null}
                                {item.panelURL ? (<a href={item.panelURL}><Button className={BUTTON_STYLE}>View Panel</Button></a>): null}
                                {item.dashboardURL ? (<a href={item.dashboardURL}><Button className={BUTTON_STYLE}>View Dashboard</Button></a>):null}
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>)
}                                      
            </CardContent>
        </Card>
    )
}

export default AlertMessagePanel;
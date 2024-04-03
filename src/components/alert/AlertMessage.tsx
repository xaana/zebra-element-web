import React from "react";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "../ui/card";
import { generateAlertBody } from "./AlertHelper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";

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
                            <TableCell>{item.value}</TableCell>
                            <TableCell>
                                {item.alertURL ?? (<a href={item.alertURL}><Button>View Alert</Button></a>)}
                                {item.panelURL ?? (<a href={item.panelURL}><Button>View Panel</Button></a>)}
                                {item.dashboardURL ?? (<a href={item.dashboardURL}><Button>View Dashboard</Button></a>)}
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>)
}                                      
            </CardContent>
            {/* <CardFooter>

            </CardFooter> */}
        </Card>
    )
}

export default AlertMessagePanel;
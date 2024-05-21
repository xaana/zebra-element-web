import React from "react";
import { Label } from "./label";

export default function ZebraAlert() {
    return (
        <div className="flex justify-center my-3">
            <Label className="text-slate-400 italic">Zebra can make mistakes, please check improtant infomation.</Label>
        </div>
    );
}

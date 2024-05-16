import React from "react";
import { Label } from "./label";

export default function ZebiaAlert() {
    return (
        <div className="flex justify-center my-3">
            <Label className="text-slate-500">Zebra can make mistakes, please review.</Label>
        </div>
    );
}

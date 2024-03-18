import ReactECharts from "echarts-for-react";
import React from "react";

import { Loader } from "@/components/ui/loader";

export const EChartPanel = ({
    echartsOption,
    echartsQuery,
}: {
    echartsOption: any | null;
    echartsQuery: string | null;
}) => {
    const content = echartsOption ? (
        <>
            <div className="">
                <ReactECharts option={JSON.parse(echartsOption)} />
            </div>
        </>
    ) : (
        <Loader className="flex justify-center mt-[100px] w-full h-full" height="100" width="100" />
    );

    return <>{content}</>;
};

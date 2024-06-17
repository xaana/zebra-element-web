import React, { useEffect, useState } from "react";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

import { IExtendedConfigOptions, getVectorConfig } from "@/vector/getconfig";

export const MainPanel = (): JSX.Element => {
    const [iframeUrl, setIframeUrl] = useState<string | undefined>(undefined);
    const [specificUri, setSpecificUri] = useState("");
    const [token, setToken] = useState("");
    const client = useMatrixClientContext();
    useEffect(() => {
        fetch("http://localhost:9001/api/v1/login", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                accessKey: "minioadmin",
                secretKey: "minioadmin",
            }),
        }).then(()=>{
            setIframeUrl("http://localhost:9001/")
        });
        // let configData: IExtendedConfigOptions | undefined;
        // getVectorConfig().then((config)=>{
        //     configData = config;
        //     return fetch(config?.plugins.reports.api + "/api/algology_login", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify({user_id: client.getUserId()?.split(":")[0].substring(1)})
        //     })
        // })
        // .then(res=> res.json())
        // .then(async res=>{
        //     if (configData?.plugins["reports"]) {
        //         setIframeUrl(configData?.plugins["algology"].url);
        //     }
        //    setToken(res.token)
        // })
        // .catch(error=>{
        //     console.log(error);
        //     setIframeUrl("http://localhost:9001")
        // })
        setSpecificUri(localStorage.getItem("pluginUri") || "")
        localStorage.removeItem("pluginUri")
    }, []);

    return (
        <>
            {iframeUrl && (
                <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    id="storage-iframe"
                    src={iframeUrl}
                    height="100%"
                    width="100%"
                />
             )}
        </>
    );
};

import React, { useEffect, useState } from "react";
// import { Direction, Filter, MatrixEvent, Room } from "matrix-js-sdk/src/matrix";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";

import { getVectorConfig } from "@/vector/getconfig";
// import * as jose from jose;

// TODO: Add extra generation logic for generating this token
// Currently set to fixed user (admin)
// Keys can be found at ./data directory (the same as Algology using)
const STATIC_JWT_TOKEN =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiJ9.N3Depdc6Amt7EoRB4k0t9RfIHKv79YDUvaKy6b5wIiGLYIPx3AhaY7gyc9Fuvgy_jSa9_-gPeLYiEltIzzm-E1HWQh7lIchq-t2v_oAMvAfjE0gS6yETdhKJ-cyDmVJBwI9H9G1SbVVIiE3c_yJRPpSe_qsoVwDYisGvoQSM4WDUlZVJ0h32UetB-eAL8hewmmxN4b3dTaMdvApneGOpIMBGnkY9aQOlmb0Ym6kh31COYTtxdhrPWVS6EA7r_lBIMXW1efY06igWTlrR1O0o7LaY4E4dwg-gXxIyGpsf8ifxZmwsLd_3_y_8e3wRycf_tTYZjJAofKdLCxka_-3uMA";

export const MainPanel = (): JSX.Element => {
    // const [rooms, setRooms] = useState<Room[]>([]);
    // const [events, setEvents] = useState<MatrixEvent[]>([]);
    const [iframeUrl, setIframeUrl] = useState<string | undefined>(undefined);
    const [token, setToken] = useState("");
    const client = useMatrixClientContext();
    useEffect(() => {
        fetch("http://localhost:8000/api/algology_login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({user_id: client.getUserId()})
        })
        .then(res=> res.json())
        .then(async res=>{
            const configData = await getVectorConfig();
            if (configData?.plugins["reports"]) {
                setIframeUrl(configData?.plugins["algology"].url);
            }
           setToken(res.token)
        })
        .catch(error=>{
            console.log(error);
            setIframeUrl("http://localhost:3001")
            setToken(STATIC_JWT_TOKEN);
        })
        
        // Simulating lag
        // setTimeout(() => {
        //     setToken(STATIC_JWT_TOKEN);
        //     console.log(client)
        // }, 500);
    }, []);

    return (
        <>
            {iframeUrl && (
                <iframe
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    id="algology-iframe"
                    src={`${iframeUrl}/?orgId=1&kiosk=tv&auth_token=${token}`}
                    frameBorder="0"
                    height="100%"
                    width="100%"
                />
            )}
        </>
    );
};

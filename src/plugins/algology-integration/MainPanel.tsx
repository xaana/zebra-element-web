import React, { useEffect, useState } from "react";
// import { Direction, Filter, MatrixEvent, Room } from "matrix-js-sdk/src/matrix";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
// import * as jose from jose;

// TODO: Add extra generation logic for generating this token
// Currently set to fixed user (admin)
// Keys can be found at ./data directory (the same as Algology using)
const STATIC_JWT_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiJ9.N3Depdc6Amt7EoRB4k0t9RfIHKv79YDUvaKy6b5wIiGLYIPx3AhaY7gyc9Fuvgy_jSa9_-gPeLYiEltIzzm-E1HWQh7lIchq-t2v_oAMvAfjE0gS6yETdhKJ-cyDmVJBwI9H9G1SbVVIiE3c_yJRPpSe_qsoVwDYisGvoQSM4WDUlZVJ0h32UetB-eAL8hewmmxN4b3dTaMdvApneGOpIMBGnkY9aQOlmb0Ym6kh31COYTtxdhrPWVS6EA7r_lBIMXW1efY06igWTlrR1O0o7LaY4E4dwg-gXxIyGpsf8ifxZmwsLd_3_y_8e3wRycf_tTYZjJAofKdLCxka_-3uMA"

export const MainPanel = (): JSX.Element => {
    // const [rooms, setRooms] = useState<Room[]>([]);
    // const [events, setEvents] = useState<MatrixEvent[]>([]);
    const [token, setToken] = useState("");
    const client = useMatrixClientContext();
    const currentUser = client.getUser(client.getUserId());
    useEffect(()=>{
        // Simulating lag
        setTimeout(()=>{
            setToken(STATIC_JWT_TOKEN);
        }, 500);
    },[])

    return (
        <iframe allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                id="algology-iframe"
                src={`http://localhost:3001/?orgId=1&kiosk=tv&auth_token=${token}`}
                frameBorder="0"
                height="100%"
                width="100%"
         />
    )
}
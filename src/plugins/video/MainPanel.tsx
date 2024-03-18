import React, { useEffect, useState } from "react";
import { getVectorConfig } from "../../vector/getconfig";
import { Loader } from '../../components/ui/loader';
import { useMatrixClientContext } from 'matrix-react-sdk/src/contexts/MatrixClientContext';
import { IMatrixClientCreateOpts } from 'matrix-js-sdk/src/client';

export const MainPanel = () => {
  const [config, setConfig] = useState<Record<string, any>>();
  const [isLoading, setLoading] = useState(false);
  const client = useMatrixClientContext();

  useEffect(() => {
    const getConfig = async () => {
      const config = await getVectorConfig();
      if (config?.plugins["video"]) {
        setConfig(config?.plugins["video"]);
      }
    }

    setLoading(true);
    getConfig();
    setLoading(false);
  }, []);

  if (isLoading || !config?.url) {
    return <Loader />
  }

  const creds: IMatrixClientCreateOpts = {
    baseUrl: client.getHomeserverUrl(),
    idBaseUrl: client.getIdentityServerUrl(),
    accessToken: client.getAccessToken()?? '',
    refreshToken: client.getRefreshToken()?? '',
    userId: client.getUserId()?? '',
    deviceId: client.getDeviceId()?? '',
  };

  const credsStr = window.btoa(JSON.stringify(creds));

  const url = new URL(config.url);
  url.searchParams.set('creds', credsStr);
      
  return (
    <iframe src={url.toString()} style={{ height: "100%", width: "100%", border: "none" }}>

    </iframe>
  );
}
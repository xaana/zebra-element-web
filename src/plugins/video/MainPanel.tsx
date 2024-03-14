import React, { useEffect, useState } from "react";
import { getVectorConfig } from "../../vector/getconfig";
import { Loader } from '../../components/ui/loader';
import { useMatrixClientContext } from 'matrix-react-sdk/src/contexts/MatrixClientContext';

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

  const url = new URL(config.url);
  url.searchParams.set('userId', client.getUserId()?? '');
  url.searchParams.set('accessToken', client.getAccessToken()?? '');
      
  return (
    <iframe src={url.toString()} style={{ height: "100%", width: "100%", border: "none" }}>

    </iframe>
  );
}
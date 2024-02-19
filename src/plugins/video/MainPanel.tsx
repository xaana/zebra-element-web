import React, { useEffect, useState } from "react";
import { getVectorConfig } from "../../vector/getconfig";
import { Loader } from '../../components/ui/loader';

export const MainPanel = () => {
  const [config, setConfig] = useState<Record<string, any>>();
  const [isLoading, setLoading] = useState(false);
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

  if (isLoading) {
    return <Loader />
  }
      
  return (
    <iframe src={config?.["url"]} style={{ height: "100%", width: "100%", border: "none" }}>

    </iframe>
  );
}
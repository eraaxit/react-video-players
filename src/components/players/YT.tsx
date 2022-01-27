import React, { useCallback, useEffect, useState, useRef } from "react";
import { playerProps } from "../../types";
import { throwPlayerPropsError } from "../../utils/helpers";

const YT: React.FC<playerProps> = ({ sourceUrl, createObjectUrl = false }) => {
  const [url, setUrl] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  const createUrlObject = useCallback(async () => {
    const response = await fetch(sourceUrl);
    const blob = await response.blob();
    const _url = URL.createObjectURL(blob);
    setUrl(_url);
  }, [sourceUrl]);

  useEffect(() => {
    if (!sourceUrl) throwPlayerPropsError();
    if (!createObjectUrl) return setUrl(sourceUrl);
    createUrlObject();
  }, [sourceUrl, createUrlObject, createObjectUrl]);

  return (
    <div>
      {url ? (
        <>
          <video autoPlay ref={videoRef}>
            <source src={url} type="video/mp4" />
          </video>
          <button onClick={() => videoRef.current?.play()}>Play</button>
          <button onClick={() => videoRef.current?.pause()}>Pause</button>
        </>
      ) : (
        <p>Loading video...</p>
      )}
    </div>
  );
};
export default YT;

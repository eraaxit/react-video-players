import React, { useCallback, useEffect, useState, useRef } from "react";
import { playerProps } from "../../types";
import { throwPlayerPropsError } from "../../utils/helpers";
import "./YT.css"


const YT: React.FC<playerProps> = ({ sourceUrl, createUrl = false }) => {

  const [muted , setMuted] = useState<boolean>(false);
  const [play, setPlay]=useState<boolean>(true);

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
    if (!createUrl) return setUrl(sourceUrl);
    createUrlObject();
  }, [sourceUrl, createUrlObject, createUrl]);

  const handlePlay = () => {
    if(play){
      videoRef.current?.pause();
      setPlay(false);
    }else{
      videoRef.current?.play();
      setPlay(true);
    }
  }

  const handleVolume = () => {
    if(videoRef.current){
    if(muted){
      videoRef.current.volume=0;
      setMuted(false);
    }else{
      videoRef.current.volume=1;
      setMuted(true);
    }
  }
  }

  return (
    <div >
      {url ? (
        <div className="videoplayer">
          <video autoPlay ref={videoRef} className="video" >
            <source src={url} type="video/mp4"  />
          </video>
          <div className="controls">
          <div className="playButton">
            {play ? (
              <>
          <i className="fas fa-pause" onClick={handlePlay}></i>
              </>
            ):(
              <>
             <i className="fas fa-play" onClick={handlePlay}></i>
             </>
            )}
          </div>
          <div className="volumeButton">
            {!muted ? (
                <>
                <i className="fas fa-volume-mute" onClick={handleVolume}></i>
                </>
              ):(
                <>
                <i className="fas fa-volume-down" onClick={handleVolume}></i>
                </>
              )
            }
          </div>
          <div className="fullScreen">
          <i className="fas fa-expand" onClick={() => videoRef.current?.requestFullscreen()}></i>
          </div>

        </div>
        </div>
      ) : (
        <div className="loader">
        <i className="fas fa-spinner fa-spin"></i>
        </div>
      )}
    </div>
  );
};
export default YT;
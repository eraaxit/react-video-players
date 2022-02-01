import React, { useCallback, useEffect, useState, useRef } from "react";
import { playerProps } from "../../types";
import { throwPlayerPropsError } from "../../utils/helpers";
import "./YT.scss";
import {
  BsFillVolumeDownFill,
  BsFillVolumeUpFill,
  BsFillVolumeMuteFill,
  BsPlayFill,
  BsPauseFill,
} from "react-icons/bs";
import { BiFullscreen } from "react-icons/bi";

const YT: React.FC<playerProps> = ({ sourceUrl, createUrl = false }) => {
  const [muted, setMuted] = useState<number>(50);
  const [url, setUrl] = useState<string>("");
  const [play, setPlay] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [vol, setVol] = useState<number>(50);
  const [preVol, setPreVol] = useState<number>(50);

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
    if (play) {
      videoRef.current?.pause();
      setPlay(false);
    } else {
      videoRef.current?.play();
      setPlay(true);
    }
  };
  const handleVolume = () => {
    console.log(videoRef.current?.volume);
    if (videoRef.current) {
      if (muted < 3) {
        if (preVol > 3) {
          videoRef.current.volume = preVol / 100;
          setMuted(preVol);
          setVol(preVol);
        } else if (preVol <= 3) {
          videoRef.current.volume = 50 / 100;
          setVol(50);
          setMuted(50);
        }
      } else {
        videoRef.current.volume = 0;
        setMuted(0);
        setVol(0);
      }
    }
  };

  const handleVolumeSlider = (e: any) => {
    setPreVol(e.target.value);
    setVol(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = parseInt(e.target.value) / 100;
    }
    setMuted(e.target.value);
    console.log(preVol);
  };

  return (
    <div>
      {url ? (
        <div className="videoplayer">
          <video autoPlay ref={videoRef} className="video">
            <source src={url} type="video/mp4" />
          </video>
          <div className="controls">
            <div className="playButton">
              {play ? (
                <>
                  <div onClick={handlePlay}>
                    {" "}
                    <BsPauseFill />
                  </div>
                </>
              ) : (
                <>
                  <div onClick={handlePlay}>
                    {" "}
                    <BsPlayFill />
                  </div>
                </>
              )}
            </div>
            <div className="volBox">
              <div className="volumeButton">
                {muted < 3 ? (
                  <>
                    <div onClick={handleVolume}>
                      <BsFillVolumeMuteFill />
                    </div>
                  </>
                ) : muted <= 50 ? (
                  <>
                    <div onClick={handleVolume}>
                      <BsFillVolumeDownFill />
                    </div>
                  </>
                ) : (
                  <>
                    <div onClick={handleVolume}>
                      <BsFillVolumeUpFill />
                    </div>
                  </>
                )}
              </div>
              <div className="volumeSlider">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={vol}
                  onChange={handleVolumeSlider}
                  className="volRange"
                />
              </div>
            </div>
            <div className="fullScreen">
              <div onClick={() => videoRef.current?.requestFullscreen()}>
                <BiFullscreen />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader">
          <div>
            <img src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" />
          </div>
        </div>
      )}
    </div>
  );
};
export default YT;

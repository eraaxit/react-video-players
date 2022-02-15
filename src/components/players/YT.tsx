import React, { useCallback, useEffect, useState, useRef } from "react";
import { playerProps } from "../../types";
import { throwPlayerPropsError, logger } from "../../utils/helpers";
import "./YT.scss";
import { ImPlay3 } from "react-icons/im";
import { IoMdPause, IoMdVolumeOff } from "react-icons/io";
import { MdVolumeDown, MdVolumeUp } from "react-icons/md";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import Spinner1 from "../Spinners/Spinner1";

const YT: React.FC<playerProps> = ({
  sourceUrl,
  createUrl = false,
  videoSeekerColor = "#cc181e ",
  controlColor = "#cc181e",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [error, setError] = useState<
    "" | "Timeout Error" | "Server Error" | "Failed to play video"
  >("");
  const [muted, setMuted] = useState<number>(50);
  const [url, setUrl] = useState<string>("");
  const [play, setPlay] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [vol, setVol] = useState<number>(50);
  const [preVol, setPreVol] = useState<number>(50);
  const [screenPlay, setScreenPlay] = useState<boolean>(true);
  const [videoTime, setVideoTime] = useState<number>(0);
  const [videoSeekerPos, setVideoSeekerPos] = useState<number>(0);
  const [volumeSliderPos, setVolumeSliderPos] = useState<number>(50);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<string>("00");
  const [fullScreenMode, setFullScreenMode] = useState<boolean>(false);
  const volUpIcon = useRef<HTMLDivElement>(null);
  const volDownIcon = useRef<HTMLDivElement>(null);
  const volMuteIcon = useRef<HTMLDivElement>(null);
  const videoSeeker = useRef<HTMLInputElement>(null);

  const createUrlObject = useCallback(async () => {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => {
        setError("Timeout Error");
        controller.abort();
        logger(error);
      }, 10000);
      const response = await fetch(sourceUrl, {
        signal: controller.signal,
      });
      if (response.status === 200) {
        const blob = await response.blob();
        const _url = URL.createObjectURL(blob);
        clearTimeout(id);
        setUrl(_url);
        setVideoLoaded(true);
      } else if (response.status >= 500) {
        setError("Server Error");
      } else {
        setError("Failed to play video");
      }
    } catch (err: any) {
      logger(err.message);
      setError("Server Error");
    }
  }, [sourceUrl]);

  useEffect(() => {
    if (!sourceUrl) throwPlayerPropsError();
    if (!createUrl) return setUrl(sourceUrl);
    createUrlObject();

    if (videoSeeker.current) {
      videoSeeker.current.style.setProperty(
        "--SliderColor",
        `${videoSeekerColor}`
      );
    }
  }, [sourceUrl, createUrlObject, createUrl, videoSeekerColor]);

  const handleKeyPress = (e: any) => {
    e.preventDefault();
    const pressedKey = e.key;
    switch (pressedKey) {
      case "f":
      case "F":
        handleFullScreenRequest();
        break;
      case "ArrowRight":
        if (videoRef.current) {
          videoRef.current.currentTime =
            (videoRef.current.duration / 1000) * videoTime + 5;
        }
        break;
      case "ArrowLeft":
        if (videoRef.current) {
          videoRef.current.currentTime =
            (videoRef.current.duration / 1000) * videoTime - 5;
        }
        break;
      case "ArrowUp":
        if (videoRef.current) {
          if (videoRef.current.volume < 1) {
            videoRef.current.volume = (vol + 10) / 100;
            setMuted(vol + 10);
            setVol(vol + 10);
            setVolumeSliderPos(vol + 10);
          } else {
            videoRef.current.volume = 1;
            setMuted(100);
            setVol(100);
            setVolumeSliderPos(100);
          }
          volUpIcon.current?.classList.add("volumeButtonAnime");
          setTimeout(() => {
            volUpIcon.current?.classList.remove("volumeButtonAnime");
          }, 500);
        }
        break;
      case "ArrowDown":
        if (videoRef.current) {
          if (videoRef.current.volume >= 0.04) {
            videoRef.current.volume = (vol - 10) / 100;
            setMuted(vol - 10);
            setVol(vol - 10);
            setVolumeSliderPos(vol - 10);
            volDownIcon.current?.classList.add("volumeButtonAnime");
            setTimeout(() => {
              volDownIcon.current?.classList.remove("volumeButtonAnime");
            }, 500);
          } else {
            videoRef.current.volume = 0;
            setMuted(0);
            setVol(0);
            setVolumeSliderPos(0);
            volMuteIcon.current?.classList.add("volumeButtonAnime");
            setTimeout(() => {
              volMuteIcon.current?.classList.remove("volumeButtonAnime");
            }, 500);
          }
        }
        break;
      case " ":
        if (play) {
          videoRef.current?.pause();
          setPlay(false);
        } else {
          videoRef.current?.play();
          setPlay(true);
        }
        break;
    }
  };

  const handlePlay = () => {
    if (play) {
      videoRef.current?.pause();
      setPlay(false);
    } else {
      videoRef.current?.play();
      setPlay(true);
    }
  };

  const handleScreenPlay = () => {
    if (screenPlay) {
      videoRef.current?.pause();
      setScreenPlay(false);
    } else {
      videoRef.current?.play();
      setScreenPlay(true);
    }
  };

  const handleVolume = () => {
    if (videoRef.current) {
      if (muted < 3) {
        if (preVol > 3) {
          videoRef.current.volume = preVol / 100;
          setMuted(preVol);
          setVol(preVol);
          setVolumeSliderPos(preVol);
        } else if (preVol <= 3) {
          videoRef.current.volume = 50 / 100;
          setVol(50);
          setMuted(50);
          setVolumeSliderPos(50);
        }
      } else {
        videoRef.current.volume = 0;
        setMuted(0);
        setVol(0);
        setVolumeSliderPos(0);
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
    setVolumeSliderPos(e.target.value);
  };

  const handleVideoTime = (e: any) => {
    setVideoTime(e.target.value);
    if (videoRef.current) {
      const videoDuration = videoRef.current.duration;
      videoRef.current.currentTime = (videoDuration / 1000) * e.target.value;
      setVideoSeekerPos(Math.trunc((e.target.value / 1000) * 100));
    }
  };
  const handleVideoSeekerCont = (e: any) => {
    if (videoRef.current) {
      setVideoSeekerPos(
        Math.trunc(
          (videoRef.current?.currentTime / videoRef.current?.duration) * 100
        )
      );
      setVideoTime(
        videoRef.current?.currentTime * (1000 / videoRef.current?.duration)
      );
      convertNumberToTime(videoRef.current?.currentTime);
    }
  };
  const convertNumberToTime = (b: number) => {
    if (b < 59) {
      setMinutes(0);
    }
    const m = b - minutes * 59;
    if (seconds < "59") {
      const str = "" + m.toFixed();
      const pad = "00";
      const ans = pad.substring(0, pad.length - str.length) + str;
      setSeconds(ans);
    } else {
      setSeconds("00");
      setMinutes(minutes + 1);
    }
  };

  const handleFullScreenRequest = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      videoRef.current?.classList.remove("fullScreenStyling");
      setFullScreenMode(false);
    } else {
      containerRef.current?.requestFullscreen();
      videoRef.current?.classList.add("fullScreenStyling");
      setFullScreenMode(true);
    }
  };

  const finalDuration = () => {
    let b = 0;
    if (videoRef.current) {
      b = videoRef.current?.duration;
    }

    const min = b / 60;
    const sec = b % 60;
    const str = "" + sec.toFixed();
    const pad = "00";
    const ans = pad.substring(0, pad.length - str.length) + str;

    return `${min.toFixed()}:${ans}`;
  };

  return (
    <div>
      {error}
      <div
        className="videoplayer"
        ref={containerRef}
        onKeyDown={handleKeyPress}
      >
        {videoLoaded ? (
          <div onClick={handlePlay}>
            <video
              loop
              ref={videoRef}
              tabIndex={0}
              className="video"
              onTimeUpdate={handleVideoSeekerCont}
              onClick={handleScreenPlay}
            >
              <source src={url} type="video/mp4" />
            </video>
          </div>
        ) : (
          <div className="spinner-container">
            <Spinner1 />
          </div>
        )}

        <div className="volumeIcon">
          <div ref={volMuteIcon}>
            <IoMdVolumeOff />
          </div>
          <div ref={volDownIcon}>
            <MdVolumeDown />
          </div>
          <div ref={volUpIcon}>
            <MdVolumeUp />
          </div>
          )
        </div>

        <div className="playPause">
          <div
            style={{
              animationName: `${!screenPlay ? "playButtonAnime" : ""}`,
            }}
          >
            <IoMdPause />
          </div>
          <div
            style={{
              animationName: `${screenPlay ? "playButtonAnime" : ""}`,
            }}
          >
            <ImPlay3 />
          </div>
        </div>
        <div className={play ? "controls-hidden" : "controls"}>
          <div className="videoSeeker">
            <input
              type="range"
              min="0"
              max="1000"
              ref={videoSeeker}
              step="1"
              className="range"
              style={{
                background: ` linear-gradient(to right,
    ${videoSeekerColor} ${videoSeekerPos + 0.5}%, #444 0%)`,
              }}
              value={videoTime}
              onChange={handleVideoTime}
            />
          </div>
          <div className="gradient"></div>
          <div
            style={{
              borderColor: `transparent transparent transparent ${controlColor} `,
            }}
            className={play ? "playButton pause" : "playButton play"}
            onClick={handlePlay}
          ></div>
          <div className="volumeButton">
            {muted < 3 ? (
              <div onClick={handleVolume} style={{ color: `${controlColor}` }}>
                <IoMdVolumeOff />
              </div>
            ) : muted <= 50 ? (
              <div onClick={handleVolume} style={{ color: `${controlColor}` }}>
                <MdVolumeDown />
              </div>
            ) : (
              <div onClick={handleVolume} style={{ color: `${controlColor}` }}>
                <MdVolumeUp />
              </div>
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
              className="range2"
              style={{
                background: ` linear-gradient(to right,
                    ${controlColor} ${volumeSliderPos}%, #444 0%)`,
              }}
            />
          </div>
          <div className="timer" style={{ color: ` ${controlColor}` }}>
            {minutes}:{seconds} / {finalDuration()}
          </div>
          <div
            className="fullScreen"
            // @ts-ignore
            onClick={handleFullScreenRequest}
            style={{ color: ` ${controlColor}` }}
          >
            {fullScreenMode ? <BiExitFullscreen /> : <BiFullscreen />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YT;

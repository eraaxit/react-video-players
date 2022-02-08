import React, { useCallback, useEffect, useState, useRef } from "react";
import { playerProps } from "../../types";
import { throwPlayerPropsError } from "../../utils/helpers";
import "./YT.scss";
import { ImPlay3, ImSpinner3 } from "react-icons/im";
import { IoMdPause, IoMdVolumeOff } from "react-icons/io";
import { MdVolumeDown, MdVolumeUp } from "react-icons/md";
import { BiFullscreen } from "react-icons/bi";

const YT: React.FC<playerProps> = ({ sourceUrl, createUrl = false }) => {
  const [muted, setMuted] = useState<number>(50);
  const [url, setUrl] = useState<string>("");
  const [play, setPlay] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [vol, setVol] = useState<number>(50);
  const [preVol, setPreVol] = useState<number>(50);
  const [videoTime, setVideoTime] = useState<number>(0);
  const [screenPlay, setScreenPlay] = useState<boolean>(true);
  const [videoFocus, setVideoFocus] = useState<boolean>(false);
  const [videoSeekerPos, setVideoSeekerPos] = useState<number>(0);
  const [volumeSliderPos, setVolumeSliderPos] = useState<number>(50);
  // const [timer,setTimer] = useState<object>({minutes:0,seconds:0})
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<string>("00");

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

  const handleKeyPress = (e: any) => {
    if (e.key === "f" || e.key === "F") {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current?.requestFullscreen();
        // const o=document.getElementById("f");
        // const p=document.getElementsByTagName("head")[0];
        // const q=document.getElementById("c");
        // if(q ){
        //   console.log("j");
        //   // o.style.zIndex='2147483647';
        //   // o.style.height='100%';
        //   // o.style.width='100%';
        //   // o.style.display='block';
        //   // o.style.backgroundColor='grey';
        //   // o.style.margin='0px';
        //   // o.style.position='static';
        //   // p.style.display='none';
        //   q.style.zIndex='2147483649';
        // }
      }
    } else if (e.key === "ArrowRight") {
      if (videoRef.current) {
        videoRef.current.currentTime =
          (videoRef.current.duration / 1000) * videoTime + 5;
      }
    } else if (e.key === "ArrowLeft") {
      if (videoRef.current) {
        videoRef.current.currentTime =
          (videoRef.current.duration / 1000) * videoTime - 5;
      }
    } else if (e.key === "ArrowUp") {
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
      }
    } else if (e.key === "ArrowDown") {
      if (videoRef.current) {
        if (videoRef.current.volume >= 0.1) {
          videoRef.current.volume = (vol - 10) / 100;
          setMuted(vol - 10);
          setVol(vol - 10);
          setVolumeSliderPos(vol - 10);
        } else {
          videoRef.current.volume = 0;
          setMuted(0);
          setVol(0);
          setVolumeSliderPos(0);
        }
      }
    } else if (e.key === " ") {
      if (play) {
        videoRef.current?.pause();
        setPlay(false);
      } else {
        videoRef.current?.play();
        setPlay(true);
      }
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
  // const handleScreenPlay = () => {
  //   if (play) {
  //     videoRef.current?.pause();
  //     setPlay(false);
  //   } else {
  //     videoRef.current?.play();
  //     setPlay(true);
  //   }
  // };
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

  const handleScreenPlay = () => {
    if (!videoFocus) {
      setVideoFocus(true);
    }
    if (screenPlay) {
      videoRef.current?.pause();
      setScreenPlay(false);
    } else {
      videoRef.current?.play();
      setScreenPlay(true);
    }
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
    <div className="container">
      {url ? (
        <div className="videoplayer" onKeyDown={handleKeyPress}>
          <div onClick={handlePlay}>
            <video
              loop
              ref={videoRef}
              tabIndex={0}
              onClick={handleScreenPlay}
              className="video"
              onTimeUpdate={handleVideoSeekerCont}
            >
              <source src={url} type="video/mp4" />
            </video>
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
          <div id="c" className={play ? "controls-hidden" : "controls"}>
            <div className="videoSeeker">
              <input
                type="range"
                min="0"
                max="1000"
                step="1"
                className="range"
                style={{
                  background: ` linear-gradient(to right,
    #cc181e ${videoSeekerPos + 0.5}%, #444 0%)`,
                }}
                value={videoTime}
                onChange={handleVideoTime}
              />
            </div>
            <div className="gradient"></div>
            <div
              className={play ? "playButton pause" : "playButton play"}
              onClick={handlePlay}
            ></div>
            <div className="volumeButton">
              {muted < 3 ? (
                <div onClick={handleVolume}>
                  <IoMdVolumeOff />
                </div>
              ) : muted <= 50 ? (
                <div onClick={handleVolume}>
                  <MdVolumeDown />
                </div>
              ) : (
                <div onClick={handleVolume}>
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
                    white ${volumeSliderPos}%, #444 0%)`,
                }}
              />
            </div>
            <div className="timer">
              {minutes}:{seconds} / {finalDuration()}
            </div>
            <div
              className="fullScreen"
              onClick={() => videoRef.current?.requestFullscreen()}
            >
              <BiFullscreen />
            </div>
          </div>
        </div>
      ) : (
        <div className="loader">
          <ImSpinner3 />
        </div>
      )}
    </div>
  );
};
export default YT;

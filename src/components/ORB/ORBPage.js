import React, { useEffect, useState, useRef } from "react";
import "../../assets/css/ORB.css";
import html2canvas from "html2canvas";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { storeScreenShot } from "../../actions/orbActions";

function ORBPage() {
  const [isLive, setIsLive] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef();
  const dispatch = useDispatch();
  const constraints = {
    audio: true,
    video: true,
    options: {
      mirror: true,
    },
  };

  const [options, setOptions] = useState({
    appId: `${process.env.REACT_APP_AGORA_APP_ID}`,
    channel: localStorage.getItem("name"),
    token: null,
    role: "host",
  });

  const stateData = useSelector(state => state.ORB);

  const getImage = () => {
    console.log("fn called");
    html2canvas(document.querySelector("#capture"), {
      allowTaint: true,
      scrollX: 0,
      scrollY: -window.scrollY,
    }).then(canvas => {
      let file;
      canvas.toBlob(async blob => {
        file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
        let fd = new FormData();
        fd.append("id", localStorage.getItem("id"));
        fd.append("image", file);

        await dispatch(storeScreenShot(fd));
      });
    });
  };

  const callGoToLive = async () => {
    setIsLive(true);
    const rtc = {
      client: null,
      localAudioTrack: null,
      localVideoTrack: null,
    };
    let token;
    await axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }api/agora/generateRtcToken?channelName=${localStorage.getItem(
          "name"
        )}&userId=${localStorage.getItem("id")}`
      )
      .then(result => {
        console.log("result-==-=--=", result.data.key);
        setOptions({ ...options, token: result.data.key });
        token = result.data.key;
      })
      .catch(err => console.log("error ", err));

    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    await rtc.client.setClientRole(options.role);
    const uid = await rtc.client.join(
      options.appId,
      options.channel,
      token,
      null
    );

    rtc.client.on("user-published", async (user, mediaType) => {
      console.log("user-published!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

      // Subscribe to a remote user.
      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

      if (mediaType === "video" || mediaType === "all") {
        let playerWrapper = document.createElement("div");
        playerWrapper.setAttribute("id", `player-wrapper-${user.uid}`);

        let player = document.createElement("div");
        player.setAttribute("id", `player-${user.uid}`);
        player.setAttribute("style", "border-radius: 50%");
        playerWrapper.appendChild(player);

        document.getElementById("remote-playerlist").appendChild(playerWrapper);
        user.videoTrack.play(`remote-playerlist`);
      }
      if (mediaType === "audio" || mediaType === "all") {
        user.audioTrack.play();
      }
    });
    rtc.client.on("user-unpublished", async (user, mediaType) => {
      console.log("handleUserUnpublished-==-=-=", user.uid);
      const id = user.uid;
    });
    // Create an audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Create a video track from the video captured by a camera.
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    const player = document.getElementsByClassName("player");
    console.log(
      "localVideoTrack success!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=",
      rtc.localVideoTrack
    );

    rtc.localVideoTrack.play("local-player");
    rtc.localAudioTrack.play();

    // Publish the local audio and video tracks to the channel.
    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

    console.log("publish success!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
  };

  function showHosts() {
    let hosts = [];
    for (let i = 1; i <= 15; i++) {
      hosts.push(
        <div className="ORB_main_cat" id="remote-playerlist">
          {isLive ? <></> : <img src="../assets/images/button_bg.png" />}
        </div>
      );
    }
    return hosts;
  }

  return (
    <div
      style={{
        background: isLive
          ? "url('../assets/images/background_black.jpg')"
          : "url('../assets/images/JL-GO-LIVE.jpg')",
        backgroundSize: "100vw auto",
        marginTop: "-48px",
      }}
      id="capture">
      <div className="main_ORB_section container pt-5 mt-5 d-flex">
        <div className="ORB_logo">
          <img src="../assets/images/grey_logo.png" />
        </div>
        <div
          className="ORB_live_container d-flex player"
          id="local-player"
          style={{
            boxShadow: isLive
              ? "inset 3px 5px 5px #3a3a3a"
              : "rgb(89 89 89) 3px 5px 5px 8px inset",
            backgroundColor: "#424242",
          }}>
          {/* <div className="ORB_video_live d-flex position-relative">
            <div></div>
          </div> */}
        </div>

        <div className="ORB_tips_info d-flex">
          <div className="tips text-center">
            <div className="lights">
              <div className="one_light"></div>
              <div className="two_light"></div>
              <div className="three_light"></div>
              <div className="four_light"></div>
              <div className="five_light"></div>
              <div className="six_light"></div>
              <div className="seven_light"></div>
              <div className="eight_light"></div>
              <div className="nine_light"></div>
              <div className="ten_light"></div>
            </div>
            <div className="title_tips">Tips</div>
          </div>
          <div className="values">
            <div className="value_container">
              <span className="value_name">Timer</span>
              <div
                className="progress"
                style={{
                  width: "70px",
                }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: "100%",
                  }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
            </div>
            <div className="value_container">
              <span className="value_name">Tip</span>
              <div
                className="progress"
                style={{
                  width: "70px",
                }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: "60%",
                  }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
            </div>
            <div className="value_container">
              <span className="value_name">Viewers</span>
              <div
                className="progress"
                style={{
                  width: "70px",
                }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: "40%",
                  }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
            </div>
            <div className="value_container">
              <span className="value_name">Ticket Sold</span>
              <div
                className="progress"
                style={{
                  width: "70px",
                }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: "100%",
                  }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container ORB_videos_container mt-3 player">
        <div
          className="ORB_main_cat"
          id="remote-playerlist"
          style={{ borderRadius: "50%" }}>
          {isLive ? <></> : <img src="../assets/images/button_bg.png" />}
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div
          className="ORB_main_cat"
          style={{ cursor: isLive ? "auto" : "pointer" }}
          onClick={callGoToLive}>
          {isLive ? (
            <img src="../assets/images/button_bg.png" />
          ) : (
            <img src="../assets/images/Background.png" />
          )}
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="r_image">
          {isLive ? (
            <img src="../assets/images/r_image.png" />
          ) : (
            <img src="../assets/images/disableR.png" />
          )}
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
        <div className="ORB_main_cat">
          <img src="../assets/images/button_bg.png" />
        </div>
      </div>
      <div className="container justify-content-center d-flex ORB_links mt-5">
        <a>
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/ticket.png" />
            <p>Ticket</p>
          </div>
        </a>
        <a>
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/seat.png" />
            <p>Seat</p>
          </div>
        </a>
        {isLive ? (
          <a onClick={getImage}>
            <div className="ORB_link d-flex flex-column">
              <img src="../assets/images/take_picture.png" />
              <p>Take Picture</p>
            </div>
          </a>
        ) : (
          <a style={{ cursor: "no-drop" }}>
            <div className="ORB_link d-flex flex-column">
              <img src="../assets/images/take_picture.png" />
              <p>Take Picture</p>
            </div>
          </a>
        )}

        <a>
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/time.png" />
            <p>Time</p>
          </div>
        </a>
        <a style={{ cursor: isLive ? "pointer" : "no-drop" }}>
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/short_break.png" />
            <p>Short Break</p>
          </div>
        </a>
        <a>
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/share.png" />
            <p>Share</p>
          </div>
        </a>
        <a style={{ cursor: isLive ? "pointer" : "no-drop" }}>
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/tip.png" />
            <p>Tip</p>
          </div>
        </a>
        <a>
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/exit.png" />
            <p>Exit</p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default ORBPage;

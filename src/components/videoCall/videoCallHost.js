import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";

function VideoCall() {
  const [options, setOptions] = useState({
    appId: `${process.env.REACT_APP_AGORA_APP_ID}`,
    channel: localStorage.getItem("id"),
    token: null,
    role: "host",
  });

  useEffect(async () => {
    var rtc = {
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
          "id"
        )}&userId=${localStorage.getItem("id")}`
      )
      .then(result => {
        console.log("result-==-=--=", result.data.key);
        localStorage.setItem("videoToken", result.data.key);
        setOptions({ ...options, token: result.data.key });
        token = result.data.key;
      })
      .catch(err => console.log("error ", err));
    rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
    // rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    // await rtc.client.setClientRole(options.role);
    const uid = await rtc.client.join(
      options.appId,
      options.channel,
      token,
      null
    );
    // // await rtc.client.enableDualStream();
    // // Create an audio track from the audio sampled by a microphone.
    // rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // // Create a video track from the video captured by a camera.
    // rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    // const player = document.getElementsByClassName("player");
    // console.log(
    //   "localVideoTrack success!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=",
    //   rtc.localVideoTrack
    // );

    // rtc.localVideoTrack.play("local-player");
    // rtc.localAudioTrack.play();

    // // Publish the local audio and video tracks to the channel.
    // await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

    // console.log("publish success!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

    rtc.client.on("user-published", async (user, mediaType) => {
      console.log("user-published!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

      // Subscribe to a remote user.
      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

      if (mediaType === "video") {
        let playerWrapper = document.createElement("div");
        playerWrapper.setAttribute("id", `player-wrapper-${user.uid}`);
        let player = document.createElement("div");
        player.setAttribute("id", `player-${user.uid}`);
        playerWrapper.appendChild(player);
        //   const player = `
        //   <div id="player-wrapper-${uid}">
        //     <p class="player-name">remoteUser(${uid})</p>
        //     <div id="player-${uid}" class="player"></div>
        //   </div>
        // `;
        document.getElementById("remote-playerlist").appendChild(playerWrapper);
        user.videoTrack.play(`remote-playerlist`);
      }
      if (mediaType === "audio") {
        user.audioTrack.play();
      }
    });
    rtc.client.on("user-unpublished", async (user, mediaType) => {
      console.log("handleUserUnpublished-==-=-=", user.uid);
      const id = user.uid;

      // document.getElementById(`player-wrapper-${user.uid}`).remove();
    });
    // await rtc.client.enableDualStream();
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
  }, []);
  return (
    <div>
      Hi{console.log("OPTIONS...", options)}
      <div
        id="local-player"
        class="player"
        style={{ borderRadius: "100%", height: "300px", width: "300px" }}>
        {/* <video
          ref={videoRef}
          autoPlay={true}
          style={{ borderRadius: "100%", height: "300px", width: "300px" }}
        />
        <audio ref={audioRef} autoPlay={true} muted={true} /> */}
      </div>{" "}
      <div
        id="remote-playerlist"
        class="player mt-5"
        style={{ borderRadius: "100%", height: "450px", width: "300px" }}></div>
    </div>
  );
}

export default VideoCall;

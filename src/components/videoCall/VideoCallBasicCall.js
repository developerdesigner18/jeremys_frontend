import React, { useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";

function VideoCallBasicCall() {
  const [options, setOptions] = useState({
    appId: `${process.env.REACT_APP_AGORA_APP_ID}`,
    channel: localStorage.getItem("name"),
    token: null,
    role: "host",
  });
  const rtc = {
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  };

  const goToLivePage = async () => {
    console.log("fn called");
    let token;

    let userId = localStorage.getItem("name").toString();
    await axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }api/agora/generateRtcToken?channelName=Chef&userId=${localStorage.getItem(
          "id"
        )}`
      )
      .then(result => {
        console.log("result-==-=--=", result.data.key);
        setOptions({ ...options, token: result.data.key });
        token = result.data.key;
      })
      .catch(err => console.log("error ", err));

    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    const uid = await rtc.client.join(
      options.appId,
      options.channel,
      token,
      null
    );

    // Create an audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Create a video track from the video captured by a camera.
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

    // Publish the local audio and video tracks to the channel.
    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

    rtc.client.on("user-published", async (user, mediaType) => {
      console.log("user-published!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

      // Subscribe to a remote user.
      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

      if (mediaType === "video") {
        user.videoTrack.play(`chef-remote-playerlist`);
      }
      if (mediaType === "audio") {
        user.audioTrack.play();
      }
    });
    rtc.client.on("user-unpublished", async (user, mediaType) => {
      console.log("handleUserUnpublished chef/stylist-==-=-=", user.uid);
    });

    rtc.localVideoTrack.play("local-player");
    rtc.localAudioTrack.play();
    console.log("publish success!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
  };
  return (
    <div>
      <button onClick={goToLivePage}>Call</button>
      <div
        id="local-player"
        style={{ width: "350px", height: "280px", marginTop: "5px" }}></div>
      <div
        id="chef-remote-playerlist"
        style={{ width: "350px", height: "280px", marginTop: "85px" }}></div>
    </div>
  );
}

export default VideoCallBasicCall;

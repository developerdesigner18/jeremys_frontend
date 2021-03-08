import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";

function VideoCallBasicCall1() {
  const rtc = {
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  };

  let token;
  const [options, setOptions] = useState({
    appId: `${process.env.REACT_APP_AGORA_APP_ID}`,
    channel: null,
    token: null,
    role: "audience",
  });

  useEffect(async () => {
    await axios
      .get(
        `${process.env.REACT_APP_API_URL}api/agora/getUserToken?id=5ff6fd76b710942b8831af88`
      )
      .then(async result => {
        token = result.data.data.agoraToken;
      });
  }, [options.token != null]);

  const joinCall = async () => {
    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    await rtc.client.join(options.appId, "Chef", token, null);

    // Create an audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();

    // Create a video track from the video captured by a camera.
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

    // Publish the local audio and video tracks to the channel.
    rtc.client
      .publish([rtc.localAudioTrack, rtc.localVideoTrack])
      .then(() => console.log("published succeed!"));

    // Subscribe to a remote user
    rtc.client.on("user-published", async (user, mediaType) => {
      console.log("user-published!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= ", user);

      // Subscribe to a remote user.
      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

      if (mediaType === "video") {
        user.videoTrack.play("fan-playerlist");
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
  };

  return (
    <div>
      <button onClick={joinCall}>Join</button>
      <div
        id="local-player"
        style={{ width: "350px", height: "280px", marginTop: "5px" }}></div>
      <div
        id="fan-playerlist"
        style={{ width: "350px", height: "280px", marginTop: "85px" }}></div>
    </div>
  );
}

export default VideoCallBasicCall1;

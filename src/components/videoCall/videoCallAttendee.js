import React, { useState, useEffect, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";

function VideoCall() {
  const [options, setOptions] = useState({
    appId: `${process.env.REACT_APP_AGORA_APP_ID}`,
    channel: localStorage.getItem("id"),
    token: null,
    role: "audience",
  });

  useEffect(async () => {
    var remoteUsers = {};
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
        }api/agora/generateRtcToken?channelName=${localStorage.getItem("id")}`
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
      localStorage.getItem("videoToken"),
      null
    );
    console.log("Meeting Joined-==-=-=", rtc.client);
    rtc.client.on("user-published", async (user, mediaType) => {
      console.log("handleUserPublished-==-=-=", user.uid);
      const id = user.uid;
      remoteUsers[id] = user;
      //   subscribe(user, mediaType);
      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success-=-=-=-=-=-=-=-=-=");
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
      delete remoteUsers[id];
      // document.getElementById(`player-wrapper-${id}`).remove();
    });
    // await rtc.client.join(options.appId, options.channel, token, null);
  }, []);

  return (
    <div>
      Hi{console.log("OPTIONS...", options)}
      <div
        id="remote-playerlist"
        class="player mt-5"
        style={{ borderRadius: "100%", height: "450px", width: "50%" }}></div>
    </div>
  );
}

export default VideoCall;

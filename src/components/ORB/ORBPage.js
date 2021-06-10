import React, {useEffect, useState, useRef} from "react";
import "../../assets/css/ORB.css";
import html2canvas from "html2canvas";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {socket} from "../../socketIO";
import swal from "sweetalert";
import Modal from "react-bootstrap/Modal";

import {
  storeOnlineUser,
  removeOnlineUser,
  getJoinedFanList,
  changeUserStatus,
  storeLiveStream,
  deleteStream,
  storeHostUId,
} from "../../actions/orbActions";
import {getUserWithId} from "../../actions/userActions";
import Timer from "../ORBTicketComponents/Timer";
import Seat from "../ORBTicketComponents/Seat";
import GenerateTicket from "../ORBTicketComponents/GenerateTicket";
import moment from "moment";
import socketIOClient from "socket.io-client";
import ScreenShotUpload from "../ORBTicketComponents/ScreenShotUpload";

const useOutsideClick = (ref, callback) => {
  const handleClick = e => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

function ORBPage(props) {
  const [isLive, setIsLive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fanList, setFanList] = useState([]);
  const ref = useRef();
  const [isBreak, setIsbreak] = useState(false);
  const dispatch = useDispatch();
  const [subscribedUsers, setSubscribedUsers] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showSeat, setShowSeat] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [seats, setSeats] = useState(0);
  const [time, setTime] = useState(0);
  const [timeOnTicket, setTimeOnTicket] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [ticketPrice, setTicketPrice] = useState(0);
  const [fanVideoClicked, setFanVideoClicked] = useState(false);
  const [fanVideoClickedUid, setFanVideoClickedUid] = useState(null);
  const [seatArray, setSeatArray] = useState([]);
  const [isMute, setIsMute] = useState(false);
  const [tipRatio, setTipRatio] = useState(0);
  const [ticketSold, setTicketSold] = useState(0);
  const [imageModal, setImageModal] = useState(false);
  const [ORB, setORB] = useState({
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  });
  const [fansFromQ, setFansFromQ] = useState([]);
  const [fansWithR, setFansWithR] = useState([]);
  const [availableHost, setAvailableHost] = useState([]);
  const rtc = {
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  };

  let socket;

  const menuClass = `dropdown-menu${isOpen ? " show" : ""}`;
  useOutsideClick(ref, () => {
    setIsOpen(false);
  });
  useEffect(() => {
    socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);
    document.documentElement.scrollTop = 0;
    dispatch(getUserWithId(localStorage.getItem("id")));
    console.log(
      "login user type........",
      localStorage.getItem("type"),
      socket
    );
    if (
      localStorage.getItem("type") === "trainer" ||
      localStorage.getItem("type") === "Trainer"
    ) {
      console.log("inside if...........");
      socket.on("getQvalue", data => {
        console.log("data from q event", data);
        if (data[localStorage.getItem("id")]) {
          setFansFromQ(data[localStorage.getItem("id")]);
        }
      });
    }

    socket.on("tipTicketValue", data => {
      console.log("data from tip ticket event", data);
      setTipRatio(data.tip);
      setTicketSold(data.soldTicket);
    });

    socket.on("getFanRValue", data => {
      console.log("r fan data.. ", data);
      setFansWithR(data);
    });

    window.addEventListener("beforeunload", async ev => {
      console.log("before unload evenet called ", ev);

      await dispatch(removeOnlineUser());
      await dispatch(deleteStream());

      ev.returnValue = "Live streaming will be closed. Sure you want to leave?";
      return ev.returnValue;
    });
  }, []);
  let host = [];

  React.useEffect(async () => {
    if (time > 0) {
      if (isLive) setTimeout(() => setTime(time - 1), 1000);
    } else {
      setTime(0);
      if (isLive) await leaveCall();
    }
  });

  const [options, setOptions] = useState({
    appId: `${process.env.REACT_APP_AGORA_APP_ID}`,
    channel: localStorage.getItem("id"),
    token: null,
    role: "host",
  });
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
    setShowTimer(false);
    setShowSeat(false);
    setShowTicket(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const stateData = useSelector(state => state.ORB);
  const stateUser = useSelector(state => state.user);

  const setMoreIcon = () => {
    setIsOpen(!isOpen);
  };
  const onClickVideo = uid => {
    setFanVideoClicked(true);
    setFanVideoClickedUid(uid);
    console.log("uid=-=-=-=-=-", uid);

    let agoraClass = document.getElementById("fan-remote-playerlist2");
    let agoraArray = agoraClass.childNodes;
    console.log("agaoraArray", agoraArray);
    for (let i = 0; i < agoraClass.childNodes.length; i++) {
      if (agoraClass.childNodes[i].id == `player-wrapper-${uid}`) {
        agoraClass.childNodes[i].classList.add("col-md-12");
        agoraClass.childNodes[i].classList.remove("fan_ORB_main_small_video");
        agoraClass.childNodes[i].classList.add("fan_ORB_main_big_video");
        agoraClass.childNodes[i].setAttribute(
          "style",
          "height:500px; width: 500px; border-radius:50%;"
        );
        document
          .getElementById("BigColumn")
          .appendChild(agoraClass.childNodes[i]);
        document.getElementById("BigColumn").addEventListener("click", () => {
          closedBigORB(uid);
        });
      }
    }
  };
  const callGoToLive = async () => {
    // console.log("seats and time... ", seats, time);
    if (seats > 0 && time > 0) {
      socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);

      const dataToPass = {
        userId: localStorage.getItem("id").toString(),
        timer: time,
        seat: seats,
        price: ticketPrice,
      };
      await dispatch(storeLiveStream(dataToPass));

      setIsLive(true);
      await dispatch(storeOnlineUser());

      let token;
      let subscribedValue = false;

      socket.emit("storeUser", localStorage.getItem("id"));
      let userId = localStorage.getItem("id").toString();

      await axios
        .get(
          `${
            process.env.REACT_APP_API_URL
          }api/agora/generateRtcToken?channelName=${userId}&userId=${localStorage.getItem(
            "id"
          )}`
        )
        .then(result => {
          // console.log("result-==-=--=", result.data.key);
          setOptions(prevState => ({...prevState, token: result.data.key}));
          token = result.data.key;
        })
        .catch(err => console.log("error ", err));

      rtc.client = AgoraRTC.createClient({mode: "live", codec: "vp8"});
      setORB(prevState => ({...prevState, client: rtc.client}));
      await rtc.client.setClientRole(options.role);
      const uid = await rtc.client.join(
        options.appId,
        options.channel,
        token,
        null
      );
      await dispatch(storeHostUId(uid));
      console.log("uid Host==-=-=-=", uid);

      // await rtc.client.enableDualStream();
      // Create an audio track from the audio sampled by a microphone.
      rtc.localAudioTrack = await AgoraRTC
        .createMicrophoneAudioTrack
        // {
        // encoderConfig: {
        //   sampleRate: 48000,
        //   stereo: true,
        //   bitrate: 128,
        // },
        // AEC: true,
        // AGC: true,
        // ANS: true,
        // }
        ();
      setORB(prevState => ({
        ...prevState,
        localAudioTrack: rtc.localAudioTrack,
      }));
      AgoraRTC.onMicrophoneChanged = async changedDevice => {
        // When plugging in a device, switch to a device that is newly plugged in.
        if (changedDevice.state === "ACTIVE") {
          rtc.localAudioTrack.setDevice(changedDevice.device.deviceId);
          // Switch to an existing device when the current device is unplugged.
        } else if (
          changedDevice.device.label === rtc.localAudioTrack.getTrackLabel()
        ) {
          const oldMicrophones = await AgoraRTC.getMicrophones();
          oldMicrophones[0] &&
            rtc.localAudioTrack.setDevice(oldMicrophones[0].deviceId);
        }
      };

      // Create a video track from the video captured by a camera.
      rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      setORB(prevState => ({
        ...prevState,
        localVideoTrack: rtc.localVideoTrack,
      }));

      rtc.localVideoTrack.play("local-player");
      // rtc.localAudioTrack.play();

      // Publish the local audio and video tracks to the channel.
      await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

      // user-published event
      rtc.client.on("user-published", async (user, mediaType) => {
        // console.log("user-published!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

        // Subscribe to a remote user.

        var x = document.getElementsByClassName(
          "fan_ORB_small_video_idle"
        ).length;
        const seatCount = seats - 1;
        console.log("x-=-=-=-=-", x, seats, x <= seatCount);
        if (x <= seatCount) {
          await rtc.client.subscribe(user, mediaType);
          await dispatch(changeUserStatus());

          if (mediaType === "video") {
            subscribedValue = true;
            setSubscribedUsers(subscribedValue);
            host.push(user);
            setAvailableHost([...host]);
            let agoraClass = document.getElementById("fan-remote-playerlist2");
            for (let i = 0; i < seatCount; i++) {
              let generatedDiv = document.getElementById(
                `player-wrapper-${user.uid}`
              );
              if (generatedDiv) {
                generatedDiv.remove();
              }
              let playerWrapper = document.createElement("div");
              playerWrapper.setAttribute("id", `player-wrapper-${user.uid}`);
              playerWrapper.classList.add("col-md-2");
              playerWrapper.classList.add("my-1");
              playerWrapper.classList.add("fan_ORB_main_small_video");
              playerWrapper.classList.add("fan_ORB_small_video_idle");
              playerWrapper.addEventListener("click", () => {
                onClickVideo(user.uid);
              });
              playerWrapper.setAttribute(
                "style",
                "height:165px; width: 100%; border-radius:50%;"
              );
              agoraClass.insertBefore(playerWrapper, agoraClass.childNodes[0]);
              user.videoTrack.play(`player-wrapper-${user.uid}`);
            }
          } else {
            rtc.client.on("media-reconnect-start", uid => {
              // console.log("media-reconnect-start event called.............", uid);
            });
          }
          if (mediaType === "audio") {
            console.log("data-=-=medialType-=-==--=Audio");

            // socket.on("getFanRValue", (data) => {
            //   console.log("data-=-=", data);

            //   console.log("1st if", data);
            //   if (data.length) {
            //     console.log("2nd if");
            //     for (let info of data) {
            //       console.log("3rd if");
            //       console.log(
            //         "check condition.. ",
            //         info === user.uid,
            //         info,
            //         user.uid
            //       );
            //       if (info === user.uid) {
            //         console.log("4th if");
            user.audioTrack.play();
            //       }
            //     }
            //   }
            // });
          } else {
            rtc.client.on("media-reconnect-start", uid => {
              // console.log("media-reconnect-start event called.............", uid);
            });
          }
        }
      });
      // user-unpulished event
      rtc.client.on("user-unpublished", async (user, mediaType) => {
        let generatedDiv = document.getElementById(
          `player-wrapper-${user.uid}`
        );
        if (generatedDiv) {
          generatedDiv.remove();
        }
        // console.log("handleUserUnpublished-==-=-=", user.uid);
        const id = user.uid;
      });
      // console.log("publish success!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    } else {
      swal("Info", "Please fill up the show time and seats!", "info");
    }
  };

  const callRoarFunction = () => {
    console.log("call r fn called.....");
    const socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);
    if (isLive) {
      const dataToPass = {
        userId: localStorage.getItem("id"),
        rValue: !isMute,
      };

      setIsMute(!isMute);

      socket.emit("storeRvalue", dataToPass);
      console.log("is mute value... ", isMute);
      if (isMute) {
        console.log("available host.. ", availableHost);
        if (availableHost.length) {
          for (let user of availableHost) {
            ORB.client.unsubscribe(user, "audio");
          }
        }
      } else {
        console.log("available host for subscribe.. ", availableHost);
        if (availableHost.length) {
          for (let user of availableHost) {
            ORB.client.subscribe(user, "audio");
          }
        }
      }
    }
  };

  function showHosts() {
    let hosts = [];
    for (let i = 0; i < parseInt(seats) + 1; i++) {
      if (i == 3) {
        hosts.push(
          <div
            className={`ORB_main_cat ${subscribedUsers ? "col-md-2" : null}`}
            id={`fan-ORB${i}`}>
            {subscribedUsers ? (
              <></>
            ) : (
              <img src="../assets/images/live-btn.png" />
            )}
          </div>
        );
      }
      // else if (i == 17) {
      //   hosts.push(
      //     <div className="ORB_main_cat" id={`fan-ORB${i}`}>
      //       <img
      //         src="../assets/images/disableR.png"
      //         onClick={callRoarFunction}
      //       />
      //     </div>
      //   );
      // }
      else {
        hosts.push(
          <div className="ORB_main_cat" id={`fan-ORB${i}`}>
            {subscribedUsers ? (
              <></>
            ) : (
              <img src="../assets/images/button_bg.png" />
            )}
          </div>
        );
      }
    }
    return hosts;
  }
  function showEmptyCircles() {
    var x = document.getElementsByClassName("fan_ORB_small_video_idle").length;
    let hosts = [];
    for (let i = 0; i < parseInt(seats) - x; i++) {
      hosts.push(
        <div
          className="ORB_main_cat col-md-2 my-1 mx-0"
          id={`fan-ORB${i}`}
          style={{width: "100%", height: "165px"}}>
          <img
            src="../assets/images/button_bg.png"
            style={{width: "100%", height: "100%"}}
          />
        </div>
      );
    }
    return hosts;
  }
  function showDivOnVideoClick() {
    let agoraClass = document.getElementById("fan-remote-playerlist2");
    let agoraArray = agoraClass.childNodes;
    let seatLength = document.getElementsByClassName(
      "fan_ORB_small_video_idle"
    ).length;
    console.log("agaoraArray", agoraArray, fanVideoClickedUid);
    for (let i = 0; i < agoraClass.childNodes.length; i++) {
      if (
        agoraClass.childNodes[i].id == `player-wrapper-${fanVideoClickedUid}`
      ) {
        agoraClass.childNodes[i].classList.add("col-md-12");
        agoraClass.childNodes[i].classList.remove("fan_ORB_main_small_video");
        agoraClass.childNodes[i].classList.add("fan_ORB_main_big_video");
        agoraClass.childNodes[i].setAttribute(
          "style",
          "height:500px; width: 500px; border-radius:50%;"
        );
        document
          .getElementById("BigColumn")
          .appendChild(agoraClass.childNodes[i]);
        document.getElementById("BigColumn").addEventListener("click", () => {
          closedBigORB();
        });
      }
      if (
        i % 2 == 0 &&
        agoraClass.childNodes[i].id !== `player-wrapper-${fanVideoClickedUid}`
      ) {
        if (document.getElementById("SmallColumnLeft")) {
          {
            agoraClass.childNodes[i].classList.remove("m-0");
            agoraClass.childNodes[i].classList.add("col-md-6");
            agoraClass.childNodes[i].classList.contains(
              "fan_ORB_main_small_video"
            );
            {
              agoraClass.childNodes[i].classList.remove(
                "fan_ORB_main_small_video"
              );
              agoraClass.childNodes[i].setAttribute(
                "style",
                "height:165px; width: 100%; border-radius:50%;"
              );
              // agoraClass.childNodes[i].classList.add("m-auto");
              agoraClass.childNodes[i].classList.add(
                "fan_ORB_main_small_video2"
              );
            }
            agoraClass.childNodes[i].classList.add("my-2");

            document
              .getElementById("SmallColumnLeft")
              .appendChild(agoraClass.childNodes[i]);
          }
        }
      }
      if (
        i % 2 == 1 &&
        agoraClass.childNodes[i].id !== `player-wrapper-${fanVideoClickedUid}`
      ) {
        if (document.getElementById("SmallColumnRight")) {
          {
            agoraClass.childNodes[i].classList.add("col-md-6");
            agoraClass.childNodes[i].classList.remove("m-0");
            agoraClass.childNodes[i].classList.contains(
              "fan_ORB_main_small_video"
            );
            {
              agoraClass.childNodes[i].classList.add(
                "fan_ORB_main_small_video2"
              );
              agoraClass.childNodes[i].setAttribute(
                "style",
                "height:165px; width: 100%; border-radius:50%;"
              );
              agoraClass.childNodes[i].classList.remove(
                "fan_ORB_main_small_video"
              );
              // agoraClass.childNodes[i].classList.add("m-auto");
            }
            agoraClass.childNodes[i].classList.add("my-2");

            document
              .getElementById("SmallColumnRight")
              .appendChild(agoraClass.childNodes[i]);
          }
        }
      }
    }
  }
  async function leaveCall() {
    // Destroy the local audio and video tracks.
    if (ORB.client && ORB.localAudioTrack && ORB.localVideoTrack) {
      ORB.localAudioTrack.close();
      ORB.localVideoTrack.close();

      // Leave the channel.
      await ORB.client.leave();
    }
    // socket.disconnect();
    props.history.push("/userHomepage");
    await dispatch(removeOnlineUser());
    await dispatch(deleteStream());
  }

  useEffect(() => {
    if (stateData) {
      let list;
      setTimeout(() => {
        if (stateData.joinedFanList && stateData.joinedFanList.length) {
          // if (stateData.joinedFanList.length >= 15) {
          //   swal("Info", "You cannot communicate with this user", "info");
          // } else {
          setFanList(prevState => [...prevState, stateData.joinedFanList]);
          // }
        } else {
          setFanList(prevState => [...prevState, stateData.joinedFanList]);
        }
      }, 5000);
    }
  }, [stateData]);

  useEffect(() => {
    if (stateUser) {
      // console.log("state user............. ", stateUser);
      if (stateUser.userInfo) {
        setUserDetail(stateUser.userInfo);
      }
    }
  }, [stateUser]);

  let encodedURL = encodeURI(
    `https://jeremysLive.com/${window.location.pathname.slice(1)}`
  );

  const callShortBreak = async () => {
    console.log("callShortBreak fn callled!!!!!!!!!!!!");
    socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);

    socket.emit("storeShortBreak", {
      userId: localStorage.getItem("id"),
      breakValue: !isBreak,
    });
    setIsbreak(!isBreak);

    if (ORB.localAudioTrack && ORB.localVideoTrack) {
      await ORB.localVideoTrack.setEnabled(isBreak);
      await ORB.localAudioTrack.setEnabled(isBreak);
    }
    console.log("is break value... ", isBreak);
  };

  const showTimerModal = () => {
    setShow(true);
    setShowTimer(true);
    setShowTicket(false);
    setShowSeat(false);

    if (time) {
      setTimeOnTicket(time);
    }
  };

  const showSeatModal = () => {
    setShow(true);
    setShowSeat(true);
    setShowTimer(false);
    setShowTicket(false);
  };

  const showTicketModal = () => {
    setShow(true);
    setShowTicket(true);
    setShowSeat(false);
    setShowTimer(false);
    // console.log("time and seat... ", time, seats);
  };
  let ViewersPercent = 0;
  if (subscribedUsers) {
    var x = document.getElementsByClassName("fan_ORB_small_video_idle").length;
    let viewersRatio = x / seats;
    // ViewersPercent = viewersRatio * 100;
    // ViewersPercent = viewersRatio.toFixed(2);
    ViewersPercent = x;
    // console.log("x---", x, "seats---", seats, "percent---", ViewersPercent);
  }

  const shareOnFB = () => {
    console.log(
      "share on fb called.....",
      `https://facebook.com/sharer/sharer.php?u=${encodedURL}`
    );

    window.open(`https://facebook.com/sharer/sharer.php?u=${encodedURL}`);
  };

  const shareOnTwitter = () => {
    console.log(
      "share on twitter.................",
      `https://twitter.com/intent/tweet?url=${encodedURL}`
    );

    window.open(`https://twitter.com/intent/tweet?url=${encodedURL}`);
  };

  const closedBigORB = uid => {
    console.log("closed fn clicked on big column...");

    console.log(
      "main list",
      document.getElementById("fan-remote-playerlist2").childNodes
    );
    const fanRemote = document.getElementById("fan-remote-playerlist2");
    let bigColumnDiv = document.getElementById(`BigColumn`);
    let bigColumnChildNodes = bigColumnDiv.childNodes;
    let leftColumnDiv = document.getElementById(`SmallColumnLeft`);
    let leftColumnChildNodes = leftColumnDiv.childNodes;
    let rightColumnDiv = document.getElementById(`SmallColumnRight`);
    let rightColumnChildNodes = rightColumnDiv.childNodes;
    setFanVideoClicked(false);

    if (bigColumnChildNodes.length) {
      for (let i = 0; i < bigColumnChildNodes.length; i++) {
        if (bigColumnChildNodes[i].id == `player-wrapper-${uid}`) {
          bigColumnChildNodes[i].classList.add("col-md-2");
          bigColumnChildNodes[i].classList.remove("fan_ORB_main_big_video");
          bigColumnChildNodes[i].classList.remove("col-md-12");
          bigColumnChildNodes[i].classList.remove("my-1");
          bigColumnChildNodes[i].classList.add("fan_ORB_main_small_video");
          bigColumnChildNodes[i].classList.add("fan_ORB_small_video_idle");
          bigColumnChildNodes[i].setAttribute(
            "style",
            "height:165px; width: 100%; border-radius:50%;"
          );
          fanRemote.insertBefore(
            bigColumnChildNodes[i],
            fanRemote.childNodes[0]
          );
        }
      }
    }
    // if (leftColumnChildNodes.length) {
    //   for (let i = 0; i < leftColumnChildNodes.length; i++) {
    //     if (
    //       leftColumnChildNodes[i].id !== `player-wrapper-${fanVideoClickedUid}`
    //     ) {
    //       console.log("leftColumnChildNodes[i],", leftColumnChildNodes[i]);
    //       leftColumnChildNodes[i].classList.remove("col-md-6");
    //       leftColumnChildNodes[i].classList.remove("mx-0");
    //       leftColumnChildNodes[i].classList.remove("my-2");
    //       leftColumnChildNodes[i].classList.remove("fan_ORB_main_small_video2");
    //       leftColumnChildNodes[i].classList.remove("my-1");
    //       leftColumnChildNodes[i].classList.add("fan_ORB_main_small_video");
    //       leftColumnChildNodes[i].classList.add("fan_ORB_small_video_idle");
    //       leftColumnChildNodes[i].setAttribute(
    //         "style",
    //         "height:165px; width: 100%; border-radius:50%;"
    //       );
    //       fanRemote.insertBefore(
    //         leftColumnChildNodes[i],
    //         fanRemote.childNodes[0]
    //       );
    //     }
    //   }
    // }
    // if (rightColumnChildNodes.length) {
    //   for (let i = 0; i < rightColumnChildNodes.length; i++) {
    //     if (
    //       rightColumnChildNodes[i].id !== `player-wrapper-${fanVideoClickedUid}`
    //     ) {
    //       rightColumnChildNodes[i].classList.remove("col-md-6");
    //       rightColumnChildNodes[i].classList.remove("mx-0");
    //       rightColumnChildNodes[i].classList.remove("my-2");
    //       rightColumnChildNodes[i].classList.remove("my-1");
    //       rightColumnChildNodes[i].classList.remove(
    //         "fan_ORB_main_small_video2"
    //       );
    //       rightColumnChildNodes[i].classList.add("fan_ORB_main_small_video");
    //       rightColumnChildNodes[i].classList.add("fan_ORB_small_video_idle");
    //       rightColumnChildNodes[i].setAttribute(
    //         "style",
    //         "height:165px; width: 100%; border-radius:50%;"
    //       );
    //       fanRemote.insertBefore(
    //         rightColumnChildNodes[i],
    //         fanRemote.childNodes[0]
    //       );
    //     }
    //   }
    // }
  };

  const showImageModal = () => {
    setImageModal(true);
    setShow(false);
  };

  const closeImageModal = () => {
    setImageModal(false);
    setShow(false);
  };

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
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="modal-ticket"
        aria-labelledby="example-custom-modal-styling-title">
        <Modal.Body style={{padding: "0"}}>
          {showTimer ? (
            <Timer setShow={setShow} setTime={setTime} />
          ) : showSeat ? (
            <Seat
              setShow={setShow}
              setSeats={setSeats}
              setSeatArray={setSeatArray}
            />
          ) : showTicket ? (
            userDetail ? (
              <GenerateTicket
                setShow={setShow}
                seats={seats}
                time={time}
                userDetail={userDetail}
                currentDate={moment().format("YYYY-MM-DD HH:mm")}
                setTicketPrice={setTicketPrice}
              />
            ) : null
          ) : null}
        </Modal.Body>
      </Modal>

      <Modal
        show={imageModal}
        onHide={closeImageModal}
        centered
        dialogClassName="modal-ticket"
        aria-labelledby="example-custom-modal-styling-title">
        <Modal.Body style={{padding: "0"}}>
          {imageModal ? (
            <ScreenShotUpload
              closeImageModal={closeImageModal}
              imageModal={imageModal}
            />
          ) : null}
        </Modal.Body>
      </Modal>
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
          {/* <div className="tips text-center">
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
          </div> */}
          <div className="values">
            <div className="value_container">
              <span className="value_name">Timer</span>
              <p style={{fontWeight: "600"}}>
                {Math.floor(time / 60) < 10
                  ? "0" + Math.floor(time / 60)
                  : Math.floor(time / 60)}
                :{time % 60 < 10 ? "0" + (time % 60) : time % 60}
              </p>
            </div>
            <div className="value_container">
              <span className="value_name">Tip</span>
              {/* <div
                className="progress"
                style={{
                  width: "70px",
                }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${tipRatio / 100}%`,
                  }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div> */}{" "}
              <p>{tipRatio}</p>
            </div>
            <div className="value_container">
              <span className="value_name">Viewers</span>
              {/* <div
                className="progress"
                style={{
                  width: "70px",
                }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: ViewersPercent,
                  }}
                  aria-valuenow={ViewersPercent}
                  aria-valuemin="0"
                  aria-valuemax="100">
                </div>
              </div> */}
              <p>{ViewersPercent}</p>
            </div>
            <div className="value_container">
              <span className="value_name">Ticket Sold</span>
              {/* <div
                className="progress"
                style={{
                  width: "70px",
                }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: `${ticketSold}%`,
                  }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div> */}
              <p>{ticketSold}</p>
            </div>
          </div>
        </div>
      </div>
      {isLive ? (
        <>
          {isLive ? (
            <div
              className="container d-flex justify-content-center mt-1"
              style={{textAlign: "center", height: "100px"}}>
              {/* <div className="ORB_main_cat m-0"> */}
              <img
                src="../assets/images/live-btn.png"
                width="120"
                height="120"
              />
              {/* </div> */}
            </div>
          ) : null}

          <div
            className={`container row ORB_videos_container mx-auto player ${
              subscribedUsers ? "mt-4" : "mt-1"
            }`}>
            {" "}
            {fanVideoClicked ? (
              <>
                <div className="col-md-3">
                  <div className="row" id="SmallColumnLeft"></div>
                </div>
                <div
                  className="col-md-6 d-flex justify-content-center"
                  id="BigColumn"></div>
                <div className="col-md-3">
                  <div className="row" id="SmallColumnRight"></div>
                </div>
                {/* {showDivOnVideoClick()} */}
              </>
            ) : null}
          </div>
          <div
            className={`container row ORB_videos_container mx-auto player ${
              subscribedUsers ? "mt-0" : "mt-1"
            }`}
            id="fan-remote-playerlist2">
            {showEmptyCircles()}
          </div>
          <div
            className="container d-flex justify-content-center"
            style={{textAlign: "center", height: "100px"}}>
            {/* <div className="ORB_main_cat m-0"> */}
            {localStorage.getItem("type") === "star" ||
            localStorage.getItem("type") === "Star" ? (
              isMute ? (
                <img
                  src="../assets/images/Background_r.png"
                  onClick={callRoarFunction}
                  height="120"
                  width="120"
                  style={{cursor: "pointer"}}
                />
              ) : (
                <img
                  src="../assets/images/disableR.png"
                  onClick={callRoarFunction}
                  height="120"
                  width="120"
                  style={{cursor: "pointer"}}
                />
              )
            ) : localStorage.getItem("type") === "trainer" ||
              localStorage.getItem("type") === "Trainer" ? (
              fansFromQ.length ? (
                // fansFromQ.map(fan => {
                //   return (
                <div
                  className="ORB_main_cat"
                  style={{margin: "0", justifyContent: "center"}}>
                  <img
                    src={`${fansFromQ[0].profilePic}`}
                    style={{borderRadius: "50%"}}
                  />
                </div>
              ) : (
                //   );
                // })
                <div className="ORB_main_cat">
                  <img src="../assets/images/button_bg.png" />
                </div>
              )
            ) : (
              <div className="ORB_main_cat">
                <img src="../assets/images/button_bg.png" />
              </div>
            )}

            {/* </div> */}
          </div>
        </>
      ) : null}

      <div className="container row ORB_videos_container mt-5 mx-auto  player">
        {isLive ? null : (
          // showHosts()
          // <div className=" row mt-5 mx-auto" id="fan-remote-playerlist2">
          //   {showHosts()}
          // </div>
          <>
            <div className="ORB_main_cat">
              <img src="../assets/images/button_bg.png" />
            </div>
            <div className="ORB_main_cat">
              <img src="../assets/images/button_bg.png" />
            </div>
            <div className="ORB_main_cat">
              <img src="../assets/images/button_bg.png" />
            </div>
            {isLive ? (
              <div className="ORB_main_cat">
                {isLive ? (
                  <img src="../assets/images/live-btn.png" />
                ) : (
                  <img src="../assets/images/Background.png" />
                )}
              </div>
            ) : (
              <div
                className="ORB_main_cat"
                style={{cursor: "pointer"}}
                onClick={callGoToLive}>
                {isLive ? (
                  <img src="../assets/images/live-btn.png" />
                ) : (
                  <img src="../assets/images/Background.png" />
                )}
              </div>
            )}

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
          </>
        )}
        {/* <div className="ORB_main_cat">
          <img src="../assets/images/disableR.png" onClick={callRoarFunction} />
        </div> */}
      </div>
      {/* <div className="container row ORB_videos_container justify-content-center align-center mx-auto">
      </div> */}

      <div className="container justify-content-center d-flex ORB_links">
        {isLive ? (
          <a style={{cursor: "no-drop"}}>
            <div className="ORB_link d-flex flex-column">
              <img src="../assets/images/ticket.png" />
              <p>Ticket</p>
            </div>
          </a>
        ) : (
          <a style={{cursor: "pointer"}} onClick={showTicketModal}>
            <div className="ORB_link d-flex flex-column">
              <img src="../assets/images/ticket.png" />
              <p>Ticket</p>
            </div>
          </a>
        )}
        {isLive ? (
          <a style={{cursor: "no-drop"}}>
            <div className="ORB_link d-flex flex-column">
              <img src="../assets/images/seat.png" />
              <p>Seats</p>
            </div>
          </a>
        ) : (
          <a style={{cursor: "pointer"}} onClick={showSeatModal}>
            <div className="ORB_link d-flex flex-column">
              <img src="../assets/images/seat.png" />
              <p>Seats</p>
            </div>
          </a>
        )}

        {isLive ? (
          <a onClick={showImageModal}>
            <div className="ORB_link d-flex flex-column">
              <img src="../assets/images/take_picture.png" />
              <p>Take Picture</p>
            </div>
          </a>
        ) : (
          <a style={{cursor: "no-drop"}}>
            <div className="ORB_link d-flex flex-column">
              <img src="../assets/images/take_picture.png" />
              <p>Take Picture</p>
            </div>
          </a>
        )}

        <a
          style={{cursor: isLive ? "no-drop" : "pointer"}}
          onClick={showTimerModal}>
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/time.png" />
            <p>
              Show Time <br /> Duration
            </p>
          </div>
        </a>
        {isLive ? (
          <a style={{cursor: "pointer"}} onClick={callShortBreak}>
            <div className="ORB_link d-flex flex-column">
              <img src="../assets/images/short_break.png" />
              <p>Short Break</p>
            </div>
          </a>
        ) : (
          <a style={{cursor: "no-drop"}}>
            <div className="ORB_link d-flex flex-column">
              <img src="../assets/images/short_break.png" />
              <p>Short Break</p>
            </div>
          </a>
        )}

        <a ref={ref}>
          <div
            className="ORB_link d-flex flex-column dropup"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            onClick={() => setMoreIcon()}>
            <img
              src="../assets/images/share.png"
              style={
                isOpen
                  ? {
                      boxShadow: "0 0 10px 2px #ddd",
                      cursor: "pointer",
                      borderRadius: "100%",
                    }
                  : {cursor: "pointer"}
              }
            />
            <p>Share</p>
            <div
              className={menuClass}
              style={{
                background: "#333333",
                borderRadius: "10px",
                verticalAlign: "middle",
              }}>
              <ul className="menu_item d-flex m-0 justify-content-between px-3 align-items-center">
                {" "}
                <li
                  className="menu more_list "
                  style={{listStyleType: "none"}}
                  // onClick={() => props.history.push("/profile")}
                >
                  <a style={{cursor: "pointer"}} onClick={shareOnFB}>
                    {" "}
                    <span
                      className="fab fa-facebook-square"
                      style={{fontSize: "25px"}}></span>
                  </a>
                </li>
                <li
                  className="menu more_list"
                  style={{listStyleType: "none"}}
                  // onClick={() => props.history.push("/myStory")}
                >
                  {" "}
                  <a style={{cursor: "pointer"}} onClick={shareOnTwitter}>
                    <span
                      className="fab fa-twitter-square"
                      style={{fontSize: "25px"}}></span>{" "}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </a>

        {/* <a>
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/tip.png" />
            <p>Tip</p>
          </div>
        </a> */}
        <a>
          <div className="ORB_link d-flex flex-column" onClick={leaveCall}>
            <img src="../assets/images/exit.png" />
            <p>Exit</p>
          </div>
        </a>
      </div>
    </div>
  );
}

export default ORBPage;

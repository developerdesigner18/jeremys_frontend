import React, {useEffect, useState, useRef} from "react";
import html2canvas from "html2canvas";
import {useDispatch, useSelector} from "react-redux";
import "../../assets/css/ORB.css";
import AgoraRTC from "agora-rtc-sdk-ng";
// import {socket} from "../../socketIO";
import socketIOClient from "socket.io-client";
import axios from "axios";
import swal from "sweetalert";
import {useHistory} from "react-router-dom";
import AddRating from "../Rating/AddRating";
import {
  storeScreenShot,
  getUserToken,
  joinedFan,
  removedJoinFan,
  getLiveStream,
} from "../../actions/orbActions";
import Ticket from "../ORBTicketComponents/Ticket";
import Receipt from "../ORBTicketComponents/Receipt";
import Tip from "../ORBTicketComponents/Tip";

import Modal from "react-bootstrap/Modal";
import {socket} from "../../socketIO";

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
let hostUser = [];

function SingleUserORBPage(props) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [availableList, setAvailableList] = useState([]);
  const [host, setHost] = useState([]);
  const ref = useRef();
  const [closeModalBool, setCloseModalBool] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [time, setTime] = useState(180);
  const [col1, setCol1] = useState(false);
  const [col2, setCol2] = useState(false);
  const [paid, setPaid] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [streamObj, setStreamObj] = useState({});
  const [videoPause, setVideoPause] = useState(false);
  const [audioPause, setAudioPause] = useState(false);
  const [rValue, setRvalue] = useState(false);
  const [hostId, setHostId] = useState("");
  const [hostBreak, setHostBreak] = useState(false);

  let socketIO;

  const menuClass = `dropdown-menu${isOpen ? " show" : ""}`;
  const setMoreIcon = () => {
    setIsOpen(!isOpen);
  };
  const history = useHistory();
  const [fanRTC, setFanRTC] = useState({
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  });
  let encodedURL = encodeURI(
    `${process.env.REACT_APP_SOCKET_URL}${window.location.pathname.slice(1)}`
  );

  const [options, setOptions] = useState({
    appId: `${process.env.REACT_APP_AGORA_APP_ID}`,
    channel: null,
    token: null,
    role: availableList
      ? availableList.length === 0
        ? "host"
        : "audience"
      : "audience",
  });
  const orbState = useSelector(state => state.ORB);
  const stateUser = useSelector(state => state.user);
  const remoteUsers = {};
  const rtc = {
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  };

  const [show, setShow] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const handleClose = () => {
    setShow(false);
    setIsActive(true);
  };
  const handleShow = () => {
    setIsActive(false);
    setShow(true);
    setShowTip(false);
  };

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    } else if (isActive && time == 0) {
      setShowRatingModal(true);
    }
    return () => clearInterval(interval);
  }, [time, isActive]);

  useOutsideClick(ref, () => {
    setIsOpen(false);
  });

  useEffect(async () => {
    socketIO = socketIOClient.connect(process.env.REACT_APP_SOCKET_URL);
    console.log("socket io.......", socketIO);
    console.log("props type... ", props.location.state.type);

    socketIO.emit("storeLiveFans", localStorage.getItem("id"));

    if (
      "star" == props.location.state.type ||
      "Star" == props.location.state.type
    ) {
      socketIO.on("getRvalue", data => {
        console.log("r value data.. ", data);

        data.forEach(async value => {
          if (value.userId == props.location.state.id) {
            setRvalue(value.rValue);

            // if (value.rValue === false) {
            //   if (fanRTC.localAudioTrack)
            //     await fanRTC.localAudioTrack.setEnabled(value.rValue);
            //   rtc.localAudioTrack.setEnabled(value.rValue);
            // }
          }
        });
      });
    } else if ("trainer" == props.type || "Trainer" == props.type) {
    }

    socketIO.on("getShortBreakValue", data => {
      console.log("short break data...", data);

      const foundUser = data.find(
        ({userId}) => userId === props.location.state.id
      );
      if (foundUser) {
        setHostBreak(foundUser.breakValue);
      }
    });

    document.documentElement.scrollTop = 0;
    await dispatch(getLiveStream(props.location.state.id));

    window.addEventListener("beforeunload", async ev => {
      console.log("before unload evenet called ", ev);

      const dataToPass = {
        fanId: localStorage.getItem("id"),
        userId: props.location.state.id,
      };
      await dispatch(removedJoinFan(dataToPass));
      await leaveCallFromFan();

      ev.returnValue = "Live streaming will be closed. Sure you want to leave?";
      return ev.returnValue;
    });
  }, []);

  useEffect(async () => {
    let id, role;

    console.log("props............ ", props);
    if (
      props.location.state.id &&
      props.location.state.name &&
      props.location.state.role
    ) {
      id = props.location.state.id;
      role = props.location.state.role;
      const dataToPass = {
        userId: id,
        fanId: localStorage.getItem("id"),
      };
      await dispatch(joinedFan(dataToPass));

      axios
        .get(`${process.env.REACT_APP_API_URL}api/agora/getUserToken?id=${id}`)
        .then(async result => {
          console.log("result.......... ", result);
          let hostUidResponse = result.data.data.uid;
          setHostId(hostUidResponse);

          if (result.data.data.agoraToken) {
            const token = result.data.data.agoraToken;
            rtc.client = AgoraRTC.createClient({
              mode: "live",
              codec: "vp8",
            });
            await rtc.client.setClientRole(role);
            const uid = await rtc.client.join(
              process.env.REACT_APP_AGORA_APP_ID,
              id,
              token,
              null
            );
            setFanRTC(prevState => ({
              ...prevState,
              client: rtc.client,
            }));
            rtc.client.on("user-published", async (user, mediaType) => {
              console.log("handleUserPublished-==-=-=", user.uid);

              const id = user.uid;
              remoteUsers[id] = user;

              let agoraClass = document.getElementById(
                "user-remote-playerlist"
              );

              const remote = await rtc.client.subscribe(user, mediaType);
              hostUser.push(id);
              // const uniqueArray = hostUser.filter(function (item, pos) {
              //   return hostUser.indexOf(item) == pos;
              // });
              // setHost(uniqueArray);
              // console.log("unique array.......... ", uniqueArray);

              if (hostUser.length) {
                console.log("host.............", hostUser);
                hostUser.map((host, i) => {
                  if (parseInt(host) !== parseInt(hostUidResponse)) {
                    if (i % 2 !== 0) {
                      console.log("i % 2 == 0", i, i % 2 !== 0);
                      let generatedDiv = document.getElementById(
                        `player-wrapper-${user.uid}`
                      );
                      if (generatedDiv) {
                        generatedDiv.remove();
                      }
                      let playerWrapper = document.createElement("div");
                      playerWrapper.setAttribute(
                        "id",
                        `player-wrapper-${user.uid}`
                      );
                      playerWrapper.classList.add("col-md-6");
                      playerWrapper.classList.add("fan_ORB_main_cat");
                      playerWrapper.setAttribute(
                        "style",
                        "height:165px; width: 115px; border-radius:50%;"
                      );
                      document
                        .getElementById("other-fan-remote")
                        .appendChild(playerWrapper);
                      if (mediaType == "video") {
                        user.videoTrack.play(`player-wrapper-${user.uid}`);
                        // if (mediaType === "audio") {
                        // user.audioTrack.play();
                        // }
                      } else {
                        console.log(
                          "media-reconnect-start event will be called.............",
                          uid
                        );
                        rtc.client.on(
                          "media-reconnect-start",
                          uid
                          //  => {
                          //   console.log(
                          //     "media-reconnect-start event called.............",
                          //     uid
                          //   );
                          // }
                        );
                      }
                    } else {
                      console.log(
                        "i % 2 == 0 else................",
                        i,
                        i % 2 !== 0
                      );
                      let generatedDiv = document.getElementById(
                        `player-wrapper-${user.uid}`
                      );
                      if (generatedDiv) {
                        generatedDiv.remove();
                      }
                      let playerWrapper = document.createElement("div");
                      playerWrapper.setAttribute(
                        "id",
                        `player-wrapper-${user.uid}`
                      );
                      playerWrapper.classList.add("col-md-6");
                      playerWrapper.classList.add("fan_ORB_main_cat");
                      playerWrapper.setAttribute(
                        "style",
                        "height:165px; width: 115px; border-radius:50%;"
                      );
                      document
                        .getElementById("other-fan-remote1")
                        .appendChild(playerWrapper);
                      if (mediaType == "video") {
                        user.videoTrack.play(`player-wrapper-${user.uid}`);
                      } else {
                        rtc.client.on(
                          "media-reconnect-start",
                          uid
                          // => {
                          //   console.log(
                          //     "media-reconnect-start event called.............",
                          //     uid
                          //   );
                          // }
                        );
                      }
                    }
                  } else {
                    console.log("host-=-=-=", host, host == hostUidResponse);
                    let generatedDiv = document.getElementById(
                      `player-wrapper-${user.uid}`
                    );
                    if (generatedDiv) {
                      generatedDiv.remove();
                    }
                    let playerWrapper = document.createElement("div");
                    playerWrapper.setAttribute(
                      "id",
                      `player-wrapper-${user.uid}`
                    );

                    playerWrapper.setAttribute(
                      "style",
                      " height: 500px;width: 500px;border-radius:50%;"
                    );
                    agoraClass.appendChild(playerWrapper);
                    console.log("remote user media type... ", mediaType);

                    if (mediaType == "video") {
                      user.videoTrack.play(playerWrapper);
                    }
                    if (mediaType == "audio") {
                      user.audioTrack.play();
                    }
                    // else {
                    //   rtc.client.on("media-reconnect-start", uid => {
                    //     console.log(
                    //       "media-reconnect-start event called.............",
                    //       uid
                    //     );
                    //   });
                    // }
                  }
                });
              }
            });
            rtc.client.on("user-unpublished", async (user, mediaType) => {
              let generatedDiv = document.getElementById(
                `player-wrapper-${user.uid}`
              );
              if (generatedDiv) {
                generatedDiv.remove();
              }
              console.log("handleUserUnpublished-==-=-=", user.uid);
              setTimeout(() => {
                const id = user.uid;
                delete remoteUsers[id];

                let index = hostUser.indexOf(id);
                if (index > -1) {
                  hostUser.splice(index, 1);
                }
              }, 180000);
            });

            // Create an audio track from the audio sampled by a microphone.
            // rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            // setFanRTC(prevState => ({
            //   ...prevState,
            //   localAudioTrack: rtc.localAudioTrack,
            // }));
            // Create a video track from the video captured by a camera.
            rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
            setFanRTC(prevState => ({
              ...prevState,
              localVideoTrack: rtc.localVideoTrack,
            }));

            rtc.localVideoTrack.play("local-player");
            // rtc.localAudioTrack.play();

            // Publish the local audio and video tracks to the channel.
            await rtc.client.publish([rtc.localVideoTrack]);
          }
        })
        .catch(error => {
          console.log("error........", error);
        });
    }
  }, [props.location.state.id]);

  useEffect(() => {
    if (orbState) {
      console.log("orb state........... ", orbState);
      if (orbState.getLiveStreamData) {
        if (paid) {
          setTime(orbState.getLiveStreamData.timer);
        } else if (orbState.getLiveStreamData.price == 0) {
          setTime(orbState.getLiveStreamData.timer);
        } else if (orbState.getLiveStreamData.price !== 0) {
          setTime(180);
        }
        setStreamObj(orbState.getLiveStreamData);
      }
    }
  }, [orbState]);

  const getImage = () => {
    console.log("fn called");
    html2canvas(document.querySelector("#capture"), {
      allowTaint: true,
      scrollX: 0,
      scrollY: -window.scrollY,
    }).then(canvas => {
      let file;
      canvas.toBlob(async blob => {
        file = new File([blob], "fileName.jpg", {type: "image/jpeg"});
        let fd = new FormData();
        fd.append("id", localStorage.getItem("id"));
        fd.append("image", file);
        fd.append("starName", "starName");

        await dispatch(storeScreenShot(fd));
      });
    });
  };

  async function leaveCallFromFan() {
    console.log("leave call fn called in fan orb page of star/trainer");
    // Destroy the local audio and video tracks.

    if (fanRTC.client && fanRTC.localVideoTrack) {
      fanRTC.localVideoTrack.close();
      // fanRTC.localAudioTrack.close();

      // Leave the channel.
      await fanRTC.client.leave();
    }
    const dataToPass = {
      fanId: localStorage.getItem("id"),
      userId: props.location.state.id,
    };
    await dispatch(removedJoinFan(dataToPass));
    setShowRatingModal(true);
  }

  const closeModal = async () => {
    console.log("close modal.......");
    if (fanRTC.client && fanRTC.localVideoTrack && fanRTC.localAudioTrack) {
      fanRTC.localVideoTrack.close();
      fanRTC.localAudioTrack.close();

      // Leave the channel.
      await fanRTC.client.leave();
    }
    const dataToPass = {
      fanId: localStorage.getItem("id"),
      userId: props.location.state.id,
    };
    await dispatch(removedJoinFan(dataToPass));
    setShowRatingModal(false);
    setCloseModalBool(true);
    props.history.push("/fanHomePage");
  };

  const handleTipModal = async () => {
    console.log("handle tip modal fn called.......... ");

    setShowTip(!showTip);
    setShow(false);
    setIsActive(false);
  };

  const closeTip = () => {
    setShowTip(false);
  };

  const callVideoPause = async () => {
    console.log("call video pause fn... ");
    setVideoPause(!videoPause);

    if (fanRTC.localVideoTrack) {
      await fanRTC.localVideoTrack.setEnabled(videoPause);
    }
  };

  const callAudioPause = async () => {
    console.log("call audio pause fn... ");
    setAudioPause(!audioPause);
    // if (rValue) {
    //   rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    //   setFanRTC(prevState => ({
    //     ...prevState,
    //     localAudioTrack: rtc.localAudioTrack,
    //   }));
    // }
    if (fanRTC.localAudioTrack) {
      await fanRTC.localAudioTrack.setEnabled(audioPause);
    }
    console.log(audioPause);
  };

  const callQFunction = async () => {
    socketIO = socketIOClient.connect(process.env.REACT_APP_SOCKET_URL);
    const dataToPass = {
      userId: props.location.state.id,
      fanObj: {
        id: localStorage.getItem("id"),
        uid: hostId,
        profilePic: stateUser.userInfo.data.profileImgURl,
      },
    };
    socketIO.emit("storeQvalue", dataToPass);
  };

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

  const onRclick = async () => {
    if (rValue) {
      if (fanRTC.localAudioTrack) {
        await fanRTC.localAudioTrack.setEnabled(rValue);
      } else {
        rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        setFanRTC(prevState => ({
          ...prevState,
          localAudioTrack: rtc.localAudioTrack,
        }));
      }
    } else {
      if (fanRTC.localAudioTrack) {
        await fanRTC.localAudioTrack.setEnabled(rValue);
      }
    }
  };

  return (
    <div
      style={{
        background: "url('../assets/images/background_black.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
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
          {paid ? (
            <Receipt
              setShow={setShow}
              text="star/trainer"
              streamId={streamObj ? streamObj._id : ""}
              userId={props.location.state.id}
            />
          ) : (
            <Ticket
              setShow={setShow}
              setPaid={setPaid}
              streamObj={streamObj}
              userId={props.location.state.id}
            />
          )}
        </Modal.Body>
      </Modal>
      <Modal
        show={showTip}
        onHide={closeTip}
        centered
        dialogClassName="modal-ticket"
        aria-labelledby="example-custom-modal-styling-title">
        {showTip ? (
          <Tip
            setShow={setShow}
            streamId={streamObj ? streamObj._id : ""}
            userId={props.location.state.id}
            setPaid={setPaid}
            setShowTip={setShowTip}
          />
        ) : null}
      </Modal>
      <div className="main_ORB_section container pt-5 mt-5 d-flex">
        <div className="ORB_logo">
          <img src="../assets/images/grey_logo.png" />
        </div>
        <div className="ORB_live_container d-flex" id="local-player">
          <div
            className="FAN_ORB_video_live d-flex position-relative"
            style={{
              boxShadow: "inset 3px 5px 5px #595959",
            }}></div>
        </div>
        <div className="ORB_tips_info d-flex">
          <div className="tips text-center">
            {/* <div className="lights">
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
            <div className="title_tips">Tips</div> */}
          </div>
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
          </div>
        </div>
      </div>
      <div className="  row justify-content-center mx-auto  mt-5">
        <div className="col-md-3">
          <div className="row" id="other-fan-remote1"></div>
        </div>
        <div className="col-md-6 text-center">
          <div
            className="border border-light rounded-circle mx-auto mb-3"
            id="user-remote-playerlist"
            style={{
              height: "500px",
              width: "500px",
              borderRadius: "100%",
            }}>
            <div style={{zIndex: "2"}} className="break_display_text">
              <img src="../assets/images/black_logo.png" alt="logo" />

              <p style={{justifyContent: "center"}}>
                {hostBreak ? "will be back in…" : ""}
              </p>
            </div>
          </div>

          <div className="r_image">
            {props.location.state.type == "trainer" ||
            props.location.state.type == "Trainer" ? (
              <img
                src="../assets/images/Qcolor.png"
                className="m-0"
                onClick={callQFunction}
              />
            ) : props.location.state.type == " star" ||
              props.location.state.type == "Star" ? (
              rValue ? (
                <img
                  src="../assets/images/Applause_bold with_roar.png"
                  style={{height: "100px", width: "100px", cursor: "pointer"}}
                  onClick={onRclick}
                />
              ) : (
                <img
                  src="../assets/images/disableR.png"
                  style={{height: "80px", width: "80px"}}
                />
              )
            ) : (
              <img
                src="../assets/images/Qcolor.png"
                style={{height: "80px", width: "80px"}}
                onClick={callQFunction}
              />
            )}
          </div>
          <div className="container justify-content-center d-flex ORB_links mt-5">
            {streamObj.price == 0 ? (
              <a style={{cursor: "no-drop"}}>
                <div className="ORB_link d-flex flex-column">
                  <img src="../assets/images/ticket.png" />
                  <p>Ticket</p>
                </div>
              </a>
            ) : (
              <a style={{cursor: "pointer"}} onClick={handleShow}>
                <div className="ORB_link d-flex flex-column">
                  <img src="../assets/images/ticket.png" />
                  <p>Ticket</p>
                </div>
              </a>
            )}

            {/* <a href="#">
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/seat.png" />
                <p>Seat</p>
              </div>
            </a> */}
            <a onClick={getImage} style={{cursor: "pointer"}}>
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/take_picture.png" />
                <p>Take Picture</p>
              </div>
            </a>
            {rValue ? (
              <a style={{cursor: "pointer"}} onClick={callAudioPause}>
                <div className="ORB_link d-flex flex-column">
                  <img src="../assets/images/audio.png" />
                  <p>Audio</p>
                </div>
              </a>
            ) : (
              <a style={{cursor: "no-drop"}}>
                <div className="ORB_link d-flex flex-column">
                  <img src="../assets/images/audio.png" />
                  <p>Audio</p>
                </div>
              </a>
            )}
            <a style={{cursor: "pointer"}} onClick={callVideoPause}>
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/camera.png" />
                <p>Camera</p>
              </div>
            </a>
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
                  <ul className="menu_item d-flex flex-row m-0 justify-content-between px-3 align-items-center">
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

            <a style={{cursor: "pointer"}} onClick={handleTipModal}>
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/tip.png" />
                <p>Tip</p>
              </div>
            </a>
            <a
              style={{cursor: "pointer"}}
              onClick={() => {
                leaveCallFromFan();
              }}>
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/exit.png" />
                <p>Exit</p>
              </div>
            </a>
          </div>
        </div>
        <div className="col-md-3 ">
          <div className="row" id="other-fan-remote"></div>
        </div>
      </div>
      {showRatingModal ? (
        <div className="reviewFan">
          <AddRating
            userId={props.location.state.id}
            itemDetail="Ticket"
            closeModal={closeModal}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default SingleUserORBPage;

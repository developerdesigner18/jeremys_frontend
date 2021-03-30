import React, {useEffect, useState, useRef} from "react";
import html2canvas from "html2canvas";
import {useDispatch, useSelector} from "react-redux";
import "../../assets/css/ORB.css";
import AgoraRTC from "agora-rtc-sdk-ng";
import {socket} from "../../socketIO";
import axios from "axios";
import swal from "sweetalert";
import {useHistory} from "react-router-dom";
import AddRating from "../Rating/AddRating";
import {
  storeScreenShot,
  getUserToken,
  joinedFan,
  removedJoinFan,
} from "../../actions/orbActions";
import Ticket from "../ORBTicketComponents/Ticket";
import Receipt from "../ORBTicketComponents/Receipt";
import Tip from "../ORBTicketComponents/Tip";

import Modal from "react-bootstrap/Modal";

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

function SingleUserORBPage(props) {
  const [isLive, setIsLive] = useState(false);
  const videoRef = useRef();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [availableList, setAvailableList] = useState([]);
  const [host, setHost] = useState([]);
  const [remoteId, setRemoteId] = useState("");
  const ref = useRef();
  const [closeModalBool, setCloseModalBool] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [time, setTime] = useState(180);
  const [col1, setCol1] = useState(false);
  const [col2, setCol2] = useState(false);
  const [paid, setPaid] = useState(false);
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
    `${process.env.REACT_APP_API_URL}${window.location.pathname.slice(1)}`
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
  const remoteUsers = {};
  const rtc = {
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  };

  const [show, setShow] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  React.useEffect(async () => {
    if (time > 0) {
      setTimeout(() => setTime(time - 1), 1000);
    } else {
      setTime(0);
      setShowRatingModal(true);
    }
  });

  useOutsideClick(ref, () => {
    setIsOpen(false);
  });

  useEffect(async () => {
    socket.emit("storeLiveFans", localStorage.getItem("id"));
    document.documentElement.scrollTop = 0;
    await dispatch(getUserToken(props.location.state.id));

    window.addEventListener("beforeunload", async ev => {
      console.log("before unload evenet called ", ev);

      const dataToPass = {
        fanId: localStorage.getItem("id"),
        userId: props.location.state.id,
      };
      await dispatch(removedJoinFan(dataToPass));

      ev.returnValue = "Live streaming will be closed. Sure you want to leave?";
      return ev.returnValue;
    });
  }, []);

  let hostUser = [];
  useEffect(async () => {
    let id, role;
    let token;

    console.log("props............ ", props);
    if (
      props.location.state.id &&
      props.location.state.name &&
      props.location.state.role
    ) {
      const dataToPass = {
        userId: props.location.state.id,
        fanId: localStorage.getItem("id"),
      };
      await dispatch(joinedFan(dataToPass));
      id = props.location.state.id;
      role = props.location.state.role;
      setRemoteId(id);

      axios
        .get(`${process.env.REACT_APP_API_URL}api/agora/getUserToken?id=${id}`)
        .then(async result => {
          setOptions({
            ...options,
            token: result.data.data.agoraToken,
            channel: id,
          });

          if (result.data.data.agoraToken) {
            token = result.data.data.agoraToken;
            rtc.client = AgoraRTC.createClient({mode: "live", codec: "vp8"});
            setFanRTC(prevState => ({...prevState, client: rtc.client}));
            await rtc.client.setClientRole(role);

            const uid = await rtc.client.join(options.appId, id, token, null);
            console.log("Meeting Joined-==-=-=", rtc.client);
            rtc.client.on("user-published", async (user, mediaType) => {
              console.log("handleUserPublished-==-=-=", user.uid);

              const id = user.uid;
              remoteUsers[id] = user;

              let agoraClass = document.getElementById(
                "user-remote-playerlist"
              );

              const remote = await rtc.client.subscribe(user, mediaType);
              hostUser.push(id);
              const uniqueArray = hostUser.filter(function (item, pos) {
                return hostUser.indexOf(item) == pos;
              });
              setHost(uniqueArray);
              console.log("unique array.......... ", uniqueArray);

              if (mediaType === "video") {
                user.videoTrack.play(`user-remote-playerlist`);
              }
              if (mediaType === "audio") {
                user.audioTrack.play();
              }

              if (hostUser.length > 2) {
                console.log("host.............", hostUser);
                hostUser.map((host, i) => {
                  if (i > 1) {
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
                        "height:160px; width: 160px; border-radius:50%;"
                      );
                      document
                        .getElementById("other-fan-remote")
                        .appendChild(playerWrapper);
                      user.videoTrack.play(`player-wrapper-${user.uid}`);
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
                        "height:160px; width: 160px; border-radius:50%;"
                      );
                      document
                        .getElementById("other-fan-remote1")
                        .appendChild(playerWrapper);
                      user.videoTrack.play(`player-wrapper-${user.uid}`);
                    }
                  }
                });
              }
            });
            rtc.client.on("user-unpublished", async (user, mediaType) => {
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
            rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            setFanRTC(prevState => ({
              ...prevState,
              localAudioTrack: rtc.localAudioTrack,
            }));
            // Create a video track from the video captured by a camera.
            rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
            setFanRTC(prevState => ({
              ...prevState,
              localVideoTrack: rtc.localVideoTrack,
            }));

            rtc.localVideoTrack.play("local-player");
            rtc.localAudioTrack.play();

            // Publish the local audio and video tracks to the channel.
            await rtc.client.publish([rtc.localVideoTrack]);
          }
        })
        .catch(error => {
          console.log("error........", error);
        });
    }
  }, [props.location.state.id && props.location.state.name]);

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
            <Receipt setShow={setShow} />
          ) : showTip ? (
            <Tip setShow={setShow} />
          ) : (
            <Ticket setShow={setShow} paid={paid} setPaid={setPaid} />
          )}
        </Modal.Body>
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
            }}>
            {/* <video ref={videoRef} autoPlay></video> */}
          </div>
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
          {/* {host.length === 2 ? (
            <div
              className="border border-light rounded-circle mx-auto mb-3"
              id="user-remote-playerlist"
              style={{
                height: "500px",
                width: "500px",
                borderRadius: "100%",
              }}></div>
          ) : (
            <></>
          )} */}
          <div
            className="border border-light rounded-circle mx-auto mb-3"
            id="user-remote-playerlist"
            style={{
              height: "500px",
              width: "500px",
              borderRadius: "100%",
            }}></div>
          <div className="r_image">
            {isLive ? (
              <img
                src="../assets/images/r_image.png"
                style={{height: "80px", width: "80px"}}
              />
            ) : (
              <img
                src="../assets/images/disableR.png"
                style={{height: "80px", width: "80px"}}
              />
            )}
          </div>
          <div className="container justify-content-center d-flex ORB_links mt-5">
            <a style={{cursor: "no-drop"}}>
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/ticket.png" />
                <p>Ticket</p>
              </div>
            </a>
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
            <a href="#">
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/audio.png" />
                <p>Audio</p>
              </div>
            </a>
            <a href="#">
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
                      <a
                        href={`https://facebook.com/sharer/sharer.php?u=${encodedURL}`}>
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
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodedURL}`}>
                        <span
                          className="fab fa-twitter-square"
                          style={{fontSize: "25px"}}></span>{" "}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </a>

            {/* <a href="#">
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/tip.png" />
                <p>Tip</p>
              </div>
            </a> */}
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

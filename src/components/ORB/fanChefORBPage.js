import React, { useEffect, useState, useRef } from "react";
import "../../assets/css/chefORB.css";
import html2canvas from "html2canvas";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import AddRating from "../Rating/AddRating";
import { socket } from "../../socketIO";
import Ticket from "../ORBTicketComponents/Ticket";
import Receipt from "../ORBTicketComponents/Receipt";

import Modal from "react-bootstrap/Modal";

import {
  storeScreenShot,
  getStreamDetails,
  joinedFan,
  removedJoinFan,
  getJoinedFanList,
} from "../../actions/orbActions";
import { getUserWithId } from "../../actions/userActions";

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
function FanChefORB(props) {
  const [userInfo, setUserInfo] = useState({});
  const [streamDetails, setStreamDetails] = useState({});
  const [banner1Img, setBanner1Img] = useState("");
  const [banner2Img, setBanner2Img] = useState("");
  const [item1Image, setItem1Image] = useState("");
  const [item2Image, setItem2Image] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [closeModalBool, setCloseModalBool] = useState(false);
  const [paid, setPaid] = useState(false);
  const [joinedFanList, setJoinedFanList] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (subscribed) {
      setShow(true);
    }
  };
  const menuClass = `dropdown-menu${isOpen ? " show" : ""}`;
  const setMoreIcon = () => {
    setIsOpen(!isOpen);
  };
  let encodedURL = encodeURI(
    `${process.env.REACT_APP_API_URL}${window.location.pathname.slice(1)}`
  );
  const dispatch = useDispatch();
  const stateData = useSelector(state => {
    return state.user;
  });
  const StreamData = useSelector(state => state.ORB);
  useOutsideClick(ref, () => {
    setIsOpen(false);
  });
  const history = useHistory();
  const [time, setTime] = useState(180);
  const [stream, setStream] = useState(false);

  const remoteUsers = {};
  const [chefRTC, setChefRTC] = useState({
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  });
  const rtc = {
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  };
  const [options, setOptions] = useState({
    appId: `${process.env.REACT_APP_AGORA_APP_ID}`,
    channel: null,
    token: null,
    role: "audience",
  });

  React.useEffect(async () => {
    if (time > 0) {
      setTimeout(() => setTime(time - 1), 1000);
    } else {
      setTime(0);
      setShowRating(true);
    }
  });

  const getImage = () => {
    console.log("fn called");
    html2canvas(document.querySelector("#capture1"), {
      allowTaint: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      useCORS: true,
    }).then(canvas => {
      let file;
      // console.log('canvas',canvas.toBlob());
      canvas.toBlob(async blob => {
        file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
        let fd = new FormData();
        fd.append("id", localStorage.getItem("id"));
        fd.append("image", file);
        fd.append("starName", "starName");

        await dispatch(storeScreenShot(fd));
      });
    });
  };

  useEffect(async () => {
    document.documentElement.scrollTop = 0;
    let id, name;
    if (localStorage.getItem("token"))
      await dispatch(getUserWithId(localStorage.getItem("id")));
    if (props.location.state.name && props.location.state.id) {
      id = props.location.state.id;
      name = props.location.state.name;
      await dispatch(getStreamDetails({ userId: id }));
    }

    socket.emit("storeLiveFans", localStorage.getItem("id"));
    // if (props.location.state.name) {
    await axios
      .get(`${process.env.REACT_APP_API_URL}api/agora/getUserToken?id=${id}`)
      .then(async result => {
        setOptions({ ...options, token: result.data.data.agoraToken });
        if (result.data.data.agoraToken) {
          const token = result.data.data.agoraToken;
          rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
          console.log("agora token ", token);
          await rtc.client.join(
            process.env.REACT_APP_AGORA_APP_ID,
            id,
            token,
            null
          );
          setChefRTC(prevState => ({
            ...prevState,
            client: rtc.client,
          }));

          rtc.client.on("user-published", async (user, mediaType) => {
            console.log("user-published!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

            // Subscribe to a remote user.
            let agoraClass = document.getElementById("fan-playerlist");
            console.log("agora calss............. ", agoraClass);
            // if (agoraClass.childElementCount == 0) {
            await rtc.client.subscribe(user, mediaType);
            console.log("subscribe success-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

            if (mediaType === "video") {
              setSubscribed(true);
              user.videoTrack.play(`fan-playerlist`);
            }
            if (mediaType === "audio") {
              user.audioTrack.play();
            }
            // }
          });

          rtc.client.on("user-unpublished", async (user, mediaType) => {
            console.log("handleUserUnpublished chef/stylist-==-=-=", user.uid);

            // if (
            //   chefRTC.client &&
            //   chefRTC.localVideoTrack &&
            //   chefRTC.localAudioTrack
            // ) {
            //   chefRTC.localAudioTrack.close();
            //   chefRTC.localVideoTrack.close();

            //   // Leave the channel.
            //   await chefRTC.client.leave();
            // }

            // props.history.push("/fanHomePage");
          });

          // Create an audio track from the audio sampled by a microphone.
          rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
          setChefRTC(prevState => ({
            ...prevState,
            localAudioTrack: rtc.localAudioTrack,
          }));

          // Create a video track from the video captured by a camera.
          rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
          setChefRTC(prevState => ({
            ...prevState,
            localVideoTrack: rtc.localVideoTrack,
          }));

          rtc.localVideoTrack.play("local-player");
          rtc.localAudioTrack.play();

          // Publish the local audio and video tracks to the channel.
          await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
        }
      })
      .catch(err => console.log("error ", err));
    // }
    const dataToPass = {
      userId: id,
      fanId: localStorage.getItem("id"),
    };
    await dispatch(joinedFan(dataToPass));
  }, [props.location.state.id && props.location.state.name]);

  useEffect(async () => {
    if (stateData) {
      if (stateData.userInfo) {
        setUserInfo(stateData.userInfo.data);
      }
    }
  }, [stateData]);

  useEffect(() => {
    if (StreamData) {
      console.log("streamdata orb............... ", StreamData);
      if (StreamData.streamData) {
        setStreamDetails(StreamData.streamData.message);
        setBanner1Img(StreamData.streamData.message.chefBanners[0]);
        setBanner2Img(StreamData.streamData.message.chefBanners[1]);
        setItem1Image(StreamData.streamData.message.chefItems[0].pic);
        setItem2Image(StreamData.streamData.message.chefItems[1].pic);
      }

      if (StreamData.joinedFanList) {
        let list = [...StreamData.joinedFanList];
        setJoinedFanList(list);
        if (list.length > 1) {
          swal("Info", "No other fan can join!", "info");
        }
      }
    }
  }, [StreamData]);

  useEffect(async () => {
    await dispatch(getJoinedFanList(props.location.state.id));

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

  async function leaveCall() {
    console.log("leave call fn called in fan orb page of chef");
    // Destroy the local audio and video tracks.
    console.log("rtc.. ", chefRTC);
    if (chefRTC.client && chefRTC.localVideoTrack && chefRTC.localAudioTrack) {
      chefRTC.localAudioTrack.close();
      chefRTC.localVideoTrack.close();

      // Leave the channel.
      await chefRTC.client.leave();
    }
    // props.history.push("/fanHomePage");
    const dataToPass = {
      fanId: localStorage.getItem("id"),
      userId: props.location.state.id,
    };
    await dispatch(removedJoinFan(dataToPass));
    setShowRating(true);
  }

  const closeModal = () => {
    console.log("close modal.......");
    setShowRating(false);
    setCloseModalBool(true);
    props.history.push("/fanHomePage");
  };

  return (
    <div
      style={{
        background: "url('../assets/images/background_black.jpg')",
        backgroundSize: " cover",
        backgroundRepeat: "no-repeat",
        marginTop: "-48px",
        marginBottom: "-16px",
      }}
      id="capture1">
      {console.log(
        "rebcbzxcblzkxcb",
        chefRTC,
        rtc.localAudioTrack,
        rtc.localVideoTrack
      )}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="modal-ticket"
        aria-labelledby="example-custom-modal-styling-title">
        <Modal.Body style={{ padding: "0" }}>
          {paid ? (
            <Receipt setShow={setShow} />
          ) : (
            <Ticket setShow={setShow} paid={paid} setPaid={setPaid} />
          )}
        </Modal.Body>
      </Modal>
      <div className="ORB_logo1" style={{ paddingBottom: "1px" }}>
        <div className="main_section container mt-5 pt-5 d-flex">
          <div className="logo">
            <img src="../assets/images/grey_logo.png" alt="logo" />
          </div>
          <div className="live_container d-flex" id="local-player">
            {/* <div className="video_live d-flex position-relative">
              <video ref={videoRef} autoPlay className="userVideo"></video> 
            </div> */}
          </div>
          <div className="tips_info d-flex">
            <div className="timer" style={{ color: "#626262" }}>
              <p>Timer</p>
              <p>
                {Math.floor(time / 60) < 10
                  ? "0" + Math.floor(time / 60)
                  : Math.floor(time / 60)}
                :{time % 60 < 10 ? "0" + (time % 60) : time % 60}
              </p>
            </div>
          </div>
        </div>
        <div className="container mt-5 d-flex top_section position-relative">
          <div
            className="rectangle_video"
            style={{
              // backgroundImage: `url("${banner1Img.bannerImgURl}") `,
              backgroundImage: `url("${
                banner1Img != ""
                  ? banner1Img
                  : "../assets/images/style_fan_orb.png"
              }") `,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20%",
              zIndex: "1",
              cursor: "pointer",
              height: "500px",
            }}></div>

          <div
            className="rectangle_video"
            style={{
              // backgroundImage: `url("${banner2Img.bannerImgURl}") `,
              backgroundImage: `url("${
                banner2Img != ""
                  ? banner2Img
                  : "../assets/images/style_fan_orb.png"
              }") `,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20%",
              zIndex: "1",
              height: "500px",
            }}></div>
          <div className="justify-content-center go_live_logo"></div>
          <div className="round_video" style={{ top: "25px" }}>
            <div
              className="video_contents position-relative"
              style={{ zIndex: "2" }}>
              {/* <div id="fan-playerlist">
                {subscribed ? (
                  joinedFanList.length === 0 ? (
                  <div id="fan-playerlist"></div>
                ) : null
                ) : (
                  <>
                    <img src="../assets/images/style_rounded.png" alt="logo" />
                    <img
                      className="black_logo_img"
                      src="../assets/images/black_logo.png"
                      alt="logo"
                    />
                  </>
                )}
              </div> */}
              {subscribed ? (
                joinedFanList.length === 0 ? (
                  <div id="fan-playerlist"></div>
                ) : null
              ) : (
                <>
                  <img src="../assets/images/style_rounded.png" alt="logo" />
                  <img
                    className="black_logo_img"
                    src="../assets/images/black_logo.png"
                    alt="logo"
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="container items_links px-5 my-3 py-1">
          <div
            className="item position-relative price_item_main"
            style={{
              backgroundImage: `url("${
                item1Image != ""
                  ? item1Image
                  : "../assets/images/style_fan_orb.png"
              }") `,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20%",
              zIndex: "1",
              cursor: "pointer",
              height: "250px",
            }}>
            {/* <img src="../assets/images/style_fan_orb.png" alt="logo" /> */}
            <div className="price_item">
              {/* <a href="#"> */}
              <div className="price">
                <p style={{ marginTop: "15px" }}>
                  $
                  {streamDetails.chefItems !== undefined
                    ? streamDetails.chefItems[0].price
                    : "Item"}
                </p>
              </div>
              {/* </a> */}
              {/* <a href="#"> */}
              <div className="item">
                <p>
                  {streamDetails.chefItems !== undefined
                    ? streamDetails.chefItems[0].name
                    : "Item"}
                </p>
              </div>
              {/* </a> */}
            </div>
          </div>
          <div className="links">
            <a style={{ cursor: "pointer" }} onClick={handleShow}>
              <div className="link d-flex flex-column">
                <img src="../assets/images/ticket.png" alt="logo" />
                <p>Total order</p>
              </div>
            </a>
            <a href style={{ cursor: "pointer" }}>
              <div className="link d-flex flex-column">
                <img src="../assets/images/tip.png" alt="logo" />
                <p>Tip</p>
              </div>
            </a>
            <a href onClick={getImage}>
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/take_picture.png" />
                <p>Take Picture</p>
              </div>
            </a>
            <a ref={ref} href>
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
                      : { cursor: "pointer" }
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
                      style={{ listStyleType: "none" }}
                      // onClick={() => props.history.push("/profile")}
                    >
                      <a
                        href={`https://facebook.com/sharer/sharer.php?u=${encodedURL}`}>
                        {" "}
                        <span
                          className="fab fa-facebook-square"
                          style={{ fontSize: "25px" }}></span>
                      </a>
                    </li>
                    <li
                      className="menu more_list"
                      style={{ listStyleType: "none" }}
                      // onClick={() => props.history.push("/myStory")}
                    >
                      {" "}
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodedURL}`}>
                        <span
                          className="fab fa-twitter-square"
                          style={{ fontSize: "25px" }}></span>{" "}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </a>
            <a
              style={{ cursor: "pointer" }}
              onClick={() => {
                leaveCall();
              }}>
              <div className="link d-flex flex-column">
                <img src="../assets/images/exit.png" alt="logo" />
                <p>Exit</p>
              </div>
            </a>
          </div>
          <div
            className="item position-relative price_item_main"
            style={{
              backgroundImage: `url("${
                item2Image != ""
                  ? item2Image
                  : "../assets/images/style_fan_orb.png"
              }") `,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20%",
              zIndex: "1",
              cursor: "pointer",
              height: "250px",
            }}>
            <div className="price_item">
              <div className="price">
                <p style={{ marginTop: "15px" }}>
                  $
                  {streamDetails.chefItems !== undefined
                    ? streamDetails.chefItems[1].price
                    : "Item"}
                </p>
              </div>

              <div className="item">
                <p>
                  {streamDetails.chefItems !== undefined
                    ? streamDetails.chefItems[1].name
                    : "Item"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showRating ? (
        <div className="review">
          <AddRating
            userId={props.location.state.id}
            itemDetail={StreamData.streamData.message}
            closeModal={closeModal}
          />
        </div>
      ) : null}
    </div>
  );
}

export default FanChefORB;

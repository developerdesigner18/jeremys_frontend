import React, { useEffect, useState, useRef } from "react";
import "../../assets/css/chefORB.css";
import html2canvas from "html2canvas";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import Ticket from "../ORBTicketComponents/Ticket";
import Receipt from "../ORBTicketComponents/Receipt";

import Modal from "react-bootstrap/Modal";

import {
  storeScreenShot,
  storeChefOrbDetails,
  getStreamDetails,
  getUserToken,
} from "../../actions/orbActions";
import { getUserWithId } from "../../actions/userActions";

const useOutsideClick = (ref, callback) => {
  const handleClick = (e) => {
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
  const [paid, setPaid] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    // if (subscribed) {
    setShow(true);
    // }
  };
  const menuClass = `dropdown-menu${isOpen ? " show" : ""}`;
  const setMoreIcon = () => {
    setIsOpen(!isOpen);
  };
  let encodedURL = encodeURI(
    `${process.env.REACT_APP_API_URL}${window.location.pathname.slice(1)}`
  );
  const dispatch = useDispatch();
  const stateData = useSelector((state) => {
    return state.user;
  });
  const StreamData = useSelector((state) => state.ORB);
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
    channel: "Chef",
    token: null,
    role: "audience",
  });

  React.useEffect(async () => {
    if (time > 0) {
      setTimeout(() => setTime(time - 1), 1000);
    } else {
      setTime(0);
      swal("oops!", "Please pay for enjoy full live streaming", "warning");
    }
  }, []);

  const getImage = () => {
    console.log("fn called");
    html2canvas(document.querySelector("#capture1"), {
      allowTaint: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      useCORS: true,
    }).then((canvas) => {
      let file;
      // console.log('canvas',canvas.toBlob());
      canvas.toBlob(async (blob) => {
        file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
        let fd = new FormData();
        fd.append("id", localStorage.getItem("id"));
        fd.append("image", file);

        await dispatch(storeScreenShot(fd));
      });
    });
  };

  useEffect(async () => {
    await dispatch(getUserToken("5ff6fd76b710942b8831af88"));
    if (localStorage.getItem("token"))
      await dispatch(getUserWithId(localStorage.getItem("id")));
    await dispatch(getStreamDetails({ userId: "6010fc2edd4e4d03ac048b0a" }));
  }, []);

  useEffect(async () => {
    if (stateData) {
      if (stateData.userInfo) {
        setUserInfo(stateData.userInfo.data);
      }
    }

    if (StreamData) {
      if (StreamData.streamData) {
        setStreamDetails(StreamData.streamData.message);
        setBanner1Img(StreamData.streamData.message.chefBanners[0]);
        setBanner2Img(StreamData.streamData.message.chefBanners[1]);
        setItem1Image(StreamData.streamData.message.chefItems[0].pic);
        setItem2Image(StreamData.streamData.message.chefItems[1].pic);
      }
    }
  }, [stateData]);

  useEffect(async () => {
    if (StreamData) {
      if (StreamData && StreamData.userToken && StreamData.streamData) {
        console.log("StreamData", StreamData.userToken.agoraToken);
        rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

        setChefRTC((prevState) => ({ ...prevState, client: rtc.client }));
        const uid = await rtc.client.join(
          options.appId,
          options.channel,
          StreamData.userToken.agoraToken,
          null
        );

        // Create an audio track from the audio sampled by a microphone.
        rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        setChefRTC((prevState) => ({
          ...prevState,
          localAudioTrack: rtc.localAudioTrack,
        }));
        // Create a video track from the video captured by a camera.
        rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
        setChefRTC((prevState) => ({
          ...prevState,
          localVideoTrack: rtc.localVideoTrack,
        }));

        // Publish the local audio and video tracks to the channel.
        rtc.client
          .publish([rtc.localAudioTrack, rtc.localVideoTrack])
          .then(() => console.log("published!!!!!!!!!!!!!!!!!!!!!!"));

        // Subscribe to a remote user
        rtc.client.on("user-published", async (user, mediaType) => {
          console.log("user-published!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
          remoteUsers[user.id] = user;

          // Subscribe to a remote user.
          await rtc.client.subscribe(user, mediaType);
          console.log("subscribe success-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

          if (mediaType === "video") {
            setSubscribed(true);
            user.videoTrack.play(`fan-playerlist`);
          }
          if (mediaType === "audio") {
            user.audioTrack.play();
          }
        });
        rtc.client.on("user-unpublished", async (user, mediaType) => {
          console.log("handleUserUnpublished at fan side-==-=-=", user.uid);
          const id = user.uid;
          delete remoteUsers[id];
          setSubscribed(false);

          await rtc.client.leave();
        });

        rtc.localVideoTrack.play("local-player");
        rtc.localAudioTrack.play();

        console.log("publish success!");
      }
    }
  }, [StreamData]);

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
    props.history.push("/fanHomePage");
  }

  return (
    <div
      style={{
        background: "url('../assets/images/background_black.jpg')",
        backgroundSize: " cover",
        backgroundRepeat: "no-repeat",
        marginTop: "-48px",
        marginBottom: "-16px",
      }}
      id="capture1"
    >
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
        aria-labelledby="example-custom-modal-styling-title"
      >
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
            <div className="timer">
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
            }}
            method="POST"
          ></div>

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
            }}
            method="POST"
          ></div>
          <div className="justify-content-center go_live_logo"></div>
          <div className="round_video" style={{ top: "25px" }}>
            <div
              className="video_contents position-relative"
              style={{ zIndex: "2" }}
            >
              {subscribed ? (
                <div id="fan-playerlist"></div>
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
          {/* <div id="fan-playerlist"></div> */}
        </div>
        <div className="container items_links px-5 my-3 py-1">
          <div
            className="item position-relative"
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
            }}
            method="POST"
          >
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
            <a style={{ cursor: "pointer" }}>
              <div className="link d-flex flex-column">
                <img src="../assets/images/tip.png" alt="logo" />
                <p>Tip</p>
              </div>
            </a>
            <a onClick={getImage}>
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/take_picture.png" />
                <p>Take Picture</p>
              </div>
            </a>
            <a ref={ref}>
              <div
                className="ORB_link d-flex flex-column dropup"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={() => setMoreIcon()}
              >
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
                  }}
                >
                  <ul className="menu_item d-flex flex-row m-0 justify-content-between px-3 align-items-center">
                    {" "}
                    <li
                      className="menu more_list "
                      style={{ listStyleType: "none" }}
                      // onClick={() => props.history.push("/profile")}
                    >
                      <a
                        href={`https://facebook.com/sharer/sharer.php?u=${encodedURL}`}
                      >
                        {" "}
                        <span
                          className="fab fa-facebook-square"
                          style={{ fontSize: "25px" }}
                        ></span>
                      </a>
                    </li>
                    <li
                      className="menu more_list"
                      style={{ listStyleType: "none" }}
                      // onClick={() => props.history.push("/myStory")}
                    >
                      {" "}
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodedURL}`}
                      >
                        <span
                          className="fab fa-twitter-square"
                          style={{ fontSize: "25px" }}
                        ></span>{" "}
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
              }}
            >
              <div className="link d-flex flex-column">
                <img src="../assets/images/exit.png" alt="logo" />
                <p>Exit</p>
              </div>
            </a>
          </div>
          <div
            className="item position-relative"
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
            }}
            method="POST"
          >
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
    </div>
  );
}

export default FanChefORB;

import React, {useEffect, useState, useRef} from "react";
import "../../assets/css/chefORB.css";
import html2canvas from "html2canvas";
import {useDispatch, useSelector} from "react-redux";
import swal from "sweetalert";
import {useHistory} from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import AddRating from "../Rating/AddRating";
import {socket} from "../../socketIO";
import Ticket from "../ORBTicketComponents/Ticket";
import Receipt from "../ORBTicketComponents/Receipt";

import Modal from "react-bootstrap/Modal";

import {
  storeScreenShot,
  getStreamDetails,
  joinedFan,
  removedJoinFan,
  getJoinedFanList,
  removeFan3MinuteCount,
  storeFan3MinuteCount,
  getFanJoined3MinuteCount,
} from "../../actions/orbActions";
import {getUserWithId} from "../../actions/userActions";
import Tip from "../ORBTicketComponents/Tip";
import PayOrder from "../ORBTicketComponents/PayOrder";
import {getPaymentDetails} from "../../actions/paymentActions";

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
  const [time, setTime] = useState(180);
  const [pauseTime, setPauseTime] = useState(10);

  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const ref = useRef();

  const [show, setShow] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [freeSessionCompleted, setFreeSessionCompleted] = useState(false);
  const [exitCalled, setExitCalled] = useState(false);
  const mount = useRef();
  const handleClose = () => {
    // setTime(pauseTime);
    // setPauseTime(0);
    // setIsActive(true);
    // setShow(false);
    // console.log("on close time..... ", time, pauseTime);
    console.log("session completed value.. ", freeSessionCompleted, paid);
    if (freeSessionCompleted) {
      if (paid) {
        setShow(false);
        setTime(0);
        setIsActive(false);
      } else {
        setShow(true);
        setIsActive(true);
      }
    } else {
      setShow(false);
      setIsActive(true);
    }
  };
  const handleCloseReciept = () => {
    setPaid(false);
    setTime(pauseTime);
    setPauseTime(0);
  };
  const handleShow = () => {
    if (subscribed) {
      console.log("fan time......... ", time);
      if (!paid) setIsActive(false);
      setShow(true);
      setShowTip(false);
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
  const paymentState = useSelector(state => state.payment);
  const history = useHistory();

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
    role: "host",
  });

  useEffect(() => {
    let interval = null;
    console.log("time & isactive... ", time, isActive);
    console.log(
      "checking payment done or not ",
      paid,
      paymentState && paymentState.paymentDetail
    );
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    } else if (isActive && time == 0) {
      if (!paid) setShowRating(true);
    }
    return () => clearInterval(interval);
  }, [time, isActive]);

  const getImage = () => {
    console.log("fn called");
    // let canvas = document.createElement("canvas");
    // let ctx = canvas.getContext("2d");

    // //draw image to canvas. scale to target dimensions
    // console.log("canvas.......... ", ctx);
    // ctx.drawImage(document.querySelector("#capture1"), 0, 0);

    // //convert to desired file format
    // let dataURI = canvas.toDataURL("image/jpeg"); // can also use 'image/png'
    // console.log("datauri ", dataURI);
    html2canvas(document.querySelector("#capture1"), {
      allowTaint: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      useCORS: true,
    }).then(canvas => {
      let file;
      // console.log('canvas',canvas.toBlob());
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

  useEffect(async () => {
    document.documentElement.scrollTop = 0;
    let id, name;
    if (localStorage.getItem("token"))
      await dispatch(getUserWithId(localStorage.getItem("id")));
    if (props.location.state.name && props.location.state.id) {
      id = props.location.state.id;
      name = props.location.state.name;
      await dispatch(getStreamDetails({userId: id}));
    }

    socket.emit("storeLiveFans", localStorage.getItem("id"));
    // if (props.location.state.name) {
    await axios
      .get(`${process.env.REACT_APP_API_URL}api/agora/getUserToken?id=${id}`)
      .then(async result => {
        setOptions({...options, token: result.data.data.agoraToken});
        if (result.data.data.agoraToken) {
          const token = result.data.data.agoraToken;
          rtc.client = AgoraRTC.createClient({mode: "live", codec: "vp8"});
          await rtc.client.setClientRole(options.role);
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

  useEffect(async () => {
    if (StreamData) {
      console.log("streamdata orb............... ", StreamData);
      if (StreamData.streamData) {
        setStreamDetails(StreamData.streamData.message);
        setBanner1Img(StreamData.streamData.message.chefBanners[0]);
        setBanner2Img(StreamData.streamData.message.chefBanners[1]);
        setItem1Image(StreamData.streamData.message.chefItems[0].pic);
        setItem2Image(StreamData.streamData.message.chefItems[1].pic);

        if (StreamData.streamData && StreamData.streamData.message)
          await dispatch(getPaymentDetails(StreamData.streamData.message._id));
      }

      if (StreamData.joinedFanList) {
        let list = [...StreamData.joinedFanList];
        setJoinedFanList(list);
        if (list.length > 1) {
          swal("Info", "No other fan can join!", "info");
        }
      }

      if (
        StreamData.fan3minCount === true ||
        StreamData.fan3minCount === false
      ) {
        setFreeSessionCompleted(StreamData.fan3minCount);
        mount.current = StreamData.fan3minCount;
        if (
          StreamData.fan3minCount === true &&
          StreamData.streamData &&
          !paid
        ) {
          setIsActive(false);
          handleShow();
        } else {
          handleClose();
        }
      }
    }
  }, [StreamData]);

  useEffect(async () => {
    if (!mount.current) {
      console.log("in if!!!!!!!");
      //componenet did mount

      await dispatch(getJoinedFanList(props.location.state.id));

      await dispatch(
        getFanJoined3MinuteCount(
          props.location.state.id,
          localStorage.getItem("id")
        )
      );
    } else {
      console.log("in else.........");
      if (StreamData.streamData && StreamData.streamData.message)
        await dispatch(getPaymentDetails(StreamData.streamData.message._id));
    }

    return async () => {
      console.log("component will un mount fn called...", paid);

      if (
        chefRTC.client &&
        chefRTC.localVideoTrack &&
        chefRTC.localAudioTrack
      ) {
        chefRTC.localAudioTrack.close();
        chefRTC.localVideoTrack.close();

        // Leave the channel.
        await chefRTC.client.leave();
      }
      const dataToPass = {
        fanId: localStorage.getItem("id"),
        userId: props.location.state.id,
      };
      await dispatch(removedJoinFan(dataToPass));

      if (paymentState && paymentState.paymentDetail) {
        await dispatch(removeFan3MinuteCount(dataToPass));
      } else {
        await dispatch(storeFan3MinuteCount(dataToPass));
      }
    };
  }, []);

  useEffect(async () => {
    // await dispatch(getJoinedFanList(props.location.state.id));
    // // await leaveCall();
    // await dispatch(
    //   getFanJoined3MinuteCount(
    //     props.location.state.id,
    //     localStorage.getItem("id")
    //   )
    // );
    // window.addEventListener("beforeunload", async ev => {
    //   console.log("before unload evenet called ", ev);
    //   console.log(
    //     "paid or not... ",
    //     paid,
    //     paymentState && paymentState.paymentDetail
    //   );
    //   // await leaveCall();
    //   if (
    //     chefRTC.client &&
    //     chefRTC.localVideoTrack &&
    //     chefRTC.localAudioTrack
    //   ) {
    //     chefRTC.localAudioTrack.close();
    //     chefRTC.localVideoTrack.close();
    //     // Leave the channel.
    //     await chefRTC.client.leave();
    //   }
    //   const dataToPass = {
    //     fanId: localStorage.getItem("id"),
    //     userId: props.location.state.id,
    //   };
    //   await dispatch(removedJoinFan(dataToPass));
    //   if (paymentState && paymentState.paymentDetail) {
    //     await dispatch(removeFan3MinuteCount(dataToPass));
    //   } else {
    //     await dispatch(storeFan3MinuteCount(dataToPass));
    //   }
    //   ev.returnValue = "Live streaming will be closed. Sure you want to leave?";
    //   return ev.returnValue;
    // });
  }, []);

  useEffect(() => {
    if (paymentState) {
      if (paymentState.paymentDetail && paymentState.paymentDetail["total"]) {
        setTime(0);
        // if (exitCalled === false) setShowRating(false);
        setShowRating(false);
      }
    }
  }, [paymentState]);

  async function leaveCall() {
    setExitCalled(true);
    console.log(
      "leave call fn called in fan orb page of chef",
      paid,
      paymentState && paymentState.paymentDetail
    );
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

    if (paymentState && paymentState.paymentDetail) {
      await dispatch(removeFan3MinuteCount(dataToPass));
    } else {
      await dispatch(storeFan3MinuteCount(dataToPass));
    }

    setShowRating(true);
  }

  const closeModal = async () => {
    console.log("close modal.......");
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
    setShowRating(false);
    setCloseModalBool(true);
    props.history.push("/fanHomePage");
  };

  const showTipModal = () => {
    setShowTip(true);
    setShow(false);
    setIsActive(false);
  };

  const closeTip = () => {
    setShowTip(false);
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
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="modal-ticket"
        aria-labelledby="example-custom-modal-styling-title">
        <Modal.Body style={{padding: "0"}}>
          {paid ? (
            <Receipt
              setPaid={setPaid}
              streamId={streamDetails ? streamDetails._id : ""}
              setShow={setShow}
              text="chef/stylist"
              userId={props.location.state.id}
              streamObj={streamDetails}
              setFreeSessionCompleted={setFreeSessionCompleted}
              freeSessionCompleted={freeSessionCompleted}
            />
          ) : (
            <PayOrder
              setShow={setShow}
              price1={
                streamDetails.chefItems ? streamDetails.chefItems[0].price : 0
              }
              price2={
                streamDetails.chefItems ? streamDetails.chefItems[1].price : 0
              }
              item1={
                streamDetails.chefItems ? streamDetails.chefItems[0].name : ""
              }
              item2={
                streamDetails.chefItems ? streamDetails.chefItems[1].name : ""
              }
              userId={props.location.state.id}
              streamId={streamDetails ? streamDetails._id : ""}
              type={streamDetails ? streamDetails.userType : ""}
              setPaid={setPaid}
              paid={paid}
              handleClose={handleClose}
              userInfo={userInfo}
              freeSessionCompleted={freeSessionCompleted}
            />
            // <Ticket setShow={setShow} paid={paid} setPaid={setPaid} />
          )}
        </Modal.Body>
      </Modal>

      <Modal
        show={showTip}
        onHide={closeTip}
        centered
        dialogClassName="modal-ticket"
        aria-labelledby="example-custom-modal-styling-title">
        <Modal.Body style={{padding: "0"}}>
          {showTip ? (
            <Tip
              setShow={setShow}
              type={streamDetails ? streamDetails.userType : ""}
              userId={props.location.state.id}
              streamId={streamDetails ? streamDetails._id : ""}
              setShowTip={setShowTip}
            />
          ) : null}
        </Modal.Body>
      </Modal>

      <div className="ORB_logo1" style={{paddingBottom: "1px"}}>
        <div className="main_section container mt-5 pt-5 d-flex">
          <div className="logo">
            <img src="../assets/images/grey_logo.png" alt="logo" />
          </div>
          <div className="live_container d-flex" id="local-player"></div>
          <div className="tips_info d-flex">
            <div className="timer" style={{color: "#626262"}}>
              {paid ? null : (
                <>
                  <p>Timer</p>
                  <p style={{fontWeight: "600"}}>
                    {Math.floor(time / 60) < 10
                      ? "0" + Math.floor(time / 60)
                      : Math.floor(time / 60)}
                    :{time % 60 < 10 ? "0" + (time % 60) : time % 60}
                  </p>
                </>
              )}
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
          <div className="round_video" style={{top: "25px"}}>
            <div
              className="video_contents position-relative"
              style={{zIndex: "2"}}>
              {subscribed ? (
                joinedFanList.length === 0 ? (
                  <>
                    <div id="fan-playerlist"></div>
                    <div
                      className="circle"
                      style={{
                        background: paid
                          ? "green"
                          : showRating
                          ? "red"
                          : "yellow",
                        border: paid ? "green" : showRating ? "red" : "yellow",
                      }}></div>
                    <img
                      className="black_logo_img"
                      src="../assets/images/black_logo.png"
                      alt="logo"
                    />
                  </>
                ) : null
              ) : (
                <>
                  <img src="../assets/images/style_rounded.png" alt="logo" />
                  <div
                    className="circle"
                    style={{
                      background: paid
                        ? "green"
                        : showRating
                        ? "red"
                        : "yellow",
                      border: paid ? "green" : showRating ? "red" : "yellow",
                    }}></div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="items_links px-5 my-3 py-1 mt-5">
          <div>
            <div className="item-des mx-2">
              <p
                style={{
                  width: "100%",
                  borderRadius: "34px",
                  height: "100%",
                  border: "3px solid #9297a8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                {streamDetails.chefItems !== undefined
                  ? streamDetails.chefItems[0].name
                  : "Item"}
              </p>
            </div>
            <div className="price">
              <p style={{marginTop: "15px"}}>
                $
                {streamDetails.chefItems !== undefined
                  ? streamDetails.chefItems[0].price
                  : "Item"}
              </p>
            </div>
          </div>
          <div
            className="item position-relative price_item_main"
            style={{
              backgroundImage: `url("${
                item1Image != ""
                  ? item1Image
                  : "../assets/images/left-bg4-full.png"
              }") `,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20%",
              zIndex: "1",
              cursor: "pointer",
              height: "250px",
            }}></div>
          <div className="links">
            <a style={{cursor: "cursor"}} onClick={handleShow}>
              <div className="link d-flex flex-column">
                <img src="../assets/images/ticket.png" alt="logo" />
                <p>Total order</p>
              </div>
            </a>
            <a style={{cursor: "pointer"}} onClick={showTipModal}>
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
            <a
              style={{cursor: "pointer"}}
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
            }}></div>
          <div>
            <div className="item-des mx-2">
              <div className="item">
                <p
                  style={{
                    width: "100%",
                    borderRadius: "34px",
                    height: "100%",
                    border: "3px solid #9297a8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  {streamDetails.chefItems !== undefined
                    ? streamDetails.chefItems[1].name
                    : "Item"}
                </p>
              </div>{" "}
            </div>
            <div className="price">
              <p style={{marginTop: "15px"}}>
                $
                {streamDetails.chefItems !== undefined
                  ? streamDetails.chefItems[1].price
                  : "Item"}
              </p>
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

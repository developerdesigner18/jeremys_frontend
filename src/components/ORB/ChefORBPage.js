import React, { useEffect, useRef, useState, useCallback } from "react";
import "../../assets/css/chefORB.css";
import html2canvas from "html2canvas";
import { useDispatch, useSelector } from "react-redux";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import { socket } from "../../socketIO";

import {
  storeChefOrbDetails,
  storeOnlineUser,
  removeOnlineUser,
  getJoinedFanList,
  deleteGeneratedStream,
  changeUserStatus,
} from "../../actions/orbActions";
import Modal from "react-bootstrap/Modal";
import { getUserWithId } from "../../actions/userActions";
import Receipt from "../ORBTicketComponents/Receipt";
import swal from "sweetalert";
import { getTipDetails } from "../../actions/paymentActions";
import TipList from "../ORBTicketComponents/TipList";
import ScreenShotUpload from "../ORBTicketComponents/ScreenShotUpload";

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
function ChefORBPage(props) {
  const [isLive, setIsLive] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [banner1Img, setBanner1Img] = useState({});
  const [banner2Img, setBanner2Img] = useState({});
  const [item1, setItem1] = useState("");
  const [item1Image, setItem1Image] = useState({});
  const [item2, setItem2] = useState("");
  const [item2Image, setItem2Image] = useState({});
  const [price, setPrice] = useState("");
  const [price2, setPrice2] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [joinedFanList, setJoinedFanList] = useState([]);
  const [streamResponse, setStreamResponse] = useState({});
  const [tipsList, setTipsList] = useState([]);
  const [tip, setTip] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const handleShow = () => {
    if (isLive) setShow(true);
  };
  const [RTC, setRTC] = useState({
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  });
  const ref = useRef();
  const webcam = useRef();
  const menuClass = `dropdown-menu${isOpen ? " show" : ""}`;
  const setMoreIcon = () => {
    setIsOpen(!isOpen);
  };
  useOutsideClick(ref, () => {
    setIsOpen(false);
  });
  let encodedURL = encodeURI(
    `https://jeremysLive.com/${window.location.pathname.slice(1)}`
  );
  const dispatch = useDispatch();
  const stateData = useSelector((state) => {
    // console.log("state.... ", state.user);
    return state.user;
  });
  const ORBData = useSelector((state) => {
    // console.log("state.... ", state.user);
    return state.ORB;
  });

  const statePayment = useSelector((state) => state.payment);

  const [options, setOptions] = useState({
    appId: `${process.env.REACT_APP_AGORA_APP_ID}`,
    channel: localStorage.getItem("id"),
    token: null,
    role: "host",
  });
  const rtc = {
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  };

  const goToLivePage = async () => {
    await dispatch(storeOnlineUser());

    if (
      item1 !== "" &&
      item2 !== "" &&
      price !== "" &&
      price2 !== "" &&
      item1Image.itemImg &&
      item2Image.itemImg &&
      banner1Img.bannerImg &&
      banner2Img.bannerImg
    ) {
      let fd = new FormData();

      fd.append("name1", item1);
      fd.append("name2", item2);
      fd.append("userId", localStorage.getItem("id"));
      fd.append("userType", localStorage.getItem("type"));
      fd.append("price1", price);
      fd.append("price2", price2);
      fd.append("banner1", banner1Img.bannerImg);
      fd.append("banner2", banner2Img.bannerImg);
      fd.append("item1Img", item1Image.itemImg);
      fd.append("item2Img", item2Image.itemImg);

      await dispatch(storeChefOrbDetails(fd));
      setIsLive(true);

      let token;

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
        .then((result) => {
          console.log("result-==-=--=", result.data.key);
          setOptions({ ...options, token: result.data.key });
          token = result.data.key;
        })
        .catch((err) => console.log("error ", err));

      rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
      setRTC((prevState) => ({ ...prevState, client: rtc.client }));
      await rtc.client.setClientRole(options.role);
      const uid = await rtc.client.join(
        options.appId,
        options.channel,
        token,
        null
      );

      // Create an audio track from the audio sampled by a microphone.
      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        AEC: true,
        AGC: true,
        ANS: true,
      });
      setRTC((prevState) => ({
        ...prevState,
        localAudioTrack: rtc.localAudioTrack,
      }));
      // Create a video track from the video captured by a camera.
      rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      setRTC((prevState) => ({
        ...prevState,
        localVideoTrack: rtc.localVideoTrack,
      }));

      // Publish the local audio and video tracks to the channel.
      await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

      rtc.client.on("user-published", async (user, mediaType) => {
        console.log("user-published!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

        // Subscribe to a remote user.
        await rtc.client.subscribe(user, mediaType);
        await dispatch(changeUserStatus());

        console.log("subscribe success-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

        if (mediaType === "video") {
          console.log("video track!!!!!!!!");
          setSubscribed(true);
          user.videoTrack.play(`chef-remote-playerlist`);
          await dispatch(getJoinedFanList(localStorage.getItem("id")));
        }
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });
      rtc.client.on("user-unpublished", async (user, mediaType) => {
        console.log("handleUserUnpublished chef/stylist-==-=-=", user.uid);
      });

      rtc.client.on("stream-added", (evt) => {
        console.log("Stream added", evt);
        // evt.stream.play("fan-playerlist");
      });

      rtc.localVideoTrack.play("local-player");
      // rtc.localAudioTrack.play();
      console.log("publish success!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    } else {
      swal(
        "Info",
        "Please fill up the items, items description, item image and banner image!",
        "info"
      );
    }
  };

  async function leaveCall() {
    console.log("leave call fn called in chef page");
    // Destroy the local audio and video tracks.
    if (RTC.client && RTC.localVideoTrack && RTC.localAudioTrack) {
      RTC.localAudioTrack.close();
      RTC.localVideoTrack.close();

      // Leave the channel.
      await RTC.client.leave();
    }
    socket.disconnect();
    await dispatch(removeOnlineUser());
    await dispatch(deleteGeneratedStream());
  }

  const Banner1Change = (event) => {
    let reader = new FileReader();
    if (event.target.files.length) {
      reader.onload = (e) => {
        setBanner1Img((prevState) => ({
          ...prevState,
          bannerImg: event.target.files[0],
          bannerImgURl: e.target.result,
        }));
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const Banner2Change = (event) => {
    let reader = new FileReader();
    if (event.target.files.length) {
      reader.onload = (e) => {
        setBanner2Img((prevState) => ({
          ...prevState,
          bannerImg: event.target.files[0],
          bannerImgURl: e.target.result,
        }));
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const FoodImageChange = (event, item) => {
    let reader = new FileReader();

    if (event.target.files.length) {
      reader.onload = (e) => {
        if (item == "1") {
          // setItem1Image(e.target.result);
          setItem1Image((prevState) => ({
            ...prevState,
            itemImg: event.target.files[0],
            itemImgURl: e.target.result,
          }));
        } else {
          // setItem2Image(e.target.result);
          setItem2Image((prevState) => ({
            ...prevState,
            itemImg: event.target.files[0],
            itemImgURl: e.target.result,
          }));
        }
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };
  const handleChange = (e) => {
    setPrice(e.target.value);
  };

  const callTipList = async () => {
    setTip(true);
    console.log("call tip list... ", tip);
  };

  const handleCloseTip = () => {
    setShow(false);
    setTip(false);
  };

  useEffect(async () => {
    document.documentElement.scrollTop = 0;

    if (localStorage.getItem("token"))
      await dispatch(getUserWithId(localStorage.getItem("id")));

    window.addEventListener("beforeunload", async (ev) => {
      console.log("before unload evenet called ", ev);

      await dispatch(removeOnlineUser());
      await dispatch(deleteGeneratedStream());

      ev.returnValue = "Live streaming will be closed. Sure you want to leave?";
      return ev.returnValue;
    });
  }, []);

  useEffect(() => {
    if (stateData) {
      if (stateData.userInfo) {
        setUserInfo(stateData.userInfo.data);
      }
    }
  }, [stateData]);

  useEffect(async () => {
    if (ORBData) {
      console.log("joined fan list.............. ", ORBData);
      if (ORBData.joinedFanList) {
        let list = [...ORBData.joinedFanList];
        setJoinedFanList(list);
        if (list.length > 1) {
          swal("Info", "No other fan can join!", "info");
        }
      }
      if (ORBData.response) {
        setStreamResponse(ORBData.response);
      }
    }
  }, [ORBData]);

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

  const showImageModal = () => {
    setImageModal(true);
    setShow(false);
    setTip(false);
  };

  const closeImageModal = () => {
    setImageModal(false);
    setShow(false);
    setTip(false);
  };

  return (
    <div
      style={{
        background: isLive
          ? "url('../assets/images/background_black.jpg')"
          : "url('../assets/images/JL-GO-LIVE.jpg')",
        backgroundSize: " cover",
        backgroundRepeat: "no-repeat",
        marginTop: "-48px",
        marginBottom: "-16px",
      }}
      id="capture"
    >
      <Modal
        show={show}
        onHide={handleClose}
        centered
        dialogClassName="modal-ticket"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Body style={{ padding: "0" }}>
          {streamResponse ? (
            <Receipt
              setShow={setShow}
              streamId={streamResponse._id}
              userId={localStorage.getItem("id")}
              text="chef/stylist"
            />
          ) : tip ? (
            <TipList setTip={setTip} streamId={streamResponse._id} />
          ) : null}
        </Modal.Body>
      </Modal>

      <Modal
        show={tip}
        onHide={handleCloseTip}
        centered
        dialogClassName="modal-ticket"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Body style={{ padding: "0" }}>
          {tip ? (
            <TipList setTip={setTip} streamId={streamResponse._id} />
          ) : null}
        </Modal.Body>
      </Modal>

      <Modal
        show={imageModal}
        onHide={closeImageModal}
        centered
        dialogClassName="modal-ticket"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Body style={{ padding: "0" }}>
          {imageModal ? (
            <ScreenShotUpload
              closeImageModal={closeImageModal}
              imageModal={imageModal}
            />
          ) : null}
        </Modal.Body>
      </Modal>

      <div className="ORB_logo1" style={{ paddingBottom: "1px" }}>
        <div className="main_section container mt-5 pt-5 d-flex">
          <div className="logo">
            <img src="../assets/images/grey_logo.png" alt="logo" />
          </div>
          <div
            className="live_container d-flex"
            id="local-player"
            style={{
              boxShadow: isLive
                ? "inset 3px 5px 5px #3a3a3a"
                : "rgb(89 89 89) 3px 5px 5px 8px inset",
              backgroundColor: "#424242",
              content: isLive ? "" : "LIVE",
            }}
          ></div>
          <div
            className="tips_info d-flex text-center"
            style={{ justifyContent: "center" }}
          >
            <p>All Orders include Taxes and Delivery</p>
          </div>
        </div>
        <div className="container mt-5 d-flex top_section position-relative">
          <div
            className="rectangle_video"
            style={{
              // backgroundImage: `url("${banner1Img.bannerImgURl}") `,
              backgroundImage: `url("${
                banner1Img.bannerImgURl != undefined
                  ? banner1Img.bannerImgURl
                  : "../assets/images/right-bg2-full.png"
              }") `,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20%",
              zIndex: "1",
              cursor: "pointer",
              height: "500px",
            }}
          >
            {isLive ? null : (
              <input
                type="file"
                onChange={(e) => Banner1Change(e)}
                style={{
                  cursor: isLive ? "none" : "pointer",
                  position: "absolute",
                  margin: "0",
                  padding: "0",
                  height: "100%",
                  outline: "none",
                  opacity: "0",
                  width: "44%",
                }}
              />
            )}
          </div>
          <div
            className="rectangle_video"
            style={{
              // backgroundImage: `url("${banner2Img.bannerImgURl}") `,
              backgroundImage: `url("${
                banner2Img.bannerImgURl != undefined
                  ? banner2Img.bannerImgURl
                  : "../assets/images/right-bg2-full.png"
              }") `,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20%",
              zIndex: "1",
              height: "500px",
            }}
          >
            {isLive ? null : (
              <input
                type="file"
                onChange={(e) => Banner2Change(e)}
                style={{
                  position: "absolute",
                  margin: "0",
                  padding: "0",
                  height: "100%",
                  outline: "none",
                  cursor: isLive ? "none" : "pointer",
                  opacity: "0",
                  width: "44%",
                }}
              />
            )}
          </div>
          <div className="justify-content-center go_live_logo">
            {isLive ? (
              <img
                src="../assets/images/live-btn-chef-stylist.png"
                alt="go_live"
                height={50}
              />
            ) : (
              <img
                src="../assets/images/go_live_chef_stylist.png"
                alt="go_live"
                style={{ cursor: "pointer" }}
                onClick={() => goToLivePage()}
              />
            )}
          </div>

          <div
            className="round_video"
            style={{
              top: isLive ? "25" : "25px",
            }}
          >
            <div
              className="video_contents position-relative"
              style={{ zIndex: "2" }}
            >
              {subscribed ? (
                // joinedFanList.length === 0 ? (
                <>
                  <div id="chef-remote-playerlist"></div>
                  <img
                    className="black_logo_img"
                    src="../assets/images/black_logo.png"
                    alt="logo"
                  />
                </>
              ) : (
                // ) : null
                <>
                  <img src="../assets/images/style_rounded.png" alt="logo" />
                  <img
                    className="black_logo_img"
                    src="../assets/images/black_logo-without-text.png"
                    alt="logo"
                  />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="items_links px-5 my-3 py-1 mt-5">
          <div>
            <div
              className="item-des mx-2"
              style={{
                background: item1
                  ? "none"
                  : `url("../assets/images/left-bg4-full.png")`,
              }}
            >
              <div className="item">
                {isLive ? (
                  <p
                    style={{
                      width: "100%",
                      background: "transparent",
                      color: "rgb(178, 178, 178)",
                      textAlign: "center",
                      verticalAlign: "middle",
                      borderRadius: "34px",
                      height: "100%",
                      border: "3px solid #9297a8",
                      outline: "none",
                      paddingTop: "70px",
                    }}
                  >
                    {item1}
                  </p>
                ) : (
                  <input
                    type="text"
                    onChange={(e) => {
                      setItem1(e.target.value);
                    }}
                    value={item1}
                    style={{
                      width: "100%",
                      background: "transparent",
                      color: "rgb(178, 178, 178)",
                      textAlign: "center",
                      verticalAlign: "middle",
                      borderRadius: "34px",
                      height: "100%",
                      border: "3px solid #9297a8",
                      outline: "none",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="price">
              {isLive ? (
                <p
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: "#b2b2b2",
                    textAlign: "center",
                    verticalAlign: "middle",
                    height: "100%",
                    borderRadius: "100%",
                    marginTop: "70px",
                  }}
                >
                  ${`${price}`}
                </p>
              ) : (
                <>
                  <p style={{ marginTop: "15px" }}>$</p>
                  <input
                    type="number"
                    value={`${price}`}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      color: "#b2b2b2",
                      textAlign: "center",
                      verticalAlign: "middle",
                      height: "100%",
                      borderRadius: "100%",
                    }}
                  ></input>
                </>
              )}
            </div>
          </div>
          <div
            className="item position-relative"
            style={{
              backgroundImage: `url("${
                item1Image.itemImgURl != undefined
                  ? item1Image.itemImgURl
                  : "../assets/images/right-bg7-full.png"
              }") `,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20%",
              zIndex: "1",
              cursor: "pointer",
              height: "250px",
            }}
          >
            {isLive ? null : (
              <input
                type="file"
                onChange={(e) => FoodImageChange(e, "1")}
                style={{
                  cursor: isLive ? "none" : "pointer",
                  position: "absolute",
                  margin: "0",
                  padding: "0",
                  height: "100%",
                  outline: "none",
                  width: "100%",
                  opacity: "0",
                }}
              />
            )}

            <div className="price_item">
              {/* <div className="price">
                <p style={{ marginTop: "15px" }}>$</p>
                <input
                  type="number"
                  value={`${price}`}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: "#b2b2b2",
                    textAlign: "center",
                    verticalAlign: "middle",
                    height: "100%",
                    borderRadius: "100%",
                  }}></input>
              </div>
              <div className="item">
                <input
                  type="text"
                  onChange={e => {
                    setItem1(e.target.value);
                  }}
                  value={item1}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: "#b2b2b2",
                    textAlign: "center",
                    verticalAlign: "middle",

                    borderRadius: "100%",
                  }}
                />
              </div> */}
            </div>
          </div>
          <div className="links">
            {isLive ? (
              <a style={{ cursor: "pointer" }} onClick={handleShow}>
                <div className="link d-flex flex-column">
                  <img src="../assets/images/ticket.png" alt="logo" />
                  <p>Reciept</p>
                </div>
              </a>
            ) : (
              <a style={{ cursor: "no-drop" }}>
                <div className="link d-flex flex-column">
                  <img src="../assets/images/ticket.png" alt="logo" />
                  <p>Reciept</p>
                </div>
              </a>
            )}

            {isLive ? (
              <a style={{ cursor: "pointer" }} onClick={callTipList}>
                <div className="link d-flex flex-column">
                  <img src="../assets/images/tip.png" alt="logo" />
                  <p>Tips</p>
                </div>
              </a>
            ) : (
              <a style={{ cursor: "no-drop" }}>
                <div className="link d-flex flex-column">
                  <img src="../assets/images/tip.png" alt="logo" />
                  <p>Tips</p>
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
              <a style={{ cursor: "no-drop" }}>
                <div className="ORB_link d-flex flex-column">
                  <img src="../assets/images/take_picture.png" />
                  <p>Take Picture</p>
                </div>
              </a>
            )}
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
                      <a style={{ cursor: "pointer" }} onClick={shareOnFB}>
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
                      <a style={{ cursor: "pointer" }} onClick={shareOnTwitter}>
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

            <a style={{ cursor: "pointer" }} onClick={() => leaveCall()}>
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
                item2Image.itemImgURl != undefined
                  ? item2Image.itemImgURl
                  : "../assets/images/right-bg7-full.png"
              }") `,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20%",
              zIndex: "1",
              cursor: "pointer",
              height: "250px",
            }}
          >
            {isLive ? null : (
              <input
                type="file"
                onChange={(e) => FoodImageChange(e, "2")}
                style={{
                  cursor: isLive ? "none" : "pointer",
                  position: "absolute",
                  margin: "0",
                  padding: "0",
                  height: "100%",
                  width: "100%",
                  outline: "none",
                  opacity: "0",
                }}
              />
            )}

            <div className="price_item">
              {/* <div className="price">
                <p style={{ marginTop: "15px" }}>$</p>{" "}
                <input
                  type="number"
                  onChange={e => {
                    setPrice2(e.target.value);
                  }}
                  value={`${price2}`}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: "#b2b2b2",
                    textAlign: "center",
                    verticalAlign: "middle",
                    height: "100%",
                    borderRadius: "100%",
                  }}
                />
              </div>

              <div className="item">
                {" "}
                <input
                  type="text"
                  onChange={e => {
                    setItem2(e.target.value);
                  }}
                  value={item2}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: "#b2b2b2",
                    textAlign: "center",
                    verticalAlign: "middle",

                    borderRadius: "100%",
                  }}
                />
              </div> */}
            </div>
          </div>

          <div>
            <div
              className="item-des mx-2"
              style={{
                background: item2
                  ? "none"
                  : `url("../assets/images/left-bg4-full.png")`,
              }}
            >
              <div className="item">
                {isLive ? (
                  <p
                    style={{
                      width: "100%",
                      background: "transparent",
                      color: "rgb(178, 178, 178)",
                      textAlign: "center",
                      verticalAlign: "middle",
                      borderRadius: "34px",
                      height: "100%",
                      border: "3px solid #9297a8",
                      outline: "none",
                      paddingTop: "70px",
                    }}
                  >
                    {item2}
                  </p>
                ) : (
                  <input
                    type="text"
                    onChange={(e) => {
                      setItem2(e.target.value);
                    }}
                    value={item2}
                    style={{
                      width: "100%",
                      background: "transparent",
                      color: "rgb(178, 178, 178)",
                      textAlign: "center",
                      verticalAlign: "middle",
                      borderRadius: "34px",
                      height: "100%",
                      border: "3px solid #9297a8",
                      outline: "none",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="price">
              {isLive ? (
                <p
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    color: "#b2b2b2",
                    textAlign: "center",
                    verticalAlign: "middle",
                    height: "100%",
                    borderRadius: "100%",
                    marginTop: "70px",
                  }}
                >
                  ${`${price2}`}
                </p>
              ) : (
                <>
                  <p style={{ marginTop: "15px" }}>$</p>{" "}
                  <input
                    type="number"
                    onChange={(e) => {
                      setPrice2(e.target.value);
                    }}
                    value={`${price2}`}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      color: "#b2b2b2",
                      textAlign: "center",
                      verticalAlign: "middle",
                      height: "100%",
                      borderRadius: "100%",
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <canvas id="canvas"></canvas> */}
    </div>
  );
}

export default ChefORBPage;

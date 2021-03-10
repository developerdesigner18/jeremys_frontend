import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/chefORB.css";
import html2canvas from "html2canvas";
import { useDispatch, useSelector } from "react-redux";
import AgoraRTC from "agora-rtc-sdk-ng";
import axios from "axios";
import { socket } from "../../socketIO";

import { storeScreenShot, storeChefOrbDetails } from "../../actions/orbActions";
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
function ChefORBPage(props) {
  const [isLive, setIsLive] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [banner1Img, setBanner1Img] = useState({});
  const [banner2Img, setBanner2Img] = useState({});
  const [item1, setItem1] = useState("Item 1");
  const [item1Image, setItem1Image] = useState({});
  const [item2, setItem2] = useState("Item 2");
  const [item2Image, setItem2Image] = useState({});
  const [price, setPrice] = useState("");
  const [price2, setPrice2] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [RTC, setRTC] = useState({
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  });
  const ref = useRef();
  const menuClass = `dropdown-menu${isOpen ? " show" : ""}`;
  const setMoreIcon = () => {
    setIsOpen(!isOpen);
  };
  useOutsideClick(ref, () => {
    setIsOpen(false);
  });
  let encodedURL = encodeURI(
    `${process.env.REACT_APP_API_URL}${window.location.pathname.slice(1)}`
  );
  const dispatch = useDispatch();
  const stateData = useSelector(state => {
    // console.log("state.... ", state.user);
    return state.user;
  });
  const ORBData = useSelector(state => {
    // console.log("state.... ", state.user);
    return state.ORB;
  });

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

  const getImage = () => {
    console.log("fn called");
    html2canvas(document.querySelector("#capture"), {
      allowTaint: true,
      scrollX: 0,
      scrollY: -window.scrollY,
    }).then(canvas => {
      let file;
      canvas.toBlob(async blob => {
        file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
        let fd = new FormData();
        fd.append("id", localStorage.getItem("id"));
        fd.append("starName", "starName");
        fd.append("image", file);

        await dispatch(storeScreenShot(fd));
      });
    });
  };
  const goToLivePage = async () => {
    console.log("fn called");
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
      .then(result => {
        console.log("result-==-=--=", result.data.key);
        setOptions({ ...options, token: result.data.key });
        token = result.data.key;
      })
      .catch(err => console.log("error ", err));

    rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    setRTC(prevState => ({ ...prevState, client: rtc.client }));
    await rtc.client.join(options.appId, userId, token, null);

    // Create an audio track from the audio sampled by a microphone.
    rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    setRTC(prevState => ({
      ...prevState,
      localAudioTrack: rtc.localAudioTrack,
    }));
    // Create a video track from the video captured by a camera.
    rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    setRTC(prevState => ({
      ...prevState,
      localVideoTrack: rtc.localVideoTrack,
    }));

    // Publish the local audio and video tracks to the channel.
    await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

    rtc.client.on("user-published", async (user, mediaType) => {
      console.log("user-published!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

      // Subscribe to a remote user.
      await rtc.client.subscribe(user, mediaType);
      console.log("subscribe success-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");

      if (mediaType === "video") {
        console.log("video track!!!!!!!!");
        setSubscribed(true);
        user.videoTrack.play(`chef-remote-playerlist`);
      }
      if (mediaType === "audio") {
        user.audioTrack.play();
      }
    });
    rtc.client.on("user-unpublished", async (user, mediaType) => {
      console.log("handleUserUnpublished chef/stylist-==-=-=", user.uid);
    });

    rtc.client.on("stream-added", evt => {
      console.log("Stream added", evt);
      // evt.stream.play("fan-playerlist");
    });

    rtc.localVideoTrack.play("local-player");
    rtc.localAudioTrack.play();
    console.log("publish success!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
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
    props.history.push("/userHomepage");
  }

  const Banner1Change = event => {
    let reader = new FileReader();
    reader.onload = e => {
      setBanner1Img(prevState => ({
        ...prevState,
        bannerImg: event.target.files[0],
        bannerImgURl: e.target.result,
      }));
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  const Banner2Change = event => {
    let reader = new FileReader();
    reader.onload = e => {
      setBanner2Img(prevState => ({
        ...prevState,
        bannerImg: event.target.files[0],
        bannerImgURl: e.target.result,
      }));
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const FoodImageChange = (event, item) => {
    let reader = new FileReader();
    reader.onload = e => {
      if (item == "1") {
        // setItem1Image(e.target.result);
        setItem1Image(prevState => ({
          ...prevState,
          itemImg: event.target.files[0],
          itemImgURl: e.target.result,
        }));
      } else {
        // setItem2Image(e.target.result);
        setItem2Image(prevState => ({
          ...prevState,
          itemImg: event.target.files[0],
          itemImgURl: e.target.result,
        }));
      }
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  const handleChange = e => {
    setPrice(e.target.value);
  };
  useEffect(async () => {
    document.documentElement.scrollTop = 0;
    if (localStorage.getItem("token"))
      await dispatch(getUserWithId(localStorage.getItem("id")));
  }, []);

  useEffect(() => {
    if (stateData) {
      if (stateData.userInfo) {
        setUserInfo(stateData.userInfo.data);
      }
    }
  }, [stateData]);

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
      id="capture">
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
            }}></div>
          <div className="tips_info d-flex"></div>
        </div>
        <div className="container mt-5 d-flex top_section position-relative">
          <div
            className="rectangle_video"
            style={{
              // backgroundImage: `url("${banner1Img.bannerImgURl}") `,
              backgroundImage: `url("${
                banner1Img.bannerImgURl != undefined
                  ? banner1Img.bannerImgURl
                  : "../assets/images/style_fan_orb.png"
              }") `,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20%",
              zIndex: "1",
              cursor: "pointer",
              height: "500px",
            }}
            method="POST">
            <input
              type="file"
              onChange={e => Banner1Change(e)}
              style={{
                cursor: "pointer",
                position: "absolute",
                margin: "0",
                padding: "0",
                height: "100%",
                outline: "none",
                opacity: "0",
                width: "44%",
              }}
            />
          </div>
          <div
            className="rectangle_video"
            style={{
              // backgroundImage: `url("${banner2Img.bannerImgURl}") `,
              backgroundImage: `url("${
                banner2Img.bannerImgURl != undefined
                  ? banner2Img.bannerImgURl
                  : "../assets/images/style_fan_orb.png"
              }") `,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20%",
              zIndex: "1",
              height: "500px",
            }}
            method="POST">
            <input
              type="file"
              onChange={e => Banner2Change(e)}
              style={{
                position: "absolute",
                margin: "0",
                padding: "0",
                height: "100%",
                outline: "none",
                cursor: "pointer",
                opacity: "0",
                width: "44%",
              }}
            />
          </div>
          <div className="justify-content-center go_live_logo">
            {isLive ? null : (
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
              top: isLive ? "0" : "25px",
            }}>
            <div
              className="video_contents position-relative"
              style={{ zIndex: "2" }}>
              {subscribed ? (
                <div id="chef-remote-playerlist"></div>
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

              {/* {isLive ? <></> : <></>} */}
            </div>
          </div>
        </div>
        <div className="container items_links px-5 my-3 py-1">
          <div
            className="item position-relative"
            style={{
              backgroundImage: `url("${
                item1Image.itemImgURl != undefined
                  ? item1Image.itemImgURl
                  : "../assets/images/style_fan_orb.png"
              }") `,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20%",
              zIndex: "1",
              cursor: "pointer",
              height: "250px",
            }}
            method="POST">
            <input
              type="file"
              onChange={e => FoodImageChange(e, "1")}
              style={{
                cursor: "pointer",
                position: "absolute",
                margin: "0",
                padding: "0",
                height: "100%",
                outline: "none",
                width: "100%",
                opacity: "0",
              }}
            />
            {/* <img src="../assets/images/style_fan_orb.png" alt="logo" /> */}
            <div className="price_item">
              {/* <a href="#"> */}
              <div className="price">
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
              {/* </a> */}
              {/* <a href="#"> */}
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
              </div>
              {/* </a> */}
            </div>
          </div>
          <div className="links">
            <a style={{ cursor: isLive ? "pointer" : "no-drop" }}>
              <div className="link d-flex flex-column">
                <img src="../assets/images/ticket.png" alt="logo" />
                <p>Ticket</p>
              </div>
            </a>
            <a style={{ cursor: isLive ? "pointer" : "no-drop" }}>
              <div className="link d-flex flex-column">
                <img src="../assets/images/tip.png" alt="logo" />
                <p>Tip</p>
              </div>
            </a>
            {isLive ? (
              <a onClick={getImage}>
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
                  : "../assets/images/style_fan_orb.png"
              }") `,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              borderRadius: "20%",
              zIndex: "1",
              cursor: "pointer",
              height: "250px",
            }}
            method="POST">
            <input
              type="file"
              onChange={e => FoodImageChange(e, "2")}
              style={{
                cursor: "pointer",
                position: "absolute",
                margin: "0",
                padding: "0",
                height: "100%",
                width: "100%",
                outline: "none",
                opacity: "0",
              }}
            />
            <div className="price_item">
              <div className="price">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChefORBPage;

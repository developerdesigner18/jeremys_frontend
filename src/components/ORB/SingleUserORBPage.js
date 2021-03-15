import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/css/ORB.css";
import AgoraRTC from "agora-rtc-sdk-ng";
import { socket } from "../../socketIO";
import axios from "axios";
import swal from "sweetalert";
import { useHistory } from "react-router-dom";

import {
  storeScreenShot,
  getUserToken,
  joinedFan,
  removedJoinFan,
  getJoinedFanList,
} from "../../actions/orbActions";

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
  const [stream, setStream] = useState(null);
  const videoRef = useRef();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [availableList, setAvailableList] = useState([]);
  const [host, setHost] = useState([]);
  const ref = useRef();
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

  useOutsideClick(ref, () => {
    setIsOpen(false);
  });
  useEffect(async () => {
    socket.emit("storeLiveFans", localStorage.getItem("id"));
    document.documentElement.scrollTop = 0;
    await dispatch(getUserToken(props.location.state.id));

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

  useEffect(() => {
    if (orbState) {
      if (orbState.joinedFanList && orbState.joinedFanList.length) {
        if (orbState.joinedFanList.length >= 15) {
          swal("Info", "You cannot communicate with this user", "info");
          setOptions(prevState => ({ ...prevState, role: "audience" }));
          setAvailableList(prevState => [...prevState, orbState.joinedFanList]);
        } else {
          setOptions(prevState => ({ ...prevState, role: "host" }));
          setAvailableList(prevState => [...prevState, orbState.joinedFanList]);
        }
      } else {
        setOptions(prevState => ({ ...prevState, role: "host" }));
        setAvailableList(prevState => [...prevState, orbState.joinedFanList]);
      }
    }
  }, [orbState]);

  useEffect(async () => {
    let id;
    let token;
    let hostUser = [];
    if (props.location.state.id && props.location.state.name) {
      const dataToPass = {
        userId: props.location.state.id,
        fanId: localStorage.getItem("id"),
      };
      await dispatch(joinedFan(dataToPass));
      id = props.location.state.id;

      axios
        .get(`${process.env.REACT_APP_API_URL}api/agora/getUserToken?id=${id}`)
        .then(async result => {
          setOptions({
            ...options,
            token: result.data.data.agoraToken,
            channel: id,
          });
          console.log(
            "result.data.data.agoraToken",
            result.data.data.agoraToken
          );

          if (result.data.data.agoraToken) {
            token = result.data.data.agoraToken;
            rtc.client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
            setFanRTC(prevState => ({ ...prevState, client: rtc.client }));
            await rtc.client.setClientRole(options.role);
            // const uid = await rtc.client.join(
            //   options.appId,
            //   options.channel,
            //   token,
            //   null
            // );
            const uid = await rtc.client.join(options.appId, id, token, null);
            console.log("Meeting Joined-==-=-=", rtc.client);
            rtc.client.on("user-published", async (user, mediaType) => {
              console.log("handleUserPublished-==-=-=", user.uid);
              hostUser.push(user);
              setHost(prevState => [...prevState, hostUser]);
              const id = user.uid;
              remoteUsers[id] = user;
              //   subscribe(user, mediaType);
              await rtc.client.subscribe(user, mediaType);
              console.log("subscribe success-=-=-=-=-=-=-=-=-=");

              if (mediaType === "video") {
                user.videoTrack.play(`user-remote-playerlist`);
                // user.videoTrack.play(`other-fan-remote`);
              }
              if (mediaType === "audio") {
                user.audioTrack.play();
              }
            });
            rtc.client.on("user-unpublished", async (user, mediaType) => {
              console.log("handleUserUnpublished-==-=-=", user.uid);
              const id = user.uid;
              delete remoteUsers[id];
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
        file = new File([blob], "fileName.jpg", { type: "image/jpeg" });
        let fd = new FormData();
        fd.append("id", localStorage.getItem("id"));
        fd.append("image", file);
        fd.append("starName", "starName");

        await dispatch(storeScreenShot(fd));
      });
    });
  };

  async function leaveCall() {
    // Destroy the local audio and video tracks.
    // rtc.localAudioTrack.close();
    // rtc.localVideoTrack.close();

    // Leave the channel.
    if (fanRTC.client) {
      await fanRTC.client.leave();
    }
    socket.disconnect();
    const dataToPass = {
      fanId: localStorage.getItem("id"),
      userId: props.location.state.id,
    };
    await dispatch(removedJoinFan(dataToPass));
    props.history.push("/fanHomepage");
  }
  return (
    <div
      style={{
        background: "url('../assets/images/background_black.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        marginTop: "-48px",
      }}
      id="capture">
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
          </div>
          <div className="values">
            <div className="value_container">
              <span className="value_name">Timer</span>
              <div
                className="progress"
                style={{
                  width: "70px",
                }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: "100%",
                  }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
            </div>
            <div className="value_container">
              <span className="value_name">Tip</span>
              <div
                className="progress"
                style={{
                  width: "70px",
                }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: "60%",
                  }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
            </div>
            <div className="value_container">
              <span className="value_name">Viewers</span>
              <div
                className="progress"
                style={{
                  width: "70px",
                }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: "40%",
                  }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
            </div>
            <div className="value_container">
              <span className="value_name">Ticket Sold</span>
              <div
                className="progress"
                style={{
                  width: "70px",
                }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{
                    width: "100%",
                  }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="  row justify-content-center mx-auto  mt-5">
        <div className="row p-0 col-md-3">
          {availableList ? (
            availableList.length <= 15 ? (
              <div className="col-md-6 fan_ORB_main_cat">
                <img src="../assets/images/button_bg.png" />
              </div>
            ) : (
              availableList.map(user => {
                return (
                  <div className="col-md-6 fan_ORB_main_cat">
                    <img src={user.profileImgURl} />
                  </div>
                );
              })
            )
          ) : null}
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>{" "}
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>{" "}
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>{" "}
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
        </div>
        <div className="col-md-6 text-center">
          {console.log("host length..", host.length)}
          {host.length === 2 ? (
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
          )}
          {/* <div
            className="border border-light rounded-circle mx-auto mb-3"
            id="user-remote-playerlist"
            style={{
              height: "500px",
              width: "500px",
              borderRadius: "100%",
            }}></div> */}
          <div className="r_image">
            {isLive ? (
              <img
                src="../assets/images/r_image.png"
                style={{ height: "80px", width: "80px" }}
                te
              />
            ) : (
              <img
                src="../assets/images/disableR.png"
                style={{ height: "80px", width: "80px" }}
              />
            )}
          </div>
          <div className="container justify-content-center d-flex ORB_links mt-5">
            <a href="#">
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
            <a onClick={getImage} style={{ cursor: "pointer" }}>
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/take_picture.png" />
                <p>Take Picture</p>
              </div>
            </a>
            <a href="#">
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/time.png" />
                <p>Time</p>
              </div>
            </a>
            <a href="#">
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/short_break.png" />
                <p>Short Break</p>
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

            <a href="#">
              <div className="ORB_link d-flex flex-column">
                <img src="../assets/images/tip.png" />
                <p>Tip</p>
              </div>
            </a>
            <a href="#">
              <div
                className="ORB_link d-flex flex-column"
                onClick={() => leaveCall()}>
                <img src="../assets/images/exit.png" />
                <p>Exit</p>
              </div>
            </a>
          </div>
        </div>
        <div className="row p-0 col-md-3">
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>{" "}
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>{" "}
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>{" "}
          <div className="col-md-6 fan_ORB_main_cat">
            <img src="../assets/images/button_bg.png" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleUserORBPage;

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
  storeScreenShot,
  storeOnlineUser,
  removeOnlineUser,
  getJoinedFanList,
  changeUserStatus,
  storeLiveStream,
  deleteStream,
  storeHostUId,
  changeRValue,
} from "../../actions/orbActions";
import {getUserWithId} from "../../actions/userActions";
import Timer from "../ORBTicketComponents/Timer";
import Seat from "../ORBTicketComponents/Seat";
import GenerateTicket from "../ORBTicketComponents/GenerateTicket";
import moment from "moment";

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
  const [seatArray, setSeatArray] = useState([]);
  const [isMute, setIsMute] = useState(true);
  const [ORB, setORB] = useState({
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  });
  const rtc = {
    client: null,
    localAudioTrack: null,
    localVideoTrack: null,
  };
  const menuClass = `dropdown-menu${isOpen ? " show" : ""}`;
  useOutsideClick(ref, () => {
    setIsOpen(false);
  });
  useEffect(async () => {
    document.documentElement.scrollTop = 0;
    await dispatch(getUserWithId(localStorage.getItem("id")));

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
      if (subscribedUsers) setTimeout(() => setTime(time - 1), 1000);
    } else {
      setTime(0);
      // await leaveCall();
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
  const setMoreIcon = () => {
    setIsOpen(!isOpen);
  };

  const callGoToLive = async () => {
    console.log("seats and time... ", seats, time);
    if (seats > 0 && time > 0) {
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
          console.log("result-==-=--=", result.data.key);
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

      await rtc.client.enableDualStream();
      // Create an audio track from the audio sampled by a microphone.
      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      setORB(prevState => ({
        ...prevState,
        localAudioTrack: rtc.localAudioTrack,
      }));
      // Create a video track from the video captured by a camera.
      rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      setORB(prevState => ({
        ...prevState,
        localVideoTrack: rtc.localVideoTrack,
      }));

      rtc.localVideoTrack.play("local-player");
      rtc.localAudioTrack.play();

      // Publish the local audio and video tracks to the channel.
      await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

      rtc.client.on("user-published", async (user, mediaType) => {
        console.log("user-published!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
        host.push(user);

        // Subscribe to a remote user.
        await rtc.client.subscribe(user, mediaType);
        await dispatch(changeUserStatus());
        console.log("subscribe success-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=", host);
        await dispatch(getJoinedFanList(localStorage.getItem("id")));

        let agoraClass = document.getElementById("fan-remote-playerlist");

        if (mediaType === "video") {
          subscribedValue = true;
          setSubscribedUsers(subscribedValue);
          for (let i = 0; i < host.length + 1; i++) {
            console.log("i.......", i);
            if (i == 3) {
              if (document.getElementById(`fan-ORB${i}`)) {
                document
                  .getElementById(`fan-ORB${i}`)
                  .appendChild(<img src="../assets/images/live-btn.png" />);
              }
            } else if (i == 17) {
              if (document.getElementById(`fan-ORB${i}`)) {
                document
                  .getElementById(`fan-ORB${i}`)
                  .appendChild(
                    <img
                      src="../assets/images/r_image.png"
                      style={{cursor: "pointer"}}
                      onClick={callRoarFunction}
                    />
                  );
              }
            } else {
              let playerWrapper = document.createElement("div");
              playerWrapper.setAttribute("id", `player-wrapper-${user.uid}`);
              document.getElementById(`fan-ORB${i}`).appendChild(playerWrapper);
              user.videoTrack.play(`player-wrapper-${user.uid}`);
            }
          }
        } else {
          rtc.client.on("media-reconnect-start", uid => {
            console.log("media-reconnect-start event called.............", uid);
          });
        }
        if (mediaType === "audio") {
          // user.audioTrack.play();
        } else {
          rtc.client.on("media-reconnect-start", uid => {
            console.log("media-reconnect-start event called.............", uid);
          });
        }
      });
      rtc.client.on("user-unpublished", async (user, mediaType) => {
        console.log("handleUserUnpublished-==-=-=", user.uid);
        const id = user.uid;
      });

      console.log("publish success!-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
    } else {
      swal("Info", "Please fill up the show time and seats!", "info");
    }
  };

  const callRoarFunction = async () => {
    console.log("fn called");
    setIsMute(!isMute);

    const dataToPass = {
      userId: localStorage.getItem("id"),
      muteForFan: isMute,
    };
    console.log("data to passs ", dataToPass);
    await dispatch(changeRValue(dataToPass));
  };

  function showHosts() {
    let hosts = [];
    for (let i = 0; i < seats; i++) {
      if (i == 3) {
        hosts.push(
          <div className="ORB_main_cat" id={`fan-ORB${i}`}>
            {subscribedUsers ? (
              <></>
            ) : (
              <img src="../assets/images/live-btn.png" />
            )}
          </div>
        );
      } else if (i == 17) {
        hosts.push(
          <div className="ORB_main_cat" id={`fan-ORB${i}`}>
            <img
              src="../assets/images/r_image.png"
              onClick={callRoarFunction}
            />
          </div>
        );
      } else {
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

  async function leaveCall() {
    // Destroy the local audio and video tracks.
    if (ORB.client && ORB.localAudioTrack && ORB.localVideoTrack) {
      ORB.localAudioTrack.close();
      ORB.localVideoTrack.close();

      // Leave the channel.
      await ORB.client.leave();
    }
    socket.disconnect();
    props.history.push("/userHomepage");
    await dispatch(removeOnlineUser());
    await dispatch(deleteStream());
  }

  useEffect(() => {
    if (stateData) {
      let list;
      setTimeout(() => {
        if (stateData.joinedFanList && stateData.joinedFanList.length) {
          if (stateData.joinedFanList.length >= 15) {
            swal("Info", "You cannot communicate with this user", "info");
          } else {
            setFanList(prevState => [...prevState, stateData.joinedFanList]);
          }
        } else {
          setFanList(prevState => [...prevState, stateData.joinedFanList]);
        }
      }, 5000);
    }
  }, [stateData]);

  useEffect(() => {
    if (stateUser) {
      console.log("state user............. ", stateUser);
      if (stateUser.userInfo) {
        setUserDetail(stateUser.userInfo);
      }
    }
  }, [stateUser]);

  let encodedURL = encodeURI(
    `${process.env.REACT_APP_API_URL}${window.location.pathname.slice(1)}`
  );

  const callShortBreak = async () => {
    console.log("callShortBreak fn callled!!!!!!!!!!!!");
    setIsbreak(!isBreak);

    if (ORB.localAudioTrack && ORB.localVideoTrack) {
      await ORB.localVideoTrack.setEnabled(isBreak);
      await ORB.localAudioTrack.setEnabled(isBreak);
    }
  };

  const showTimerModal = () => {
    setShow(true);
    setShowTimer(!showTimer);
    setShowTicket(false);
    setShowSeat(false);

    if (time) {
      setTimeOnTicket(time);
    }
  };

  const showSeatModal = () => {
    setShow(true);
    setShowSeat(!showSeat);
    setShowTimer(false);
    setShowTicket(false);
  };

  const showTicketModal = () => {
    setShow(true);
    setShowTicket(!showTimer);
    setShowSeat(false);
    setShowTimer(false);
    console.log("time and seat... ", time, seats);
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
      <div className="container ORB_videos_container mt-3 player">
        {isLive ? (
          showHosts()
        ) : (
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
            <div className="r_image">
              {isLive ? (
                <img src="../assets/images/r_image.png" />
              ) : (
                <img src="../assets/images/disableR.png" />
              )}
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
      </div>
      <div className="container justify-content-center d-flex ORB_links mt-5">
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
              <p>Seat</p>
            </div>
          </a>
        ) : (
          <a style={{cursor: "pointer"}} onClick={showSeatModal}>
            <div className="ORB_link d-flex flex-column">
              <img src="../assets/images/seat.png" />
              <p>Seat</p>
            </div>
          </a>
        )}

        {isLive ? (
          <a onClick={getImage}>
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
            <p>Time</p>
          </div>
        </a>
        <a
          style={{cursor: isLive ? "pointer" : "no-drop"}}
          onClick={callShortBreak}>
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

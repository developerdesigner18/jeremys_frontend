import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/fan_homepage.css";
import Header from "../header/Header";
import {
  getAllArtists,
  getFromCommunity,
  addToCommunity,
  removeFromCommunity,
  getUserWithId,
} from "../../actions/userActions";
import { getFollowing } from "../../actions/followActions";
import { useSelector, useDispatch } from "react-redux";
import Slider from "react-slick";
import TinderCard from "react-tinder-card";
import { socket } from "../../socketIO";
import { useHistory } from "react-router-dom";

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
// const socket = io("http://localhost:8000");

function FanHomePage(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [allArtists, setAllArtists] = useState([]);
  const [userInfo, setUserInfo] = useState();
  const [loggedInUserFollowing, setloggedInUserFollowing] = useState(0);
  const [starsFollowers, setstarsFollowers] = useState([]);
  const [community, setCommunity] = useState([]);
  const [communityOnline, setCommunityOnline] = useState([]);
  const [Find, setfind] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [touchStartY, setTouchStartY] = React.useState(0);
  const [touchStartX, setTouchStartX] = React.useState(0);
  const stateData = useSelector(state => state.user);
  const followData = useSelector(state => state.follow);
  const ORBState = useSelector(state => state.ORB);
  const [category, setCategory] = useState("music");
  const [subcategory, setSubCategory] = useState("pop");
  const [addToCommunityMsg, setaddToCommunityMsg] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [onlineCheck, setOnlineCheck] = useState(true);

  const ref = useRef();
  const _isMounted = useRef(true);

  const menuClass = `dropdown-menu${isOpen ? " show" : ""}`;

  useOutsideClick(ref, () => {
    setIsOpen(false);
  });

  function openCity(evt, eventName) {
    console.log("fn called", category, subcategory);
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(eventName).style.display = "block";
    evt.currentTarget.className += " active";

    if (eventName == "food") {
      socket.emit("chekCategory", eventName, subFood[0]);
    } else if (eventName == "style") {
      socket.emit("chekCategory", eventName, subStyle[0]);
    } else if (eventName == "body") {
      socket.emit("chekCategory", eventName, subBody[0]);
    } else {
      socket.emit("chekCategory", eventName, subMusic[0]);
    }

    socket.on("onlineUsers", userList => {
      console.log("userlist ", userList);
      if (userList.length) {
        userList = userList.filter(
          (value, index, array) =>
            index === array.findIndex(data => value._id == data._id)
        );
        setCommunityOnline(userList);
        // setOnlineCheck(true);
      } else {
        // setOnlineCheck(false);
        setCommunityOnline(userList);
      }
    });
  }
  const handleDragStart = e => {
    var img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    e.dataTransfer.setDragImage(img, 0, 0);
    setTouchStartY(e.clientY);
    setTouchStartX(e.clientX);
  };

  const handleDrag = (e, fanID) => {
    var img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    e.dataTransfer.setDragImage(img, 0, 0);
    let dragY = e.clientY - touchStartY;
    let dragX = e.clientX - touchStartX;
    if (dragY > -75) {
      if (dragX > 0) {
        if (dragX < 75) {
          document.getElementById(fanID).style.transitionTimingFunction =
            "ease-in-out";
          document.getElementById(
            fanID
          ).style.transform = `translate(${dragX}px,${dragY}px)`;
          document.getElementById(fanID).style.zIndex = "99";
        }
      } else {
        if (dragX > -75) {
          document.getElementById(
            fanID
          ).style.transform = `translate(${dragX}px,${dragY}px)`;
          document.getElementById(fanID).style.zIndex = "99";
        }
      }
    }
  };
  const handleDragEnd = async (e, fanID, profileImgURl) => {
    let data;
    document.getElementById(fanID).style.transitionTimingFunction =
      "ease-in-out";
    document.getElementById(fanID).style.transform = `translate(0,0)`;
    if (touchStartY - e.clientY > 150) {
      console.log("swiped UP");
    }

    if (e.clientY - touchStartY > 150) {
      console.log("swiped down");
      data = dispatch(addToCommunity(fanID));
      console.log("response=-=-=", data);
    }
  };
  useEffect(() => {
    if (
      localStorage.getItem("type") === "fan" ||
      localStorage.getItem("type") === "Fan"
    ) {
    } else {
      props.history.push("/");
    }
    socket.emit("chekCategory", category, subcategory);

    socket.emit("storeLiveFans", localStorage.getItem("id"));

    socket.on("onlineUsers", userList => {
      if (userList.length) {
        userList = userList.filter(
          (value, index, array) =>
            index === array.findIndex(data => value._id == data._id)
        );
        setCommunityOnline(userList);
        // setOnlineCheck(true);
      } else {
        // setOnlineCheck(false);
        setCommunityOnline(userList);
      }
    });
    dispatch(getUserWithId(localStorage.getItem("id")));

    dispatch(getAllArtists(category, subcategory));
    dispatch(getFollowing(localStorage.getItem("id")));
    dispatch(getFromCommunity(category, subcategory));

    return () => {
      // ComponentWillUnmount in Class Component

      socket.on("disconnect", () => {
        console.log("disconnect from client side called");
        localStorage.getItem("id");
      });
      _isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (stateData) {
      console.log("stateDATA=----------", stateData);
      if (stateData.userInfo) {
        setUserInfo(stateData.userInfo);
      }
      if (stateData.artists) setAllArtists(stateData.artists);
      if (stateData.community) {
        // if (community.length == 0) {
        setOnlineCheck(false);
        setCommunity(stateData.community);
        // }
        setisLoading(false);
      }
      if (stateData.communityError) {
        // setCommunity([]);
        setisLoading(false);
      }

      if (stateData.addcommunity) {
        setisLoading(false);
        dispatch(getFollowing(localStorage.getItem("id")));
        setaddToCommunityMsg(stateData.addcommunity);
      }
    }
  }, [stateData]);
  useEffect(() => {
    if (followData) {
      if (followData.following) {
        if (followData.following.followerId == localStorage.getItem("id")) {
          setloggedInUserFollowing(followData.following.message);
        }
      }
    }
  }, [followData]);

  const getAllArtist = () => {
    console.log("getAllArtists=--=-=-=-=-=", stateData);
    // setAllArtists(stateData.artists);
    setisLoading(true);
    dispatch(getAllArtists(category, subcategory));
  };

  var subMusic = [
    "pop",
    "rnb",
    "jazz",
    "ballad",
    "disco",
    "bossa nova",
    "classical",
    "orchestra",
    "blues",
    "country",
    "latin",
    "rock & roll",
    "heavy metal",
  ];
  var subFood = [
    "italian",
    "japanese",
    "korean",
    "thai",
    "mexican",
    "indian",
    "vietnam",
    "mediterranean",
    "european",
    "arabian",
    "pinoy",
    "chinese",
    "american bbq",
  ];
  var subStyle = [
    "clothing",
    "collectibles",
    "vintage",
    "bridal",
    "make-up Accessories",
  ];
  var subBody = ["yoga", "zumba", "body building", "gymnastics", "aerobics"];
  var musicData = [
    { url: 123, name: "M1" },
    { url: 123, name: "M2" },
    { url: 123, name: "M3" },
    { url: 123, name: "M4" },
    { url: 123, name: "M5" },
    { url: 123, name: "M6" },
    { url: 123, name: "M7" },
    { url: 123, name: "M8" },
    { url: 123, name: "M9" },
    { url: 123, name: "M10" },
    { url: 123, name: "M11" },
    { url: 123, name: "M12" },
    { url: 123, name: "M13" },
    { url: 123, name: "M14" },
    { url: 123, name: "M15" },
    { url: 123, name: "M16" },
  ];

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
  };

  function showCircleDiv(array) {
    let newDiv = [];
    for (let i = 0; i < array.length / 4; i++) {
      newDiv.push(<div className="category_video vids">{insideDiv(i)}</div>);
    }
    return newDiv;
  }
  function insideDiv(i) {
    let divs = [];
    for (var j = 4 * i; j < 4 * (i + 1); j++) {
      divs.push(
        <div className="profile_images">
          <img src="http://54.236.46.101:8000/default/profile.jpg" />

          <p style={{ color: "white" }}>{musicData[j].name}</p>
        </div>
      );
    }
    return divs;
  }
  const swiped = (direction, fanID) => {
    console.log("direction-=-=-=", direction);
    if (direction == "up") {
      dispatch(getFollowing(localStorage.getItem("id")));
      dispatch(removeFromCommunity(fanID));
    }
  };
  const outOfFrame = name => {
    dispatch(getFromCommunity(category, subcategory));
  };
  const swipedFind = (direction, fanID) => {
    console.log("direction-=-=-=", direction);
    if (direction == "down") {
      // setSwipedDown(false);
      dispatch(getFollowing(localStorage.getItem("id")));
      dispatch(addToCommunity(fanID));
    }
  };
  const outOfFrameFind = async fanID => {
    // setSwipedDown(true);
  };

  const setMoreIcon = () => {
    setIsOpen(!isOpen);
    setfind(false);
    console.log("fn called ", Find);
  };

  const callLogout = () => {
    localStorage.clear();
    props.history.push("/");
  };

  const callSubCategory = (category, value) => {
    setSubCategory(value);
    socket.emit("chekCategory", category, value);

    socket.on("onlineUsers", userList => {
      console.log("userlist ", userList);
      if (userList.length) {
        userList = userList.filter(
          (value, index, array) =>
            index === array.findIndex(data => value._id == data._id)
        );
        setCommunityOnline(userList);
        // setOnlineCheck(true);
      } else {
        // setOnlineCheck(false);
        setCommunityOnline(userList);
      }
    });
  };

  return (
    <div className="container">
      <div className="form_container px-3 px-md-5">
        <Header />

        <div className="tabs_image">
          <div className="tab">
            <div className="tab1">
              <button
                className="tablinks active"
                onClick={event => {
                  openCity(event, "music");
                  setCategory("music");
                  setisLoading(true);
                  setSubCategory(subMusic[0]);
                  if (Find) {
                    dispatch(getAllArtists("music", subMusic[0]));
                  } else {
                    dispatch(getFromCommunity("music", subMusic[0]));
                  }
                }}>
                MUSIC
              </button>
            </div>
            <div className="tab2">
              <button
                className="tablinks"
                onClick={event => {
                  setSubCategory(subFood[0]);
                  setCategory("food");
                  setisLoading(true);
                  openCity(event, "food");
                  if (Find) {
                    dispatch(getAllArtists("food", subFood[0]));
                  } else {
                    dispatch(getFromCommunity("food", subFood[0]));
                  }
                }}>
                FOOD
              </button>
            </div>
            <div className="fan_image">
              <div className="">
                <img
                  src={
                    userInfo
                      ? userInfo.data.profileImgURl != "" &&
                        userInfo.data.profileImgURl != null
                        ? userInfo.data.profileImgURl
                        : "http://54.236.46.101:8000/default/profile.jpg"
                      : "http://54.236.46.101:8000/default/profile.jpg"
                  }
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src =
                      "http://54.236.46.101:8000/default/profile.jpg";
                  }}
                />
                <div
                  className="position-relative"
                  style={{ textAlign: "center" }}>
                  <span style={{ textTransform: "capitalize" }}>
                    <i className="fas fa-heart mr-1" style={{ color: "red" }} />{" "}
                    FOLLOWING: {loggedInUserFollowing}
                  </span>
                </div>
              </div>
            </div>
            <div className="tab3">
              <button
                className="tablinks"
                onClick={event => {
                  setSubCategory(subStyle[0]);
                  setisLoading(true);
                  openCity(event, "style");
                  setCategory("style");
                  if (Find) {
                    dispatch(getAllArtists("style", subStyle[0]));
                  } else {
                    dispatch(getFromCommunity("style", subStyle[0]));
                  }
                }}>
                STYLE
              </button>
            </div>
            <div className="tab4">
              <button
                className="tablinks"
                onClick={event => {
                  setisLoading(true);
                  setSubCategory(subBody[0]);
                  openCity(event, "body");
                  setCategory("body");
                  if (Find) {
                    dispatch(getAllArtists("body", subBody[0]));
                  } else {
                    dispatch(getFromCommunity("body", subBody[0]));
                  }
                }}>
                BODY
              </button>
            </div>
          </div>
          <div id="music" className="tabcontent active">
            <Slider
              {...settings}
              className="mb-4"
              style={{ background: "#333333", marginBottom: "25px" }}>
              {subMusic.map((value, i) => {
                return (
                  <div className="cats_content">
                    <h3
                      className={
                        subcategory == value ? "py-1 activeSubTab" : "py-1"
                      }
                      style={{
                        color: "#ffffff",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "1.8px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer",
                        marginBottom: "0",
                      }}
                      onClick={() => {
                        callSubCategory("music", value);
                        if (Find) {
                          setisLoading(true);
                          dispatch(getAllArtists("music", value));
                        } else {
                          setisLoading(true);
                          dispatch(getFromCommunity("music", value));
                        }
                        {
                          console.log(
                            "  subcategory == value",
                            subcategory == value
                          );
                        }
                      }}>
                      {value}
                    </h3>
                  </div>
                );
              })}
            </Slider>
          </div>
          <div id="food" className="tabcontent">
            <Slider
              {...settings}
              style={{ background: "#333333", marginBottom: "25px" }}>
              {subFood.map((value, i) => {
                return (
                  <div className="cats_content">
                    <h3
                      className={
                        subcategory == value ? "py-1 activeSubTab" : "py-1"
                      }
                      style={{
                        color: "#ffffff",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "1.8px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer",
                        marginBottom: "0",
                      }}
                      onClick={() => {
                        callSubCategory("food", value);
                        if (Find) {
                          setisLoading(true);
                          dispatch(getAllArtists("food", value));
                        } else {
                          setisLoading(true);
                          dispatch(getFromCommunity("food", value));
                        }
                        {
                          console.log(
                            "  subcategory == value",
                            subcategory == value
                          );
                        }
                      }}>
                      {value}
                    </h3>
                  </div>
                );
              })}
            </Slider>
          </div>
          <div id="style" className="tabcontent">
            <Slider
              {...settings}
              style={{ background: "#333333", marginBottom: "25px" }}>
              {subStyle.map((value, i) => {
                return (
                  <div className="cats_content">
                    <h3
                      className={
                        subcategory == value ? "py-1 activeSubTab" : "py-1"
                      }
                      style={{
                        color: "#ffffff",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "1.8px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer",
                        marginBottom: "0",
                      }}
                      onClick={() => {
                        callSubCategory("style", value);
                        if (Find) {
                          setisLoading(true);
                          dispatch(getAllArtists("style", value));
                        } else {
                          setisLoading(true);
                          dispatch(getFromCommunity("style", value));
                        }
                      }}>
                      {value}
                    </h3>
                  </div>
                );
              })}
            </Slider>
          </div>
          <div id="body" className="tabcontent">
            <Slider
              {...settings}
              style={{ background: "#333333", marginBottom: "25px" }}>
              {subBody.map((value, i) => {
                return (
                  <div className="cats_content">
                    <h3
                      className={
                        subcategory == value ? "py-1 activeSubTab" : "py-1"
                      }
                      style={{
                        color: "#ffffff",
                        fontSize: "14px",
                        textTransform: "uppercase",
                        letterSpacing: "1.8px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        cursor: "pointer",
                        marginBottom: "0",
                      }}
                      onClick={() => {
                        callSubCategory("body", value);
                        if (Find) {
                          setisLoading(true);
                          dispatch(getAllArtists("body", value));
                        } else {
                          setisLoading(true);
                          dispatch(getFromCommunity("body", value));
                        }
                      }}>
                      {value}
                    </h3>
                  </div>
                );
              })}
            </Slider>
          </div>

          <div
            style={{
              alignItems: "right",
              display: "flex",
              flexDirection: "row-reverse",
            }}>
            <span>
              {onlineCheck ? "Currently Online" : "Currently Offline"}
            </span>
            <label className="switch">
              <input
                type="checkbox"
                value={onlineCheck}
                checked={onlineCheck}
                onChange={() => setOnlineCheck(!onlineCheck)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          {isLoading ? (
            <div className="loader my-5"></div>
          ) : Find ? (
            <div className=" row vids">
              {allArtists.length != 0 ? (
                allArtists.map((fan, i) => {
                  return (
                    <div
                      // onClick={() => console.log("Clicked-=-=-=")}
                      onClick={() => console.log("Clicked-=-=-=")}
                      className="profile_images col-sm-3 col-md-3  my-3"
                      style={{ textAlign: "center", cursor: "pointer" }}
                      key={i}>
                      {/* <div
                        id={fan._id}
                        onDragStart={(e) => handleDragStart(e)}
                        onDrag={(e) => handleDrag(e, fan._id)}
                        onDragEnd={(e) => {
                          handleDragEnd(e, fan._id, fan.profileImgURl);
                        }}
                      > */}
                      <TinderCard
                        // ref={this.addToRefs}
                        // className="swipe col-md-12 "
                        // key={index.id}
                        onSwipe={dir => swipedFind(dir, fan._id)}
                        onCardLeftScreen={() => outOfFrameFind(fan._id)}
                        preventSwipe={["left", "right", "up", "down"]}>
                        <img
                          id={fan._id}
                          className="draggableImg"
                          src={
                            fan.profileImgURl != "" && fan.profileImgURl != null
                              ? fan.profileImgURl
                              : "http://54.236.46.101:8000/default/profile.jpg"
                          }
                          onError={e => {
                            e.target.onerror = null;
                            e.target.src =
                              "http://54.236.46.101:8000/default/profile.jpg";
                          }}
                        />
                        <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                        {/* </div> */}
                      </TinderCard>
                    </div>
                  );
                })
              ) : (
                <div style={{ margin: "auto" }}>
                  <span>
                    No {subcategory}{" "}
                    {category == "music"
                      ? "stars"
                      : category == "body"
                      ? "trainers"
                      : category == "style"
                      ? "stylists"
                      : category == "food"
                      ? "chefs"
                      : "artists"}{" "}
                    found
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className=" row vids">
              {onlineCheck ? (
                communityOnline.length != 0 ? (
                  communityOnline.map((fan, i) => {
                    return (
                      <div
                        className="profile_images col-sm-3 col-md-3  my-3"
                        style={{ textAlign: "center" }}
                        key={i}>
                        {" "}
                        {/* <div
                        id={fan._id}
                        onDragStart={(e) => handleDragStart(e)}
                        onDrag={(e) => handleDrag(e, fan._id)}
                        onDragEnd={(e) => {
                          handleDragEnd(e, fan._id, fan.profileImgURl);
                        }}
                      > */}
                        <TinderCard
                          // ref={this.addToRefs}
                          // className="swipe col-md-12 "
                          // key={index.id}
                          onSwipe={dir => swiped(dir, fan._id)}
                          onCardLeftScreen={() => outOfFrame(fan._id)}
                          preventSwipe={["down", "left", "right"]}>
                          <img
                            className="draggableImg"
                            src={
                              fan.profileImgURl != "" &&
                              fan.profileImgURl != null
                                ? fan.profileImgURl
                                : "http://54.236.46.101:8000/default/profile.jpg"
                            }
                            onError={e => {
                              e.target.onerror = null;
                              e.target.src =
                                "http://54.236.46.101:8000/default/profile.jpg";
                            }}
                          />
                          <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                        </TinderCard>
                        {/* </div> */}
                      </div>
                    );
                  })
                ) : (
                  <div style={{ margin: "auto" }}>
                    <span>
                      No {subcategory}{" "}
                      {category == "music"
                        ? "stars"
                        : category == "body"
                        ? "trainers"
                        : category == "style"
                        ? "stylists"
                        : category == "food"
                        ? "chefs"
                        : "artists"}{" "}
                      found online in your community
                    </span>
                  </div>
                )
              ) : community.length != 0 ? (
                community.map((fan, i) => {
                  return (
                    <div
                      className="profile_images col-sm-3 col-md-3  my-3"
                      style={{ textAlign: "center" }}
                      key={i}>
                      {" "}
                      {/* <div
                        id={fan._id}
                        onDragStart={(e) => handleDragStart(e)}
                        onDrag={(e) => handleDrag(e, fan._id)}
                        onDragEnd={(e) => {
                          handleDragEnd(e, fan._id, fan.profileImgURl);
                        }}
                      > */}
                      <TinderCard
                        // ref={this.addToRefs}
                        // className="swipe col-md-12 "
                        // key={index.id}
                        onSwipe={dir => swiped(dir, fan._id)}
                        onCardLeftScreen={() => outOfFrame(fan._id)}
                        preventSwipe={["down", "left", "right"]}>
                        <img
                          className="draggableImg"
                          src={
                            fan.profileImgURl != "" && fan.profileImgURl != null
                              ? fan.profileImgURl
                              : "http://54.236.46.101:8000/default/profile.jpg"
                          }
                          onError={e => {
                            e.target.onerror = null;
                            e.target.src =
                              "http://54.236.46.101:8000/default/profile.jpg";
                          }}
                        />
                        <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                      </TinderCard>
                      {/* </div> */}
                    </div>
                  );
                })
              ) : (
                <div style={{ margin: "auto" }}>
                  <span>
                    No {subcategory}{" "}
                    {category == "music"
                      ? "stars"
                      : category == "body"
                      ? "trainers"
                      : category == "style"
                      ? "stylists"
                      : category == "food"
                      ? "chefs"
                      : "artists"}{" "}
                    found in your community
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="main_links d-flex pt-5 mt-5">
            <div className="down_links">
              <a
                onClick={event => {
                  setisLoading(true);
                  dispatch(getFromCommunity(category, subcategory));
                  setfind(false);
                }}>
                <img
                  src="../assets/images/1.png"
                  style={
                    Find == false && !isOpen
                      ? {
                          boxShadow: "0 0 10px 2px #ddd",
                          cursor: "pointer",
                          borderRadius: "100%",
                        }
                      : { cursor: "pointer" }
                  }
                />
              </a>
              <div className="link_text mt-2">Home</div>
            </div>
            <div className="down_links">
              <a
                onClick={event => {
                  setfind(true);

                  getAllArtist();
                }}>
                <img
                  src="../assets/images/2.png"
                  style={
                    Find == true
                      ? {
                          boxShadow: "0 0 10px 2px #ddd",
                          cursor: "pointer",
                          borderRadius: "100%",
                        }
                      : { cursor: "pointer" }
                  }
                />
              </a>
              <div className="link_text mt-2">Find</div>
            </div>
            <div
              className="down_links dropup"
              onClick={() => setMoreIcon()}
              ref={ref}>
              <a
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                <img
                  src="../assets/images/3.png"
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
              </a>
              <div className="link_text mt-2">More</div>
              <div className={menuClass} style={{ background: "#333333" }}>
                <ul className="menu_item">
                  <li
                    className="dropdown-item menu more_list"
                    onClick={() => props.history.push("/profile")}>
                    PROFILE
                  </li>
                  <li
                    className="dropdown-item menu more_list"
                    onClick={() => history.push("/myStory")}>
                    MY STORY
                  </li>
                  <li className="dropdown-item menu more_list">MY JOURNAL</li>
                  <li className="dropdown-item menu more_list">
                    MY RATINGS AND REVIWS
                  </li>
                  <li
                    className="dropdown-item menu more_list"
                    onClick={() => props.history.push("/termsCondition")}>
                    TERMS AND CONDITION
                  </li>
                  <li
                    className="dropdown-item menu more_list"
                    onClick={() => {
                      props.history.push("/customerService");
                    }}>
                    CONTACT US
                  </li>
                </ul>
              </div>
            </div>
            <div
              className="down_links"
              onClick={callLogout}
              style={{ cursor: "pointer" }}>
              <a>
                <img src="../assets/images/4.png" />
              </a>
              <div className="link_text mt-2">Log Out</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FanHomePage;

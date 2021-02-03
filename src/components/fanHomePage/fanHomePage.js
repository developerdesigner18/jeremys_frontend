import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/fan_homepage.css";
import Header from "../header/Header";
import {
  getAllArtists,
  getFromCommunity,
  addToCommunity,
  removeFromCommunity,
} from "../../actions/userActions";
import { useSelector, useDispatch } from "react-redux";
import Slider from "react-slick";

function FanHomePage(props) {
  const dispatch = useDispatch();
  const [allArtists, setAllArtists] = useState([]);
  const [community, setCommunity] = useState([]);
  const [Find, setfind] = useState(false);
  const [touchStart, setTouchStart] = React.useState(0);
  const stateData = useSelector((state) => state.user);
  const [category, setCategory] = useState("music");
  const [subcategory, setSubCategory] = useState("pop");
  const [addToCommunityMsg, setaddToCommunityMsg] = useState("");
  const openCity = (evt, cityName) => {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  };
  const handleDragStart = (e) => {
    var img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    e.dataTransfer.setDragImage(img, 0, 0);
    setTouchStart(e.clientY);
  };

  const handleDrag = (e, fanID) => {
    console.log("handleDrag", fanID, touchStart);
    let drag = e.clientY - touchStart;
    document.getElementById(fanID).style.transform = `translate(0,${drag}px)`;
    document.getElementById(fanID).style.zIndex = "99";
  };
  const handleDragEnd = (e, fanID, profileImgURl) => {
    console.log("handleDragEnd", e.clientY, touchStart);
    document.getElementById(fanID).style.transform = `translate(0,0)`;
    if (touchStart > e.clientY) {
      console.log("swiped UP");
      dispatch(removeFromCommunity(fanID));
    }

    if (touchStart < e.clientY) {
      console.log("swiped down");
      dispatch(addToCommunity(fanID));
    }
  };
  const goToHome = () => {
    props.history.push("/");
  };
  useEffect(() => {
    dispatch(getAllArtists(category, subcategory));
    dispatch(getFromCommunity(category, subcategory));
  }, []);
  useEffect(() => {
    if (stateData) {
      if (stateData.artists) setAllArtists(stateData.artists);
      if (stateData.community) {
        setCommunity(stateData.community);
      }
      // if (stateData.addcommunityError !== addToCommunityMsg) {
      //   setaddToCommunityMsg(stateData.addcommunityError);
      // }
      // if (stateData.addcommunity !== addToCommunityMsg) {
      //   setaddToCommunityMsg(stateData.addcommunity);
      // }
      // setTimeout(() => {
      //   setaddToCommunityMsg("");
      // }, 3000);
    }
  }, [stateData]);

  const getAllArtist = () => {
    console.log("getAllArtists=--=-=-=-=-=", stateData);
    // setAllArtists(stateData.artists);
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
          <img src="http://3.84.158.108:8000/default/profile.jpg" />

          <p style={{ color: "white" }}>{musicData[j].name}</p>
        </div>
      );
    }
    return divs;
  }

  return (
    <div className="container">
      {/* {console.log(
        "stateData-=-=-=-=-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=",
        stateData
      )} */}
      <div className="form_container px-3 px-md-5">
        <Header />

        <div className="tabs_image">
          <div className="tab">
            <div className="tab1">
              <button
                className="tablinks active"
                onClick={(event) => {
                  openCity(event, "music");
                  setCategory("music");
                  setSubCategory(subMusic[0]);
                  if (Find) {
                    dispatch(getAllArtists("music", subMusic[0]));
                  } else {
                    dispatch(getFromCommunity("music", subMusic[0]));
                  }
                }}
              >
                MUSIC
              </button>
            </div>
            <div className="tab2">
              <button
                className="tablinks"
                onClick={(event) => {
                  setSubCategory(subFood[0]);
                  setCategory("food");
                  openCity(event, "food");
                  if (Find) {
                    dispatch(getAllArtists("food", subFood[0]));
                  } else {
                    dispatch(getFromCommunity("food", subFood[0]));
                  }
                }}
              >
                FOOD
              </button>
            </div>
            <div className="fan_image">
              <img src="../assets/images/fan.png" />
            </div>
            <div className="tab3">
              <button
                className="tablinks"
                onClick={(event) => {
                  setSubCategory(subStyle[0]);
                  openCity(event, "style");
                  setCategory("style");
                  if (Find) {
                    dispatch(getAllArtists("style", subStyle[0]));
                  } else {
                    dispatch(getFromCommunity("style", subStyle[0]));
                  }
                }}
              >
                STYLE
              </button>
            </div>
            <div className="tab4">
              <button
                className="tablinks"
                onClick={(event) => {
                  openCity(event, "body");
                  setSubCategory(subBody[0]);
                  setCategory("body");
                  if (Find) {
                    dispatch(getAllArtists("body", subBody[0]));
                  } else {
                    dispatch(getFromCommunity("body", subBody[0]));
                  }
                }}
              >
                BODY
              </button>
            </div>
          </div>
          {addToCommunityMsg != "" ? <div>{addToCommunityMsg}</div> : null}

          <div id="music" className="tabcontent active">
            <Slider
              {...settings}
              className="mb-4"
              style={{ background: "#333333", marginBottom: "25px" }}
            >
              {subMusic.map((value, i) => {
                return (
                  <div className="cats_content">
                    <h3
                      className="py-1"
                      style={
                        subcategory == value
                          ? {
                              color: "#ffffff",
                              borderBottom: "1.75px solid #ffffff",
                              fontSize: "14px",
                              textTransform: "uppercase",
                              letterSpacing: "1.8px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              marginBottom: "0",
                              cursor: "pointer",
                            }
                          : {
                              color: "#ffffff",
                              fontSize: "14px",
                              textTransform: "uppercase",
                              letterSpacing: "1.8px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              marginBottom: "0",
                            }
                      }
                      onClick={() => {
                        setSubCategory(value);
                        if (Find) {
                          dispatch(getAllArtists("music", value));
                        } else {
                          dispatch(getFromCommunity("music", value));
                        }
                        {
                          console.log(
                            "  subcategory == value",
                            subcategory == value
                          );
                        }
                      }}
                    >
                      {value}
                    </h3>
                  </div>
                );
              })}
            </Slider>

            {Find ? (
              <div className=" row vids">
                {allArtists.length != 0 ? (
                  allArtists.map((fan, i) => {
                    return (
                      <div
                        className="profile_images col-sm-3 col-md-3  my-3"
                        style={{ textAlign: "center" }}
                        key={i}
                      >
                        {" "}
                        <div
                          id={fan._id}
                          onDragStart={(e) => handleDragStart(e)}
                          onDrag={(e) => handleDrag(e, fan._id)}
                          onDragEnd={(e) => {
                            handleDragEnd(e, fan._id, fan.profileImgURl);
                          }}
                        >
                          <img
                            className="draggableImg"
                            src={
                              fan.profileImgURl != "" &&
                              fan.profileImgURl != null
                                ? fan.profileImgURl
                                : "http://3.84.158.108:8000/default/profile.jpg"
                            }
                            alt="Profile Img"
                          />
                          <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ margin: "auto" }}>
                    <span>No {subcategory} artists found</span>
                  </div>
                )}
              </div>
            ) : (
              // showCircleDiv(musicData)
              <div className=" row vids">
                {community.length != 0 ? (
                  community.map((fan, i) => {
                    return (
                      <div
                        className="profile_images col-sm-3 col-md-3  my-3"
                        style={{ textAlign: "center" }}
                        key={i}
                      >
                        {" "}
                        <div
                          id={fan._id}
                          onDragStart={(e) => handleDragStart(e)}
                          onDrag={(e) => handleDrag(e, fan._id)}
                          onDragEnd={(e) => {
                            handleDragEnd(e, fan._id, fan.profileImgURl);
                          }}
                        >
                          <img
                            className="draggableImg"
                            src={
                              fan.profileImgURl != "" &&
                              fan.profileImgURl != null
                                ? fan.profileImgURl
                                : "http://3.84.158.108:8000/default/profile.jpg"
                            }
                            alt="Profile Img"
                          />
                          <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ margin: "auto" }}>
                    <span>
                      No {subcategory} artists found in your community
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div id="food" className="tabcontent">
            <Slider
              {...settings}
              style={{ background: "#333333", marginBottom: "25px" }}
            >
              {subFood.map((value, i) => {
                return (
                  <div className="cats_content">
                    <h3
                      className="py-1"
                      style={
                        subcategory == value
                          ? {
                              color: "#ffffff",
                              borderBottom: "1.75px solid #ffffff",
                              fontSize: "14px",
                              textTransform: "uppercase",
                              letterSpacing: "1.8px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              marginBottom: "0",
                              cursor: "pointer",
                            }
                          : {
                              color: "#ffffff",
                              fontSize: "14px",
                              textTransform: "uppercase",
                              letterSpacing: "1.8px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              marginBottom: "0",
                            }
                      }
                      onClick={() => {
                        setSubCategory(value);
                        if (Find) {
                          dispatch(getAllArtists("food", value));
                        } else {
                          dispatch(getFromCommunity("food", value));
                        }
                        {
                          console.log(
                            "  subcategory == value",
                            subcategory == value
                          );
                        }
                      }}
                    >
                      {value}
                    </h3>
                  </div>
                );
              })}
            </Slider>

            {Find ? (
              <div className=" row vids">
                {allArtists.length != 0 ? (
                  allArtists.map((fan, i) => {
                    return (
                      <div
                        className="profile_images col-sm-3 col-md-3  my-3"
                        style={{ textAlign: "center" }}
                        key={i}
                      >
                        {" "}
                        <div
                          id={fan._id}
                          onDragStart={(e) => handleDragStart(e)}
                          onDrag={(e) => handleDrag(e, fan._id)}
                          onDragEnd={(e) => {
                            handleDragEnd(e, fan._id, fan.profileImgURl);
                          }}
                        >
                          <img
                            className="draggableImg"
                            src={
                              fan.profileImgURl != "" &&
                              fan.profileImgURl != null
                                ? fan.profileImgURl
                                : "http://3.84.158.108:8000/default/profile.jpg"
                            }
                            alt="Profile Img"
                          />
                          <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ margin: "auto" }}>
                    <span>No {subcategory} chefs found</span>
                  </div>
                )}
              </div>
            ) : (
              // showCircleDiv(musicData)
              <div className=" row vids">
                {community.length != 0 ? (
                  community.map((fan, i) => {
                    return (
                      <div
                        className="profile_images col-sm-3 col-md-3  my-3"
                        style={{ textAlign: "center" }}
                        key={i}
                      >
                        {" "}
                        <div
                          id={fan._id}
                          onDragStart={(e) => handleDragStart(e)}
                          onDrag={(e) => handleDrag(e, fan._id)}
                          onDragEnd={(e) => {
                            handleDragEnd(e, fan._id, fan.profileImgURl);
                          }}
                        >
                          <img
                            className="draggableImg"
                            src={
                              fan.profileImgURl != "" &&
                              fan.profileImgURl != null
                                ? fan.profileImgURl
                                : "http://3.84.158.108:8000/default/profile.jpg"
                            }
                            alt="Profile Img"
                          />
                          <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ margin: "auto" }}>
                    <span>No {subcategory} chefs found in your community</span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div id="style" className="tabcontent">
            <Slider
              {...settings}
              style={{ background: "#333333", marginBottom: "25px" }}
            >
              {subStyle.map((value, i) => {
                return (
                  <div className="cats_content">
                    <h3
                      className="py-1"
                      style={
                        subcategory == value
                          ? {
                              color: "#ffffff",
                              borderBottom: "1.75px solid #ffffff",
                              fontSize: "14px",
                              textTransform: "uppercase",
                              letterSpacing: "1.8px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              marginBottom: "0",
                              cursor: "pointer",
                            }
                          : {
                              color: "#ffffff",
                              fontSize: "14px",
                              textTransform: "uppercase",
                              letterSpacing: "1.8px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              marginBottom: "0",
                            }
                      }
                      onClick={() => {
                        setSubCategory(value);
                        if (Find) {
                          dispatch(getAllArtists("style", value));
                        } else {
                          dispatch(getFromCommunity("style", value));
                        }
                      }}
                    >
                      {value}
                    </h3>
                  </div>
                );
              })}
            </Slider>

            {Find ? (
              <div className=" row vids">
                {allArtists.length != 0 ? (
                  allArtists.map((fan, i) => {
                    return (
                      <div
                        className="profile_images col-sm-3 col-md-3  my-3"
                        style={{ textAlign: "center" }}
                        key={i}
                      >
                        {" "}
                        <div
                          id={fan._id}
                          onDragStart={(e) => handleDragStart(e)}
                          onDrag={(e) => handleDrag(e, fan._id)}
                          onDragEnd={(e) => {
                            handleDragEnd(e, fan._id, fan.profileImgURl);
                          }}
                        >
                          <img
                            className="draggableImg"
                            src={
                              fan.profileImgURl != "" &&
                              fan.profileImgURl != null
                                ? fan.profileImgURl
                                : "http://3.84.158.108:8000/default/profile.jpg"
                            }
                            alt="Profile Img"
                          />
                          <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ margin: "auto" }}>
                    <span>No {subcategory} stylists found</span>
                  </div>
                )}
              </div>
            ) : (
              // showCircleDiv(musicData)
              <div className=" row vids">
                {community.length != 0 ? (
                  community.map((fan, i) => {
                    return (
                      <div
                        className="profile_images col-sm-3 col-md-3  my-3"
                        style={{ textAlign: "center" }}
                        key={i}
                      >
                        {" "}
                        <div
                          id={fan._id}
                          onDragStart={(e) => handleDragStart(e)}
                          onDrag={(e) => handleDrag(e, fan._id)}
                          onDragEnd={(e) => {
                            handleDragEnd(e, fan._id, fan.profileImgURl);
                          }}
                        >
                          <img
                            className="draggableImg"
                            src={
                              fan.profileImgURl != "" &&
                              fan.profileImgURl != null
                                ? fan.profileImgURl
                                : "http://3.84.158.108:8000/default/profile.jpg"
                            }
                            alt="Profile Img"
                          />
                          <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ margin: "auto" }}>
                    <span>
                      No {subcategory} stylists found in your community
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
          <div id="body" className="tabcontent">
            <Slider
              {...settings}
              style={{ background: "#333333", marginBottom: "25px" }}
            >
              {subBody.map((value, i) => {
                return (
                  <div className="cats_content">
                    <h3
                      className="py-1"
                      style={
                        subcategory == value
                          ? {
                              color: "#ffffff",
                              borderBottom: "1.75px solid #ffffff",
                              fontSize: "14px",
                              textTransform: "uppercase",
                              letterSpacing: "1.8px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              marginBottom: "0",
                              cursor: "pointer",
                            }
                          : {
                              color: "#ffffff",
                              fontSize: "14px",
                              textTransform: "uppercase",
                              letterSpacing: "1.8px",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "pointer",
                              marginBottom: "0",
                            }
                      }
                      onClick={() => {
                        setSubCategory(value);
                        if (Find) {
                          dispatch(getAllArtists("body", value));
                        } else {
                          dispatch(getFromCommunity("body", value));
                        }
                      }}
                    >
                      {value}
                    </h3>
                  </div>
                );
              })}
            </Slider>

            {Find ? (
              <div className=" row vids">
                {allArtists.length != 0 ? (
                  allArtists.map((fan, i) => {
                    return (
                      <div
                        className="profile_images col-sm-3 col-md-3  my-3"
                        style={{ textAlign: "center" }}
                        key={i}
                      >
                        {" "}
                        <div
                          id={fan._id}
                          onDragStart={(e) => handleDragStart(e)}
                          onDrag={(e) => handleDrag(e, fan._id)}
                          onDragEnd={(e) => {
                            handleDragEnd(e, fan._id, fan.profileImgURl);
                          }}
                        >
                          <img
                            className="draggableImg"
                            src={
                              fan.profileImgURl != "" &&
                              fan.profileImgURl != null
                                ? fan.profileImgURl
                                : "http://3.84.158.108:8000/default/profile.jpg"
                            }
                            alt="Profile Img"
                          />
                          <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ margin: "auto" }}>
                    <span>No {subcategory} trainer found</span>
                  </div>
                )}
              </div>
            ) : (
              // showCircleDiv(musicData)
              <div className=" row vids">
                {community.length != 0 ? (
                  community.map((fan, i) => {
                    return (
                      <div
                        className="profile_images col-sm-3 col-md-3  my-3"
                        style={{ textAlign: "center" }}
                        key={i}
                      >
                        {" "}
                        <div
                          id={fan._id}
                          onDragStart={(e) => handleDragStart(e)}
                          onDrag={(e) => handleDrag(e, fan._id)}
                          onDragEnd={(e) => {
                            handleDragEnd(e, fan._id, fan.profileImgURl);
                          }}
                        >
                          <img
                            className="draggableImg"
                            src={
                              fan.profileImgURl != "" &&
                              fan.profileImgURl != null
                                ? fan.profileImgURl
                                : "http://3.84.158.108:8000/default/profile.jpg"
                            }
                            alt="Profile Img"
                          />
                          <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ margin: "auto" }}>
                    <span>
                      No {subcategory} trainer found in your community
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="main_links d-flex pt-5 mt-5">
            <div className="down_links">
              <a
                onClick={(event) => {
                  openCity(event, "music");
                  dispatch(getFromCommunity(category, subcategory));
                  setfind(false);
                  // getAllArtist();
                }}
              >
                <img
                  src="../assets/images/1.png"
                  style={
                    Find == false
                      ? {
                          boxShadow: "0 0 8px 2px #ddd",
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
                onClick={(event) => {
                  // openCity(event, "music");
                  setfind(true);

                  getAllArtist();
                }}
              >
                <img
                  src="../assets/images/2.png"
                  style={
                    Find == true
                      ? {
                          boxShadow: "0 0 8px 2px #ddd",
                          cursor: "pointer",
                          borderRadius: "100%",
                        }
                      : { cursor: "pointer" }
                  }
                />
              </a>
              <div className="link_text mt-2">Find</div>
            </div>
            <div className="down_links">
              <a href="#">
                <img src="../assets/images/3.png" />
              </a>
              <div className="link_text mt-2">More</div>
            </div>
            <div className="down_links">
              <a href="#">
                <img src="../assets/images/4.png" />
              </a>
              <div className="link_text mt-2">About</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FanHomePage;

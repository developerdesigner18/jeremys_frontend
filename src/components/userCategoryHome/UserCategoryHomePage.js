import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/fan_homepage.css";
import Header from "../header/Header";
import {
  getAllFans,
  getAllFollower,
  getFromCommunity,
  getFanList,
} from "../../actions/userActions";
import { getFollowers } from "../../actions/followActions";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "react-js-pagination";
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

function UserCategoryHomePage(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [currentUserdata, setCurrentUserdata] = useState();
  const stateData = useSelector(state => state.user);
  const followData = useSelector(state => state.follow);
  const [Find, setfind] = useState(false);
  const [allFans, setAllFans] = useState([]);
  const [starsFollowers, setstarsFollowers] = useState([]);
  const [allFollower, setAllFollower] = useState([]);
  const [searchFollower, setSearchFollower] = useState([]);
  const [activePage, setactivePage] = useState(0);
  const [activeFollowerPage, setactiveFollowerPage] = useState(0);
  const [Offset, setOffset] = useState(0);
  const [OffsetFollowers, setOffsetFollowers] = useState(0);
  const [touchStart, setTouchStart] = React.useState(0);
  const [perPage, setperPage] = React.useState(16);
  const [isOpen, setIsOpen] = useState(false);

  const ref = useRef();

  const menuClass = `dropdown-menu${isOpen ? " show" : ""}`;

  useOutsideClick(ref, () => {
    setIsOpen(false);
  });

  const handleDragStart = e => {
    var img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    e.dataTransfer.setDragImage(img, 0, 0);
    setTouchStart(e.clientY);
  };

  const handleDrag = (e, fanID) => {
    let drag = e.clientY - touchStart;
    document.getElementById(fanID).style.transform = `translate(0,${drag}px)`;
  };
  const handleDragEnd = (e, fanID, profileImgURl) => {
    document.getElementById(fanID).style.transform = `translate(0,0)`;
    if (touchStart > e.clientY) {
      console.log("swiped UP");
    }

    if (touchStart < e.clientY) {
      console.log("swiped down");
    }
  };
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

  const goToHome = () => {
    props.history.push("/");
  };
  const handlePageChange = pageNumberpaginate => {
    const selectedPage = pageNumberpaginate - 1;
    const offset = selectedPage * perPage;
    console.log("pageNumberpaginate-=-=-=-==--=", pageNumberpaginate);
    setactivePage(selectedPage);
    setOffset(offset);
  };
  const handleFollowerPageChange = pageNumberpaginate => {
    const selectedPage = pageNumberpaginate - 1;
    const offset = selectedPage * perPage;
    setactiveFollowerPage(selectedPage);
    setOffsetFollowers(offset);
  };

  const goToORB = () => {
    if (
      localStorage.getItem("type") == "chef" ||
      localStorage.getItem("type") == "Chef"
    ) {
      props.history.push("/chefORB");
    } else if (
      localStorage.getItem("type") == "Stylist" ||
      localStorage.getItem("type") == "stylist"
    ) {
      props.history.push("/stylistORB");
    } else {
      props.history.push("/ORBpage");
    }
  };
  const searchInputChange = value => {
    var data = allFans.filter(event => {
      return (
        event.lastName.toLowerCase().includes(value.toLowerCase()) ||
        event.firstName.toLowerCase().includes(value.toLowerCase())
      );
    });
    console.log("search data", data);
    let searchedData = [...data];
    setAllFans(searchedData);
  };

  useEffect(async () => {
    await dispatch(getFanList());
    await dispatch(getAllFollower());
    await dispatch(getAllFans());
    await dispatch(getFollowers(localStorage.getItem("id")));
  }, []);

  useEffect(async () => {
    if (stateData) {
      // console.log("stateData", stateData);
      if (stateData.userDetail) setCurrentUserdata(stateData.userDetail);
      if (stateData.followers) {
        await dispatch(getFollowers(localStorage.getItem("id")));
        console.log("use effect chage state data");
        setAllFollower(stateData.followers);
        // setSearchFollower(stateData.followers);
      }
      if (stateData.fanList) {
        setSearchFollower(stateData.fanList);
      }
      if (stateData.fans) console.log("get all fans");
    }
  }, [stateData]);

  useEffect(() => {
    if (followData) {
      if (followData.starFollowers) {
        // if (followData.followers.followerId == localStorage.getItem("id")) {
        setstarsFollowers(followData.starFollowers.message);
        // }
      }
      console.log(
        "-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=followData-=-=-=-=-=-=-=-=-=-=-=-=",
        followData
      );
    }
  }, [followData]);

  const getAllfans = () => {
    setfind(true);
    setAllFans(stateData.fans);
  };

  const clickOnHome = () => {
    console.log("getALLFANS=--=-=-=-=-=", stateData);
    setAllFollower(stateData.followers);
    // setSearchFollower(stateData.followers);
    setSearchFollower(stateData.fanList);
  };
  let indexOfFirstUser = Offset;
  let indexOfLastUser = Offset + perPage;
  let currentFans = allFans.slice(indexOfFirstUser, indexOfLastUser);

  let indexOfFirst = OffsetFollowers;
  let indexOfLast = OffsetFollowers + perPage;
  let currentFollower = searchFollower.slice(indexOfFirst, indexOfLast);

  const setMoreIcon = () => {
    setIsOpen(!isOpen);
    setfind(false);
    console.log("fn called ", Find);
  };

  const callLogout = () => {
    localStorage.clear();
    props.history.push("/");
  };

  return (
    <div className="userhomePage">
      <div className="container">
        <div className="form_container px-3 px-md-5">
          <Header />
          <div className="tabs_image">
            <div className="tab">
              <div className="tab1"></div>
              <div className="tab2">
                <button
                  className="tablinks_responsive"
                  onClick={event => {
                    openCity(event, "food");
                    goToORB();
                  }}
                  style={{
                    padding:
                      localStorage.getItem("type") === "Advertiser" ||
                      localStorage.getItem("type") === "advertiser"
                        ? "10px"
                        : "25px",
                    // fontSize:
                    //   (setMobileResponsive &&
                    //     localStorage.getItem("type") === "Advertiser") ||
                    //   localStorage.getItem("type") === "advertiser"
                    //     ? "7px"
                    //     : "10px",
                  }}>
                  {localStorage.getItem("type") === "Chef" ||
                  localStorage.getItem("type") === "chef"
                    ? "Chef's Table"
                    : localStorage.getItem("type") === "Advertiser" ||
                      localStorage.getItem("type") === "advertiser"
                    ? "Published Ad"
                    : localStorage.getItem("type") === "trainer" ||
                      localStorage.getItem("type") === "Trainer"
                    ? "Studio Live!"
                    : localStorage.getItem("type") === "Stylist" ||
                      localStorage.getItem("type") === "stylist"
                    ? "Stylist"
                    : localStorage.getItem("type") === "Star" ||
                      localStorage.getItem("type") === "star"
                    ? "Stage"
                    : localStorage.getItem("type") === "artist" ||
                      localStorage.getItem("type") === "Artist"
                    ? "Stage"
                    : ""}
                </button>
              </div>
              <div className="fan_image">
                <div>
                  {console.log("image ", currentUserdata)}
                  <img
                    // src={`../assets/images/fan.png`}
                    src={
                      currentUserdata
                        ? currentUserdata.data.profileImgURl != "" &&
                          currentUserdata.data.profileImgURl != null
                          ? currentUserdata.data.profileImgURl
                          : "https://artsiam.com:8000/default/profile.jpg"
                        : "https://artsiam.com:8000/default/profile.jpg"
                    }
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://artsiam.com:8000/default/profile.jpg";
                    }}
                  />
                  <div
                    className="position-relative"
                    style={{ textAlign: "center" }}>
                    <span style={{ textTransform: "capitalize" }}>
                      <i
                        className="fas fa-heart mr-1"
                        style={{ color: "red" }}
                      />{" "}
                      FOLLOWERS: {starsFollowers}
                    </span>
                  </div>
                </div>
              </div>
              <div className="tab3">
                <button
                  className="meet_greet_tablinks"
                  onClick={event => {
                    // openCity(event, "style");
                    goToORB();
                  }}>
                  Meet and Greet
                </button>
              </div>
              <div className="tab4"></div>
            </div>
            <div id="music" className="tabcontent active">
              <div
                className="category_empty"
                style={{ height: Find ? "40px" : "20px" }}>
                <input
                  type="search"
                  placeholder="Search.."
                  style={{ display: Find ? "block" : "none" }}
                  onChange={e => searchInputChange(e.target.value)}
                />
              </div>
              <div className=" row vids">
                {searchFollower.length != 0 ? (
                  currentFollower.map((fan, i) => {
                    return (
                      <div
                        className="profile_images col-md-3 col-sm-6 "
                        style={{ textAlign: "center" }}
                        key={i}>
                        <div>
                          <img
                            className="draggableImg"
                            src={
                              fan.profileImgURl != "" &&
                              fan.profileImgURl != null
                                ? fan.profileImgURl
                                : "https://artsiam.com:8000/default/profile.jpg"
                            }
                            onError={e => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://artsiam.com:8000/default/profile.jpg";
                            }}
                            onClick={() =>
                              history.push("/myStory", {
                                pageNumber: 1,
                                userId: fan._id,
                                isMystory: false,
                              })
                            }
                          />

                          <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                        </div>{" "}
                      </div>
                    );
                  })
                ) : (
                  <div style={{ marginLeft: "10px" }}>No fans Found</div>
                )}
              </div>
              <Pagination
                innerClass={"adminPaginate"}
                activePage={activeFollowerPage + 1}
                itemsCountPerPage={perPage}
                totalItemsCount={searchFollower.length}
                pageRangeDisplayed={5}
                onChange={handleFollowerPageChange}
              />
            </div>
            <div id="find" className="tabcontent">
              <div
                className="category_empty"
                style={{ height: Find ? "40px" : "20px" }}>
                <input
                  type="search"
                  placeholder="Search.."
                  style={{ display: Find ? "block" : "none" }}
                  onChange={e => searchInputChange(e.target.value)}
                />
              </div>
              <div className=" row vids">
                {allFans.length != 0 ? (
                  currentFans.map((fan, i) => {
                    return (
                      <div
                        className="profile_images col-md-3 col-sm-6 "
                        style={{ textAlign: "center" }}
                        key={i}>
                        <div>
                          <img
                            className="draggableImg"
                            src={
                              fan.profileImgURl != "" &&
                              fan.profileImgURl != null
                                ? fan.profileImgURl
                                : "https://artsiam.com:8000/default/profile.jpg"
                            }
                            onError={e => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://artsiam.com:8000/default/profile.jpg";
                            }}
                          />

                          <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div>No fans Found</div>
                )}
              </div>
              <Pagination
                innerClass={"adminPaginate"}
                activePage={activePage + 1}
                itemsCountPerPage={perPage}
                totalItemsCount={allFans.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
              />
            </div>
            <div id="style" className="tabcontent">
              <h3>Tokyo</h3>
              <p>Tokyo is the capital of Japan.</p>
            </div>
            <div id="food" className="tabcontent">
              <h3>London</h3>
              <p>London is the capital city of England.</p>
            </div>
            <div className="main_links d-flex">
              <div className="down_links">
                <a
                  style={
                    Find == false && !isOpen
                      ? {
                          boxShadow: "0 0 10px 2px #ddd",
                          cursor: "pointer",
                          borderRadius: "100%",
                        }
                      : { cursor: "pointer" }
                  }
                  onClick={event => {
                    setfind(false);
                    openCity(event, "music");
                    clickOnHome();
                  }}>
                  <img src="../assets/images/1.png" />
                </a>
                <div className="link_text">Home</div>
              </div>
              <div className="down_links">
                <a
                  style={
                    Find == true
                      ? {
                          boxShadow: "0 0 10px 2px #ddd",
                          cursor: "pointer",
                          borderRadius: "100%",
                        }
                      : { cursor: "pointer" }
                  }
                  onClick={event => {
                    openCity(event, "find");

                    getAllfans();
                  }}>
                  <img src="../assets/images/2.png" />
                </a>
                <div className="link_text">Find</div>
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
                      onClick={() =>
                        history.push("/myStory", {
                          pageNumber: 1,
                          userId: localStorage.getItem("id"),
                          isMystory: true,
                        })
                      }>
                      MY STORY
                    </li>
                    <li
                      className="dropdown-item menu more_list"
                      onClick={() =>
                        history.push("/myStory", {
                          pageNumber: 3,
                          userId: localStorage.getItem("id"),
                          isMystory: true,
                        })
                      }>
                      MY JOURNAL
                    </li>
                    <li
                      className="dropdown-item menu more_list"
                      onClick={() =>
                        history.push("/myStory", {
                          pageNumber: 2,
                          userId: localStorage.getItem("id"),
                          isMystory: true,
                        })
                      }>
                      MY RATINGS AND REVIEWS
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
                <div className="link_text">Log Out</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCategoryHomePage;

import React, { useEffect, useMemo, useState } from "react";
import "../../assets/css/fan_homepage.css";
import Header from "../header/Header";
import { getAllFans, getFromCommunity } from "../../actions/userActions";
import { useSelector, useDispatch } from "react-redux";

function UserCategoryHomePage(props) {
  const dispatch = useDispatch();
  const stateData = useSelector((state) => state.user);
  const [allFans, setAllFans] = useState([]);
  const [touchStart, setTouchStart] = React.useState(0);

  const handleDragStart = (e) => {
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

  const goToORB = () => {
    props.history.push("/ORBpage");
  };
  useEffect(async () => {
    dispatch(getFromCommunity("music", "jazz"));
    dispatch(getAllFans());
  }, []);
  const getAllfans = () => {
    console.log("getALLFANS=--=-=-=-=-=", stateData);
    setAllFans(stateData.fans);
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
                  onClick={(event) => {
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
                  }}
                >
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
                <img
                  src={
                    localStorage.getItem("type") === "Chef" ||
                    localStorage.getItem("type") === "chef"
                      ? `../assets/images/chef.png`
                      : `../assets/images/fan.png`
                  }
                />
              </div>
              <div className="tab3">
                <button
                  className="meet_greet_tablinks"
                  onClick={(event) => {
                    // openCity(event, "style");
                    goToORB();
                  }}
                >
                  Meet and Greet
                </button>
              </div>
              <div className="tab4"></div>
            </div>
            <div id="music" className="tabcontent active">
              <div className="category_empty"></div>
              <div className="category_video vids">
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
              </div>
              <div className="category_video vids">
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
              </div>
              <div className="category_video vids">
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
              </div>
              <div className="category_video vids">
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
                <div className="profile_images">
                  <img src="http://3.84.158.108:8000/default/profile.jpg" />
                </div>
              </div>
            </div>
            <div id="find" className="tabcontent">
              <div className="category_empty"></div>
              {console.log("allFans.length=-=-=-=-", allFans.length)}
              <div className=" row vids">
                {allFans.length != 0 ? (
                  allFans.map((fan, i) => {
                    return (
                      <div
                        className="profile_images col-md-3 col-sm-6 "
                        style={{ textAlign: "center" }}
                        key={i}
                      >
                        <div
                        // id={fan._id}
                        // onDragStart={(e) => handleDragStart(e)}
                        // onDrag={(e) => handleDrag(e, fan._id)}
                        // onDragEnd={(e) => {
                        //   handleDragEnd(e, fan._id, fan.profileImgURl);
                        // }}
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
                        </div>{" "}
                      </div>
                    );
                  })
                ) : (
                  <div>No fans Found</div>
                )}
              </div>
            </div>
            <div id="style" className="tabcontent">
              <h3>Tokyo</h3>
              <p>Tokyo is the capital of Japan.</p>
            </div>
            <div id="body" className="tabcontent">
              <h3>London</h3>
              <p>London is the capital city of England.</p>
            </div>
            <div className="main_links d-flex">
              <div className="down_links">
                <a style={{ cursor: "pointer" }} onClick={goToHome}>
                  <img src="../assets/images/1.png" />
                </a>
                <div className="link_text">Home</div>
              </div>
              <div className="down_links">
                <a
                  style={{ cursor: "pointer" }}
                  onClick={(event) => {
                    openCity(event, "find");
                    getAllfans();
                  }}
                >
                  <img src="../assets/images/2.png" />
                </a>
                <div className="link_text">Find</div>
              </div>
              <div className="down_links">
                <a href="#">
                  <img src="../assets/images/3.png" />
                </a>
                <div className="link_text">More</div>
              </div>
              <div className="down_links">
                <a href="#">
                  <img src="../assets/images/4.png" />
                </a>
                <div className="link_text">About</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCategoryHomePage;

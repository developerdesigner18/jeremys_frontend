import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/fan_homepage.css";
import Header from "../header/Header";
import { getAllArtists } from "../../actions/userActions";
import { useSelector, useDispatch } from "react-redux";

function FanHomePage(props) {
  const dispatch = useDispatch();
  const [allArtists, setAllArtists] = useState([]);
  const stateData = useSelector((state) => state.user);
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
  useEffect(() => {
    dispatch(getAllArtists());
  }, []);

  const getAllArtist = () => {
    console.log("getAllArtists=--=-=-=-=-=", stateData);
    setAllArtists(stateData.artists);
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
                onClick={(event) => openCity(event, "music")}
              >
                MUSIC
              </button>
            </div>
            <div className="tab2">
              <button
                className="tablinks"
                onClick={(event) => openCity(event, "find")}
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
                onClick={(event) => openCity(event, "style")}
              >
                STYLE
              </button>
            </div>
            <div className="tab4">
              <button
                className="tablinks"
                onClick={(event) => openCity(event, "body")}
              >
                BODY
              </button>
            </div>
          </div>
          <div id="music" className="tabcontent active">
            <div className="category">
              <div className="cats_content">
                <a href="#">POP</a>
              </div>
              <div className="cats_content">
                <a href="#">ROCK</a>
              </div>
              <div className="cats_content">
                <a href="#">BLUES</a>
              </div>
              <div className="cats_content">
                <a href="#">R&B</a>
              </div>
            </div>
            <div className="category_video vids">
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
            </div>
            <div className="category_video vids">
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
            </div>
            <div className="category_video vids">
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
            </div>
            <div className="category_video vids">
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div className="main_cat">
                <video muted={true} autoPlay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
            </div>
          </div>
          <div id="find" className="tabcontent">
            <div className="category">
              <div className="cats_content">
                <a href="#">POP</a>
              </div>
              <div className="cats_content">
                <a href="#">ROCK</a>
              </div>
              <div className="cats_content">
                <a href="#">BLUES</a>
              </div>
              <div className="cats_content">
                <a href="#">R&B</a>
              </div>
            </div>
            <div className=" row vids">
              {allArtists.length != 0 ? (
                allArtists.map((fan, i) => {
                  return (
                    <div
                      className="profile_images col-sm-3 col-md-3  my-3"
                      style={{ textAlign: "center" }}
                      key={i}
                    >
                      <img
                        // src={`../assets/images/fan.png`}
                        src={
                          fan.profileImgURl != "" && fan.profileImgURl != null
                            ? fan.profileImgURl
                            : "http://3.84.158.108:8000/default/profile.jpg"
                        }
                        alt="Profile Img"
                      />
                      <p className="mt-2">{`${fan.firstName} ${fan.lastName} `}</p>
                    </div>
                  );
                })
              ) : (
                <div>No Artists Found</div>
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
                  getAllArtist();
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
  );
}

export default FanHomePage;

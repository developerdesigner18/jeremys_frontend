import React, { useEffect, useRef, useState } from "react";
import "../../assets/css/fan_homepage.css";
import Header from "../header/Header";
import { getAllArtists } from "../../actions/userActions";
import { useSelector, useDispatch } from "react-redux";
import Slider from "react-slick";

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

  var subMusic = ["pop","rnb","jazz","ballad","disco","bossa nova","classical","orchestra","blues","country","latin","rock & roll","heavy metal"]
  var subFood = ["italian","japanese","korean","thai","mexican","indian","vietnam","mediterraneam","european","arabian","pinoy","chinese","american bbq"]
  var subStyle = ["clothing","collectibles","vintage","bridal","make-up Accessories"]
  var subBody = ["yoga","zumba","body building","gymnastics","aerobics"]
  var musicData = [{url:123,name:"M1"}, {url:123,name:"M2"}, {url:123,name:"M3"}, {url:123,name:"M4"}, {url:123,name:"M5"}, {url:123,name:"M6"}, {url:123,name:"M7"}, {url:123,name:"M8"}, {url:123,name:"M9"}, {url:123,name:"M10"}, {url:123,name:"M11"}, {url:123,name:"M12"}, {url:123,name:"M13"}, {url:123,name:"M14"},{url:123,name:"M15"}, {url:123,name:"M16"}]

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
  };

  function showCircleDiv(array) {
    let newDiv = [];
    for (let i = 0; i < (array.length) / 4; i++) {
      newDiv.push(
        <div className="category_video vids">
          {insideDiv(i)}
        </div>
      )
    }
    return newDiv
  }
  function insideDiv(i) {
    let divs = [];
    for (var j = 4 * i; j < 4 * (i + 1); j++) {
      divs.push(
        <div className="main_cat">
          <video muted={true} autoPlay>
            <source src="../assets/images/vid.mp4" />
          </video>
          <p style={{ color: "white" }}>{musicData[j].name}</p>
        </div>
      )
    }
    return divs;
  }

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
                onClick={(event) => openCity(event, "food")}
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
          <Slider {...settings} style={{ background: "#333333", marginBottom: "25px" }}>
              {
                subMusic.map((value, i) => {
                  return (
                    <div className="cats_content">
                      <h3 style={{ color: "#ffffff", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1.8px", textAlign: "center" }} >{value}</h3>
                    </div>
                  );
                })}
          </Slider>
            {
              showCircleDiv(musicData)
            }
          </div>
          <div id="food" className="tabcontent">
          <Slider {...settings} style={{ background: "#333333", marginBottom: "25px" }}>
              {
                subFood.map((value, i) => {
                  return (
                    <div className="cats_content">
                      <h3 style={{ color: "#ffffff", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1.8px", textAlign: "center" }} >{value}</h3>
                    </div>
                  );
                })}
          </Slider>
            {
              showCircleDiv(musicData)
            }
          </div>
          <div id="style" className="tabcontent">
            <Slider {...settings} style={{ background: "#333333", marginBottom: "25px" }}>
              {
                subStyle.map((value, i) => {
                  return (
                    <div className="cats_content">
                      <h3 style={{ color: "#ffffff", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1.8px", textAlign: "center" }}>{value}</h3>
                    </div>
                  );
                })}
            </Slider>
            {
              showCircleDiv(musicData)
            }
          </div>
          <div id="body" className="tabcontent">
            <Slider {...settings} style={{ background: "#333333", marginBottom: "25px" }}>
              {
                subBody.map((value, i) => {
                  return (
                    <div className="cats_content">
                      <h3 style={{ color: "#ffffff", fontSize: "14px", textTransform: "uppercase", letterSpacing: "1.8px", textAlign: "center" }}>{value}</h3>
                    </div>
                  );
                })}
            </Slider>
            {
              showCircleDiv(musicData)
            }
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

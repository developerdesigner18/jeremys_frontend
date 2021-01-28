import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/css/ORB.css";

function ORBPage() {
  const constraints = {
    audio: true,
    video: true,
    options: {
      mirror: true,
    },
  };
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(success)
      .catch(failure);
  }, []);

  const success = stream => {
    window.localStream = stream;
  };

  // called when getUserMedia() fails - see below
  const failure = e => {
    console.log("getUserMedia Error: ", e);
    alert(e.toString());
  };

  return (
    <>
      <div className="main_ORB_section container mt-5 d-flex">
        <div className="ORB_logo">
          <img src="../assets/images/grey_logo.png" />
        </div>
        <div className="ORB_live_container d-flex">
          <div className="ORB_video_live d-flex position-relative">
            <video autoPlay>
              <source src="../assets/images/vid.mp4" />
            </video>
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
              <div className="progress" style={{ width: "70px" }}>
                <div
                  class="progress-bar"
                  role="progressbar"
                  style={{ width: "100%" }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
            </div>
            <div className="value_container">
              <span className="value_name">Tip</span>
              <div className="progress" style={{ width: "70px" }}>
                <div
                  class="progress-bar"
                  role="progressbar"
                  style={{ width: "60%" }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
            </div>
            <div className="value_container">
              <span className="value_name">Viewers</span>
              <div className="progress" style={{ width: "70px" }}>
                <div
                  class="progress-bar"
                  role="progressbar"
                  style={{ width: "40%" }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
            </div>
            <div className="value_container">
              <span className="value_name">Ticket Sold</span>
              <div className="progress" style={{ width: "70px" }}>
                <div
                  class="progress-bar"
                  role="progressbar"
                  style={{ width: "100%" }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container ORB_videos_container mt-3">
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="r_image">
          <img src="../assets/images/r_image.png" />
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
        <div className="ORB_main_cat">
          <video autoPlay="">
            <source src="../assets/images/vid.mp4" />
          </video>
        </div>
      </div>
      <div className="container justify-content-center d-flex ORB_links mt-5">
        <a href="#">
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/ticket.png" />
            <p>Ticket</p>
          </div>
        </a>
        <a href="#">
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/seat.png" />
            <p>Seat</p>
          </div>
        </a>
        <a href="#">
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
        <a href="#">
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/share.png" />
            <p>Share</p>
          </div>
        </a>
        <a href="#">
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/tip.png" />
            <p>Tip</p>
          </div>
        </a>
        <a href="#">
          <div className="ORB_link d-flex flex-column">
            <img src="../assets/images/exit.png" />
            <p>Exit</p>
          </div>
        </a>
      </div>
    </>
  );
}

export default ORBPage;
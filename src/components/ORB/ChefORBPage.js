import React, { useEffect, useState } from "react";
import "../../assets/css/chefORB.css";

function ChefORBPage() {
  const [isLive, setIsLive] = useState(false);

  return (
    <div
      style={{
        background: isLive
          ? "url('../assets/images/background_black.jpg')"
          : "url('../assets/images/JL-GO-LIVE.jpg')",
        backgroundSize: "auto 100vw",
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
          <div className="live_container d-flex">
            <div className="video_live d-flex position-relative">
              <video autoplay>
                <source src="../assets/images/vid.mp4" />
              </video>
            </div>
          </div>
          <div className="tips_info d-flex"></div>
        </div>
        <div className="container mt-5 d-flex top_section position-relative">
          <div className="rectangle_video">
            <img src="../assets/images/style_fan_orb.png" alt="logo" />
          </div>
          <div className="rectangle_video">
            <img src="../assets/images/style_fan_orb.png" alt="logo" />
          </div>
          <div className="justify-content-center go_live_logo">
            {isLive ? null : (
              <img
                src="../assets/images/go_live_chef_stylist.png"
                alt="go_live"
                style={{ cursor: "pointer" }}
                onClick={() => setIsLive(!isLive)}
              />
            )}
          </div>
          <div className="round_video" style={{ top: isLive ? "0" : "25px" }}>
            <div className="video_contents position-relative">
              <img src="../assets/images/style_rounded.png" alt="logo" />
              <img
                className="black_logo_img"
                src="../assets/images/black_logo.png"
                alt="logo"
              />
            </div>
          </div>
        </div>
        <div className="container items_links px-5 my-3 py-1">
          <div className="item position-relative">
            <img src="../assets/images/style_fan_orb.png" alt="logo" />
            <div className="price_item">
              <a href="#">
                <div className="price">$ 40</div>
              </a>
              <a href="#">
                <div className="item">Item 1</div>
              </a>
            </div>
          </div>
          <div className="links">
            <a href="#">
              <div className="link d-flex flex-column">
                <img src="../assets/images/ticket.png" alt="logo" />
                <p>Ticket</p>
              </div>
            </a>
            <a href="#">
              <div className="link d-flex flex-column">
                <img src="../assets/images/tip.png" alt="logo" />
                <p>Tip</p>
              </div>
            </a>
            <a href="#">
              <div className="link d-flex flex-column">
                <img src="../assets/images/take_picture.png" alt="logo" />
                <p>Take Picture</p>
              </div>
            </a>
            <a href="#">
              <div className="link d-flex flex-column">
                <img src="../assets/images/share.png" alt="logo" />
                <p>Share</p>
              </div>
            </a>
            <a href="#">
              <div className="link d-flex flex-column">
                <img src="../assets/images/exit.png" alt="logo" />
                <p>Exit</p>
              </div>
            </a>
          </div>
          <div className="item position-relative">
            <img src="../assets/images/style_fan_orb.png" alt="logo" />
            <div className="price_item">
              <a href="#">
                <div className="price">$ 40</div>
              </a>
              <a href="#">
                <div className="item">Item 2</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChefORBPage;

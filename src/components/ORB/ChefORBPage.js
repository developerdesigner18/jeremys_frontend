import React, { useEffect, useState } from "react";
import "../../assets/css/chefORB.css";
import html2canvas from "html2canvas";
import { useDispatch, useSelector } from "react-redux";

import { storeScreenShot } from "../../actions/orbActions";
import { getUserWithId } from "../../actions/userActions";

function ChefORBPage(props) {
  const [isLive, setIsLive] = useState(false);
  const dispatch = useDispatch();
  const stateData = useSelector(state => {
    // console.log("state.... ", state.user);
    return state.user;
  });

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

        await dispatch(storeScreenShot(fd));
      });
    });
  };

  useEffect(async () => {
    if (localStorage.getItem("token"))
      await dispatch(getUserWithId(localStorage.getItem("id")));
  }, []);

  useEffect(() => {
    console.log("userInfo", stateData);
  }, [stateData]);

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
          <div
            className="rectangle_video"
            style={
              {
                // background: `url("${stateData.userInfo.bannerImage}") no-repeat center `,
              }
            }></div>

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
            <a style={{ cursor: isLive ? "pointer" : "no-drop" }}>
              <div className="link d-flex flex-column">
                <img src="../assets/images/ticket.png" alt="logo" />
                <p>Ticket</p>
              </div>
            </a>
            <a style={{ cursor: isLive ? "pointer" : "no-drop" }}>
              <div className="link d-flex flex-column">
                <img src="../assets/images/tip.png" alt="logo" />
                <p>Tip</p>
              </div>
            </a>
            {isLive ? (
              <a onClick={getImage}>
                <div className="ORB_link d-flex flex-column">
                  <img src="../assets/images/take_picture.png" />
                  <p>Take Picture</p>
                </div>
              </a>
            ) : (
              <a style={{ cursor: "no-drop" }}>
                <div className="ORB_link d-flex flex-column">
                  <img src="../assets/images/take_picture.png" />
                  <p>Take Picture</p>
                </div>
              </a>
            )}
            <a>
              <div className="link d-flex flex-column">
                <img src="../assets/images/share.png" alt="logo" />
                <p>Share</p>
              </div>
            </a>
            <a
              style={{ cursor: "pointer" }}
              onClick={() => props.history.goBack()}>
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

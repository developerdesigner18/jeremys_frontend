import React, { useEffect } from "react";
import "../assets/css/homepage.css";
import Header from "./header/Header";

function HomePage(props) {
  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, []);
  return (
    <>
      <Header />

      <div className="container p-3 p-md-3 main cust_home_page">
        <div className="videos_container position-relative music">
          <div className="video_content">
            <video controls="" autoPlay={true} loop={true} muted={true}>
              <source
                src="https://s3.amazonaws.com/jl-s3/1-star%20(1).mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="video_content">
            <video controls="" autoPlay={true} loop={true} muted={true}>
              <source
                src="https://s3.amazonaws.com/jl-s3/2-fan%20(1).mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="hero_button">
            <div className="float_button">M</div>
          </div>
        </div>
        <div className="videos_container position-relative food">
          <div className="video_content">
            <video controls="" autoPlay={true} loop={true} muted={true}>
              <source
                src="https://s3.amazonaws.com/jl-s3/3-chef%20(1).mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="video_content">
            <video controls="" autoPlay={true} loop={true} muted={true}>
              <source
                src="https://s3.amazonaws.com/jl-s3/4-food%20(1).mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="hero_button">
            <div className="float_button">F</div>
          </div>
        </div>
        <div className="videos_container position-relative style">
          <div className="video_content">
            <video controls="" autoPlay={true} loop={true} muted={true}>
              <source
                src="https://s3.amazonaws.com/jl-s3/5-style%20(1).mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="video_content">
            <video controls="" autoPlay={true} loop={true} muted={true}>
              <source
                src="https://s3.amazonaws.com/jl-s3/6-shopping.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="hero_button">
            <div className="float_button">S</div>
          </div>
        </div>
        <div className="videos_container position-relative body">
          <div className="video_content">
            <video controls="" autoPlay={true} loop={true} muted={true}>
              <source
                src="https://s3.amazonaws.com/jl-s3/7-trainer.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="video_content">
            <video controls="" autoPlay={true} loop={true} muted={true}>
              <source
                src="https://s3.amazonaws.com/jl-s3/8-athlete%20(1).mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="hero_button">
            <div className="float_button">B</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;

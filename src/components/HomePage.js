import React, { useEffect } from 'react';
import '../assets/css/homepage.css';
import Header from './header/Header';

function HomePage(props) {
  return (
    <>
      <Header />

      <div className="container p-3 p-md-3 main cust_home_page">
        <div className="videos_container position-relative music">
          <div className="video_content">
            <video controls="" autoPlay={true} loop={true} muted={true}>
              <source
                src="http://jeremys.siamedia.net/videos/1-star.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="video_content">
            <video controls="" autoPlay={true} loop={true} muted={true}>
              <source
                src="http://jeremys.siamedia.net/videos/2-fan.mp4"
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
                src="http://jeremys.siamedia.net/videos/3-chef.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="video_content">
            <video controls="" autoPlay={true} loop={true} muted={true}>
              <source
                src="http://jeremys.siamedia.net/videos/4-food.mp4"
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
                src="http://jeremys.siamedia.net/videos/5-style.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="video_content">
            <video controls="" autoPlay={true} loop={true} muted={true}>
              <source
                src="http://jeremys.siamedia.net/videos/6-shopping.mp4"
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
                src="http://jeremys.siamedia.net/videos/7-trainer.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="video_content">
            <video controls="" autoPlay={true} loop={true} muted={true}>
              <source
                src="http://jeremys.siamedia.net/videos/8-athlete.mp4"
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

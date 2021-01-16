import React from "react";
import "../../assets/css/fan_homepage.css";
import Header from "../header/Header";
function fanHomePage() {
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
  return (
    <div class="container">
      <div class="form_container px-3 px-md-5 mt-5">
        <Header />
        {/* <header class="d-flex">
          <div class="links left_links">
            <ul>
              <li>
                <a href="#">stars</a>
              </li>
              <li>
                <a href="#">chef</a>
              </li>
              <li>
                <a href="#">style</a>
              </li>
              <li>
                <a href="#">trainer</a>
              </li>
            </ul>
          </div>
          <div class="logo">
            <img src="../assets/images/logo.png" />
          </div>
          <div class="links right_links">
            <ul>
              <li>
                <a href="#">fans</a>
              </li>
              <li>
                <a href="#">food</a>
              </li>
              <li>
                <a href="#">shopping</a>
              </li>
              <li>
                <a href="#">athlete</a>
              </li>
            </ul>
          </div>
        </header> 

        <div class="hero_text text-center">
          "Go live! and lets make our Earth a better place"
        </div>*/}
        <div class="tabs_image">
          <div class="tab">
            <div class="tab1">
              <button
                class="tablinks active"
                onClick={(event) => openCity(event, "music")}
              >
                MUSIC
              </button>
            </div>
            <div class="tab2">
              <button
                class="tablinks"
                onClick={(event) => openCity(event, "food")}
              >
                FOOD
              </button>
            </div>
            <div class="fan_image">
              <img src="../assets/images/fan.png" />
            </div>
            <div class="tab3">
              <button
                class="tablinks"
                onClick={(event) => openCity(event, "style")}
              >
                STYLE
              </button>
            </div>
            <div class="tab4">
              <button
                class="tablinks"
                onClick={(event) => openCity(event, "body")}
              >
                BODY
              </button>
            </div>
          </div>
          <div id="music" class="tabcontent active">
            <div class="category">
              <div class="cats_content">
                <a href="#">POP</a>
              </div>
              <div class="cats_content">
                <a href="#">ROCK</a>
              </div>
              <div class="cats_content">
                <a href="#">BLUES</a>
              </div>
              <div class="cats_content">
                <a href="#">R&B</a>
              </div>
            </div>
            <div class="category vids">
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
            </div>
            <div class="category vids">
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
            </div>
            <div class="category vids">
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
            </div>
            <div class="category vids">
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video controls autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
            </div>
          </div>
          <div id="food" class="tabcontent">
            <h3>Paris</h3>
            <p>Paris is the capital of France.</p>
          </div>
          <div id="style" class="tabcontent">
            <h3>Tokyo</h3>
            <p>Tokyo is the capital of Japan.</p>
          </div>
          <div id="body" class="tabcontent">
            <h3>London</h3>
            <p>London is the capital city of England.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default fanHomePage;

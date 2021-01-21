import React from 'react';
import '../../assets/css/fan_homepage.css';
import Header from '../header/Header';

function UserCategoryHomePage(props) {
  const openCity = (evt, cityName) => {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }
    document.getElementById(cityName).style.display = 'block';
    evt.currentTarget.className += ' active';
  };

  const goToHome = () => {
    props.history.push('/');
  };

  return (
    <div class="container">
      {console.log('props ', props)}
      <div class="form_container px-3 px-md-5">
        <Header />
        <div class="tabs_image">
          <div class="tab">
            <div class="tab1"></div>
            <div class="tab2">
              <button
                class="tablinks"
                onClick={event => openCity(event, 'food')}>
                {localStorage.getItem('type') === 'Chef' ||
                localStorage.getItem('type') === 'chef'
                  ? "Chef's Table"
                  : localStorage.getItem('type') === 'Advertiser' ||
                    localStorage.getItem('type') === 'advertiser'
                  ? 'Published Ad'
                  : localStorage.getItem('type') === 'trainer' ||
                    localStorage.getItem('type') === 'Trainer'
                  ? 'Studio Live!'
                  : localStorage.getItem('type') === 'Stylist' ||
                    localStorage.getItem('type') === 'stylist'
                  ? 'Stylist'
                  : localStorage.getItem('type') === 'Star' ||
                    localStorage.getItem('type') === 'star'
                  ? 'Stage'
                  : localStorage.getItem('type') === 'artist' ||
                    localStorage.getItem('type') === 'Artist'
                  ? 'Stage'
                  : ''}
              </button>
            </div>
            <div class="fan_image">
              <img
                src={
                  localStorage.getItem('type') === 'Chef' ||
                  localStorage.getItem('type') === 'chef'
                    ? `../assets/images/chef.png`
                    : `../assets/images/fan.png`
                }
              />
            </div>
            <div class="tab3">
              <button
                class="tablinks"
                onClick={event => openCity(event, 'style')}>
                Meet and Greet
              </button>
            </div>
            <div class="tab4"></div>
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
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
            </div>
            <div class="category vids">
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
            </div>
            <div class="category vids">
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
            </div>
            <div class="category vids">
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video muted={true} autoplay>
                  <source src="../assets/images/vid.mp4" />
                </video>
              </div>
              <div class="main_cat">
                <video muted={true} autoplay>
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
          <div className="main_links d-flex">
            <div className="down_links">
              <a style={{ cursor: 'pointer' }} onClick={goToHome}>
                <img src="../assets/images/1.png" />
              </a>
              <div className="link_text">Home</div>
            </div>
            <div className="down_links">
              <a href="#">
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

export default UserCategoryHomePage;

import React from 'react';
import '../assets/css/homepage.css';
import { useHistory } from "react-router-dom";

function HomePage() {
    const history = useHistory();

    const goToRegister = () => {
        history.push('/register');
    }

    const goToLogin = () => {
        history.push('/login');
    }

    return (
        <div className="container p-3 p-md-5 main">
		<header>
			<div className="d-flex align-items-center">
				<a className="login" onClick={goToLogin} style={{ cursor:"pointer" }}>Login</a>
				<a className="login" onClick={goToRegister} style={{ cursor:"pointer" }}>Register</a>
			</div>
			<div><a onClick={goToRegister} style={{ cursor:"pointer" }}>sign up for FREE</a></div>
		</header>
		<div className="main_sec">
			<div className="links left_links">
				<ul>
					<li><a href="#">stars</a></li>
					<li><a href="#">chef</a></li>
					<li><a href="#">style</a></li>
					<li><a href="#">trainer</a></li>	
				</ul>
			</div>
                <div className="logo">
                    <img src={`../assets/images/logo.png`} />
                </div>
			<div className="links right_links">
				<ul>
					<li><a href="#">fans</a></li>
					<li><a href="#">food</a></li>
					<li><a href="#">shopping</a></li>
					<li><a href="#">athlete</a></li>
				</ul>
			</div>
		</div>
		<div className="hero_text text-center mb-5">"Go live! and lets make our Earth a better place"</div>
		<div className="videos_container position-relative music">
			<div className="video_content"><video controls="" autoplay="true"><source src="images/vid.mp4" /></video></div>
			<div className="video_content"><video controls="" autoplay=""><source src="images/vid.mp4" /></video></div>
			<div className="hero_button">
					<div className="float_button">M</div>
			</div>
		</div>
		<div className="videos_container position-relative food">
			<div className="video_content"><video controls="" autoplay=""><source src="images/vid.mp4" /></video></div>
			<div className="video_content"><video controls="" autoplay=""><source src="images/vid.mp4" /></video></div>
			<div className="hero_button">
				<div className="float_button">F</div>
			</div>
		</div>
		<div className="videos_container position-relative style">
			<div className="video_content"><video controls="" autoplay=""><source src="images/vid.mp4" /></video></div>
			<div className="video_content"><video controls="" autoplay=""><source src="images/vid.mp4" /></video></div>
			<div className="hero_button">
				<div className="float_button">S</div>
			</div>
		</div>
		<div className="videos_container position-relative body">
			<div className="video_content"><video controls="" autoplay=""><source src="images/vid.mp4" /></video></div>
			<div className="video_content"><video controls="" autoplay=""><source src="images/vid.mp4" /></video></div>
			<div className="hero_button">
				<div className="float_button">B</div>
			</div>
		</div>
	</div>
    )
}

export default HomePage

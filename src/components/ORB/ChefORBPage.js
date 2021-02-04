import React, { useEffect, useState } from "react";
import "../../assets/css/chefORB.css";


function ChefORBPage() {
    return (
        <div>
        <div className="ORB_logo1">
        <div className="main_section container mt-5 d-flex">
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
			<div className="tips_info d-flex">
			</div>
		</div>
		<div className="container mt-5 d-flex top_section position-relative">
			<div className="rectangle_video">
				<img src="../assets/images/style_fan_orb.png" alt="logo"/>
			</div>
			<div className="rectangle_video">
				<img src="../assets/images/style_fan_orb.png" alt="logo"/>
			</div>
			<div className="round_video">
				<div className="video_contents position-relative">
					<img src="../assets/images/style_rounded.png" alt="logo"/>
					<img className="black_logo_img" src="../assets/images/black_logo.png" alt="logo"/>
				</div>
			</div>
		</div>
		<div className="container items_links px-5 my-3">
			<div className="item position-relative">
				<img src="../assets/images/style_fan_orb.png" alt="logo"/>
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
						<img src="../assets/images/ticket.png" alt="logo"/>
						<p>Ticket</p>
					</div>
				</a>
				<a href="#">
					<div className="link d-flex flex-column">
						<img src="../assets/images/tip.png" alt="logo"/>
						<p>Tip</p>
					</div>
				</a>
				<a href="#">
					<div className="link d-flex flex-column">
						<img src="../assets/images/take_picture.png" alt="logo"/>
						<p>Take Picture</p>
					</div>
				</a>
				<a href="#">
					<div className="link d-flex flex-column">
						<img src="../assets/images/share.png" alt="logo"/>
						<p>Share</p>
					</div>
				</a>
				<a href="#">
					<div className="link d-flex flex-column">
						<img src="../assets/images/exit.png" alt="logo"/>
						<p>Exit</p>
					</div>
				</a>
			</div>
			<div className="item position-relative">
				<img src="../assets/images/style_fan_orb.png" alt="logo"/>
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
    )
}

export default ChefORBPage;
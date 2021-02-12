import React, { useState } from "react";
import moment from "moment";
import Calendar from 'react-calendar';
import "../../assets/css/calendar.css";

function CalendarShow() {
  const currentDate = moment();
  var weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const startWeek = currentDate.clone().startOf("isoWeek");
  const endWeek = currentDate.clone().endOf("isoWeek");
  let days = [];
  const [currentMonth, setCurrentMonth] = useState(
    moment(currentDate).format("MMMM")
  );
  const [value, onChange] = useState(new Date());
  for (let i = 0; i <= 6; i++) {
    days.push(moment(startWeek).add(i, "days").format("dddd"));
  }
  return (
    // <div className="container">
    //   <div className="row">
    //     <div className="col-4"></div>
    //     <div className="col-8 mt-5">
    //       <div className="month_section">
    //         {/* <div className="month_heading">{currentMonth}</div> */}
    //         <div className="weekDays">{console.log("days ", days)}</div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div class="container mt-5">
		<div class="calendar_title text-center mb-5">MY CALENDAR</div>
		<div class="main_calendar_container py-5 px-3 mb-3">
			<div class="event_info d-flex flex-column">
				<div class="day_title">{weekdays[value.getDay()]}</div>
				<div class="day_number">{value.getDate()}</div>
				<div class="what_title">TIME</div>
				<div class="answer">19:00 EST</div>
				<div class="what_title">Duration</div>
				<div class="answer">2 hours</div>
				<div class="what_title">seats</div>
				<div class="answer">100</div>
				<div class="what_title">Ticket</div>
				<div class="answer">$ 75</div>
				<div class="action d-flex align-items-center">
					<a href="#">
						<div class="action_content">
							<div class="action_image">
								<img src="../assets/images/share.png" />
							</div>
							<div class="action_text">Share</div>
						</div>
					</a>
					<a href="#">
						<div class="action_content">
							<div class="action_image">
								<img src="../assets/images/ticket.png" />
							</div>
							<div class="action_text">Ticket</div>
						</div>
					</a>
				</div>
			</div>
			<div class="calndar_info">
				<Calendar
				onChange={onChange}
				value={value}
				showNeighboringMonth={false}
				/>
				{/* <div class="month_change d-flex align-items-center justify-content-between px-4">
					<a href="#"><img src="../assets/images/left_calendar_arrow.png" /></a>
					<div class="month">OCTOBER</div>
					<a href="#"><img src="../assets/images/right_calendar_arrow.png" /></a>
				</div>
				<div class="dates_and_days_content">
					<div class="days_content d-flex align-items-center">
						<a href="#">
							<div class="day_content">SUN</div>
						</a>
						<a href="#">
							<div class="day_content">MON</div>
						</a>
						<a href="#">
							<div class="day_content">TUE</div>
						</a>
						<a href="#">
							<div class="day_content">WED</div>
						</a>
						<a href="#">
							<div class="day_content">THU</div>
						</a>
						<a href="#">
							<div class="day_content">FRI</div>
						</a>
						<a href="#">
							<div class="day_content">SAT</div>
						</a>
					</div>
					<div class="dates_content d-flex align-items-center">
						<a href="#">
							<div class="date_content"></div>
						</a>
						<a href="#">
							<div class="date_content"></div>
						</a>
						<a href="#">
							<div class="date_content"></div>
						</a>
						<a href="#">
							<div class="date_content"></div>
						</a>
						<a href="#">
							<div class="date_content">1</div>
						</a>
						<a href="#">
							<div class="date_content">2</div>
						</a>
						<a href="#">
							<div class="date_content">3</div>
						</a>
					</div>
					<div class="dates_content d-flex align-items-center">
						<a href="#">
							<div class="date_content">4</div>
						</a>
						<a href="#">
							<div class="date_content">5</div>
						</a>
						<a href="#">
							<div class="date_content">6</div>
						</a>
						<a href="#">
							<div class="date_content">7</div>
						</a>
						<a href="#">
							<div class="date_content">8</div>
						</a>
						<a href="#">
							<div class="date_content">9</div>
						</a>
						<a href="#">
							<div class="date_content">10</div>
						</a>
					</div>
					<div class="dates_content d-flex align-items-center">
						<a href="#">
							<div class="date_content">11</div>
						</a>
						<a href="#">
							<div class="date_content">12</div>
						</a>
						<a href="#">
							<div class="date_content">13</div>
						</a>
						<a href="#">
							<div class="date_content">14</div>
						</a>
						<a href="#">
							<div class="date_content">15</div>
						</a>
						<a href="#">
							<div class="date_content">16</div>
						</a>
						<a href="#">
							<div class="date_content">17</div>
						</a>
					</div>
					<div class="dates_content d-flex align-items-center">
						<a href="#">
							<div class="date_content">18</div>
						</a>
						<a href="#">
							<div class="date_content active">19</div>
						</a>
						<a href="#">
							<div class="date_content">20</div>
						</a>
						<a href="#">
							<div class="date_content">21</div>
						</a>
						<a href="#">
							<div class="date_content">22</div>
						</a>
						<a href="#">
							<div class="date_content">23</div>
						</a>
						<a href="#">
							<div class="date_content">24</div>
						</a>
					</div>
					<div class="dates_content d-flex align-items-center">
						<a href="#">
							<div class="date_content">25</div>
						</a>
						<a href="#">
							<div class="date_content">26</div>
						</a>
						<a href="#">
							<div class="date_content">27</div>
						</a>
						<a href="#">
							<div class="date_content">28</div>
						</a>
						<a href="#">
							<div class="date_content">29</div>
						</a>
						<a href="#">
							<div class="date_content">30</div>
						</a>
						<a href="#">
							<div class="date_content">31</div>
						</a>
					</div>
				</div> */}
			</div>
		</div>
	</div>
  );
}

export default CalendarShow;

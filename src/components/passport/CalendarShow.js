import React, { useState } from "react";
import moment from "moment";
import "../../assets/css/calendar.css";

function CalendarShow() {
  const currentDate = moment();
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
    <div className="container">
      <div className="row">
        <div className="col-4"></div>
        <div className="col-8 mt-5">
          <div className="month_section">
            {/* <div className="month_heading">{currentMonth}</div> */}
            <div className="weekDays">{console.log("days ", days)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarShow;

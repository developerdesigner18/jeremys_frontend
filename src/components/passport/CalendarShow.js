import React, { useState, useEffect } from "react";
import moment, { weekdays } from "moment";
import "../../assets/css/calendar.css";

function CalendarShow() {
  const currentDate = moment();
  const startWeek = currentDate.clone().startOf("isoWeek");
  let days = [];
  const [weekDates, setWeekDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(
    moment(currentDate).format("MMMM")
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
  );
  const [weeks, setWeeks] = useState([]);

  for (let i = 0; i <= 6; i++) {
    days.push(moment(startWeek).add(i, "days").format("dddd"));
  }

  function showWeek() {
    let day = 1;
    let weeks1 = [];
    for (let i = 0; i <= 4; i++) {
      for (let j = 0; j < 6; j++) {
        if (day <= endDate.getDate()) {
          weeks1.push(day);
          day++;
        }
      }
    }
    setWeekDates(weeks1);
  }

  function getDaysInMonthUTC(month, year) {
    var date = new Date(Date.UTC(year, month, 1));
    var days = [];
    while (date.getUTCMonth() === month) {
      days.push(new Date(date).getDay());
      date.setUTCDate(date.getUTCDate() + 1);
    }
    setWeeks(days);
  }

  useEffect(() => {
    getDaysInMonthUTC(1, 2021);
    showWeek();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col-4"></div>
        <div className="col-8 mt-5">
          <div className="month_section">
            <div className="month_heading">{currentMonth}</div>
            <div className="weekDays">
              {days.map((singleDay, i) => {
                return (
                  <>
                    <p style={{ color: "white", padding: "5px" }}>
                      {singleDay}
                    </p>
                  </>
                );
              })}
            </div>
            <div className="weekDays row">
              {weekDates.map((singleWeek, index) => {
                return (
                  <div className=" singleDay">
                    <p style={{ padding: "5px" }}>{singleWeek}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarShow;

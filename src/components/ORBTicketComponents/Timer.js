import React, {useEffect, useState} from "react";
import "../../assets/css/ratings.css";

function Timer(props) {
  const [hour, setHour] = useState();
  const [minute, setMinute] = useState();

  const escFunction = event => {
    if (event.keyCode === 27) {
      //Do whatever when esc is pressed
      console.log("esc pressed");
      props.setShow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  const storeTime = () => {
    if (minute) {
      props.setTime(minute * 60);
    }
    props.setShow(false);
  };

  return (
    <div style={{background: "black"}} className="container">
      <div className="justify-content-center align-items-center d-flex pt-5">
        <label className="mx-2">Enter Time: </label>
        <input
          type="number"
          name="minute"
          style={{width: "80px"}}
          className="mx-2"
          placeholder="Minutes"
          onChange={e => setMinute(e.target.value)}
        />
      </div>
      <div className="d-flex justify-content-center p-4">
        <button className="btn btn-default btn_submit" onClick={storeTime}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Timer;

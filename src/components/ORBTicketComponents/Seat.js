import React, {useState} from "react";

function Seat(props) {
  const [seatNo, setSeatNo] = useState(0);

  const storeSeat = () => {
    props.setSeats(seatNo);
    props.setShow(false);
    let array = [...Array(seatNo)];
    props.setSeatArray(array);
  };

  return (
    <div style={{background: "black"}} className="container">
      <div className="justify-content-center align-items-center d-flex pt-5">
        <label className="mx-2">Enter Total seat: </label>
        <input
          type="number"
          name="seat"
          style={{width: "180px"}}
          className="mx-2"
          placeholder="Enter total seats"
          onChange={e => setSeatNo(e.target.value)}
        />
      </div>
      <div className="d-flex justify-content-center p-4">
        <button className="btn btn-default btn_submit" onClick={storeSeat}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default Seat;

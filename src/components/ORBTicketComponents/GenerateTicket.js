import React from "react";
import "../../assets/css/ticket.css";

function GenerateTicket(props) {
  return (
    <div className="MainwrapperTicket">
      <div className="main_reciept_container position-relative ">
        <div className="background_image">
          <img src="../assets/images/JL_RECEIPT_PAID.jpg" />
        </div>
        <div className="d-flex justify-content-end text-muted">
          <i
            className="fas fa-times "
            role="button"
            onClick={() => {
              props.setShow(false);
            }}
            style={{zIndex: "1", padding: "5px"}}
          />
        </div>
        <div className="main_container d-flex flex-column align-items-center">
          <div className="text-center">
            <img src="../assets/images/silver_logo.png" />
          </div>
          <div className="contact_mail d-flex align-items-center mb-4 mt-3">
            <div className="fan_image">
              <div className="">
                <img
                  src={props.userDetail.data.profileImgURl}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://artsiam.com:8000/default/profile.jpg";
                  }}
                />
              </div>
            </div>
          </div>
          <button className="reciept_button mb-3" style={{cursor: "text"}}>
            {props.userDetail
              ? props.userDetail.data.firstName +
                " " +
                props.userDetail.data.lastName
              : localStorage.getItem("name")}
          </button>
          <h4
            className="my-3 text-uppercase text-light"
            style={{
              fontWeight: "500",
              fontSize: "20px",
              letterSpacing: "4px",
            }}>
            Live Performance
          </h4>
          <div className="text-center">
            <div className="table_down d-flex align-items-center my-2">
              {/* <div className="col-md-4 p-0" style={{letterSpacing: "4px"}}>
                <h1 className="text-white m-0">28</h1>
              </div>
              <div
                className="col-md-8 pr-0"
                style={{fontSize: "13px", letterSpacing: "4px"}}>
                <p className="text-white text-uppercase m-0 text-justify">
                  october
                </p>
                <p className="text-white text-uppercase m-0 text-justify">
                  7 PM EST
                </p>
              </div> */}
              {props.currentDate}
            </div>
          </div>
          <p
            className=" text-uppercase mt-2 mb-2"
            style={{fontWeight: "600", letterSpacing: "3px"}}>
            Duration :
          </p>
          <p className="" style={{letterSpacing: "2px"}}>
            {Math.floor(props.time / 60)} Minutes
          </p>

          <p
            className=" text-uppercase mt-2 mb-2"
            style={{fontWeight: "600", letterSpacing: "3px"}}>
            Seats :
          </p>
          <p className="" style={{letterSpacing: "2px"}}>
            {props.seats}
          </p>
          <p
            className=" text-uppercase mt-2 mb-2"
            style={{fontWeight: "600", letterSpacing: "3px"}}>
            ticket price :
          </p>
          <p className="" style={{letterSpacing: "2px"}}>
            $
            <input
              type="number"
              style={{
                background: "transparent",
                border: "solid 1px white",
                color: "white",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            />
          </p>

          <button className="tablinks" type="button">
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default GenerateTicket;

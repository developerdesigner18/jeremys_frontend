import React, {useState} from "react";
import "../../assets/css/ticket.css";

function GenerateTicket(props) {
  const [price, setPrice] = useState(0);

  const storePrice = () => {
    props.setTicketPrice(price);
    props.setShow(false);
  };

  return (
    <div className="MainwrapperTicket">
      <div className="main_reciept_container position-relative ">
        <div className="background_image">
          <img src="../assets/images/JL_RECEIPT_PAID.jpg" />
        </div>

        <div className="main_container d-flex flex-column align-items-center">
          {" "}
          <div
            className="position-absolute text-muted"
            style={{cursor: "pointer", zIndex: "1", top: "0", right: "10px"}}
          >
            <i
              className="fas fa-times "
              onClick={() => {
                props.setShow(false);
              }}
              role="button"
              style={{
                zIndex: "1",
                padding: "",
              }}
            />
          </div>
          <div className="text-center">
            <img
              src="../assets/images/silver_logo.png"
              style={{height: "65px"}}
            />
          </div>
          <div className="contact_mail d-flex align-items-center mb-3 mt-3">
            <div className="fan_image">
              <div className="">
                <img
                  src={props.userDetail.data.profileImgURl}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://jeremysLive.com:8000/default/profile.jpg";
                  }}
                />
              </div>
            </div>
          </div>
          <button className="reciept_button " style={{cursor: "text"}}>
            {props.userDetail
              ? props.userDetail.data.firstName +
                " " +
                props.userDetail.data.lastName
              : localStorage.getItem("name")}
          </button>
          <h4
            className="my-4 text-uppercase text-light"
            style={{
              fontWeight: "500",
              fontSize: "16px",
              letterSpacing: "4px",
            }}
          >
            Live Performance
          </h4>
          <div className="text-center">
            <div
              className="table_down d-flex align-items-center "
              style={{letterSpacing: "2px"}}
            >
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
          <div
            className="d-flex justify-content-between mt-4 mb-0"
            style={{width: "68%"}}
          >
            <div className="mb-0">
              <span style={{fontWeight: "500", letterSpacing: "2px"}}>
                {" "}
                Duration :
              </span>
              {/* <p className="m-0" style={{letterSpacing: "2px"}}> */}
              <span style={{letterSpacing: "2px"}}>
                {" "}
                {Math.floor(props.time / 60)} Minutes
              </span>
            </div>

            <div className=" mb-0">
              <span style={{fontWeight: "500", letterSpacing: "2px"}}>
                Seats :{/* </p> */}
              </span>
              {/* <p className="mb-0" style={{letterSpacing: "2px"}}> */}
              <span style={{letterSpacing: "2px"}}>{props.seats} </span>
            </div>
          </div>
          <p className="  mt-3 mb-0">
            <span style={{fontWeight: "500", letterSpacing: "2px"}}>
              Ticket price :
            </span>
            {/* <p className="" style={{letterSpacing: "2px"}}> */}
            <span> $ </span>
            <input
              type="number"
              style={{
                background: "transparent",
                border: "solid 1px white",
                color: "white",
                textAlign: "center",
                verticalAlign: "middle",
              }}
              onChange={(e) => setPrice(e.target.value)}
            />
          </p>
          <button className="tablinks mt-3" type="button" onClick={storePrice}>
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default GenerateTicket;

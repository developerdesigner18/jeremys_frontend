import React from "react";
import "../../assets/css/ticket.css";
import {PayPalButton} from "react-paypal-button-v2";
function Ticket(props) {
  return (
    <div class="MainwrapperTicket">
      <div class="main_reciept_container position-relative ">
        <div class="background_image">
          <img src="../assets/images/JL_RECEIPT_PAID.jpg" />
        </div>
        <div class="d-flex justify-content-end text-muted">
          <i
            class="fas fa-times "
            role="button"
            onClick={() => {
              props.setShow(false);
            }}
            style={{zIndex: "1", padding: "5px"}}
          />
        </div>
        <div class="main_container d-flex flex-column align-items-center">
          <div class="text-center">
            <img src="../assets/images/silver_logo.png" />
          </div>
          <div class="contact_mail d-flex align-items-center mb-4 mt-3">
            {/* <div class="contact mr-2">Contact: +1547889</div>
            <div class="mail ml-2">Email: mail@jeremys.com</div> */}

            <div className="fan_image">
              <div>
                <img
                  src={"https://artsiam.com:8000/default/profile.jpg"}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://artsiam.com:8000/default/profile.jpg";
                  }}
                />
              </div>
            </div>
          </div>
          <button class="reciept_button mb-3">Artist Name</button>
          <h4
            class="my-3 text-uppercase text-light"
            style={{
              fontWeight: "500",
              fontSize: "20px",
              letterSpacing: "4px",
            }}>
            Live Music Performance
          </h4>
          <div className="text-center">
            <div class="table_down d-flex align-items-center my-2">
              <div className="col-md-4 p-0" style={{letterSpacing: "4px"}}>
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
              </div>
            </div>
          </div>
          <p
            className=" text-uppercase mt-2 mb-2"
            style={{fontWeight: "600", letterSpacing: "3px"}}>
            Duration :
          </p>
          <p class="" style={{letterSpacing: "2px"}}>
            2 HOURS
          </p>

          <p
            className=" text-uppercase mt-2 mb-2"
            style={{fontWeight: "600", letterSpacing: "3px"}}>
            Seats :
          </p>
          <p class="" style={{letterSpacing: "2px"}}>
            100
          </p>
          <p
            className=" text-uppercase mt-2 mb-2"
            style={{fontWeight: "600", letterSpacing: "3px"}}>
            ticket price :
          </p>
          <p class="" style={{letterSpacing: "2px"}}>
            $ 300
          </p>

          <div
            class="paid_image my-3 pointer "
            role="button"
            onClick={() => {
              props.setPaid(true);
            }}>
            <img src="../assets/images/paid_button.png" />
          </div>
          {/* <p class="thanks">Thank you from Jeremy’s Live!</p> */}
        </div>
      </div>
    </div>
  );
}

export default Ticket;

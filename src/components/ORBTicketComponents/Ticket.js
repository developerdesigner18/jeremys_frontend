import React, {useEffect, useState, useRef} from "react";
import "../../assets/css/ticket.css";
import {useSelector, useDispatch} from "react-redux";
import {getUserWithId} from "../../actions/userActions";
import moment from "moment";
import {tipOrTicketPayment} from "../../actions/paymentActions";

function Ticket(props) {
  const dispatch = useDispatch();
  const stateUser = useSelector(state => state.user);

  const [userInfo, setUserInfo] = useState({});
  const [paid, setPaid] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const paypalRef = useRef();

  useEffect(async () => {
    await dispatch(getUserWithId(props.userId));
  }, []);

  useEffect(() => {
    if (stateUser) {
      if (stateUser.userInfo) {
        setUserInfo(stateUser.userInfo.data);
      }
    }
  }, [stateUser]);

  useEffect(() => {
    const sript = document.createElement("script");
    sript.src =
      "https://www.paypal.com/sdk/js?client-id=AX9JUYCp-VOmxZI1JINHxcV86njVZCE_dFE30EkjAh0_WXgaKRy6_NxXzb0Jwuf0LBlx5OiJ6DJjo00n";

    sript.addEventListener("load", () => {
      setLoaded(true);
    });
    document.body.appendChild(sript);
    console.log("load............. ", loaded, props.streamObj);

    if (loaded) {
      setTimeout(() => {
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: "ticket",
                    amount: {
                      currency_code: "USD",
                      value: props.streamObj.price,
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              const order = await actions.order.capture();
              console.log("order........ ", order);
              if (order) {
                const dataToPass = {
                  total: props.streamObj.price,
                  userId: props.userId,
                  streamId: props.streamObj._id,
                  fanId: localStorage.getItem("id"),
                  dateTime: moment.utc(),
                };
                await dispatch(tipOrTicketPayment(dataToPass));
                props.setShow(false);
                props.setPaid(true);
              }
            },
            onError: err => {
              setError(err);
              console.error("erorr in payapl......... ", err);
            },
          })
          .render(paypalRef.current);
      }, 500);
    }
  }, [loaded]);

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
            {/* <div className="contact mr-2">Contact: +1547889</div>
            <div className="mail ml-2">Email: mail@jeremys.com</div> */}

            <div className="fan_image">
              <div>
                <img
                  src={userInfo.profileImgURl}
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://artsiam.com:8000/default/profile.jpg";
                  }}
                />
              </div>
            </div>
          </div>
          <button className="reciept_button mb-3">
            {userInfo.firstName + " " + userInfo.lastName}
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
              {moment().format("DD MMM, YYYY")}
            </div>
          </div>
          <p
            className=" text-uppercase mt-2 mb-2"
            style={{fontWeight: "600", letterSpacing: "3px"}}>
            Duration :
          </p>
          <p style={{letterSpacing: "2px"}}>
            {props.streamObj.timer / 60} Minutes
          </p>

          <p
            className=" text-uppercase mt-2 mb-2"
            style={{fontWeight: "600", letterSpacing: "3px"}}>
            Seats :
          </p>
          <p style={{letterSpacing: "2px"}}>{props.streamObj.seats}</p>
          <p
            className=" text-uppercase mt-2 mb-2"
            style={{fontWeight: "600", letterSpacing: "3px"}}>
            ticket price :
          </p>
          <p style={{letterSpacing: "2px"}}>$ {props.streamObj.price}</p>

          <div ref={paypalRef} />
          {/* <div
            className="paid_image my-3 pointer "
            role="button"
            onClick={() => {
              props.setPaid(true);
            }}>
            <img src="../assets/images/paid_button.png" />
          </div> */}
          {/* <p className="thanks">Thank you from Jeremy’s Live!</p> */}
        </div>
      </div>
    </div>
  );
}

export default Ticket;

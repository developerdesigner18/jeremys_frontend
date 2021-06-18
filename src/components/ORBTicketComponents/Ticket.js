import React, {useEffect, useState, useRef} from "react";
import "../../assets/css/ticket.css";
import {useSelector, useDispatch} from "react-redux";
import {getUserWithId} from "../../actions/userActions";
import moment from "moment";
import {
  tipOrTicketPayment,
  paymentForTicket,
  getTicketDetail,
  makeTicketEmpty,
} from "../../actions/paymentActions";
import Modal from "react-bootstrap/Modal";
import swal from "sweetalert";

function Ticket(props) {
  const dispatch = useDispatch();
  const stateUser = useSelector(state => state.user);
  const paymentState = useSelector(state => state.payment);

  const [userInfo, setUserInfo] = useState({});
  const [paid, setPaid] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const paypalRef = useRef();
  const [paypalModal, setPaypalModal] = useState(false);

  useEffect(async () => {
    await dispatch(getUserWithId(props.userId));

    document.addEventListener("visibilitychange", async event => {
      if (document.visibilityState == "visible") {
        await dispatch(getTicketDetail(props.streamObj._id));
        await dispatch(makeTicketEmpty());
        console.log("tab is active in ticket");
      } else {
        console.log("tab is inactive");
      }
    });
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

  useEffect(async () => {
    if (paymentState) {
      console.log("paymentState.ticketReceipt", paymentState.ticketInfo);
      if (paymentState.ticketInfo) {
        console.log("ticket info..");
        props.setPaid(true);
        props.setFreeSessionCompleted(false);
      }
      if (paymentState.ticketUrl && !paymentState.ticketInfo) {
        console.log("paymentState.ticketUrl && !paymentState.ticketInfo");
        console.log(paymentState.ticketUrl);
        window.open(paymentState.ticketUrl);
        // await dispatch(getTicketDetail(props.streamObj._id));
        // props.handleClose();
      }
    }
  }, [paymentState]);

  async function callMakePayment() {
    console.log("fn called..");

    const dataToPass = {
      userId: props.userId,
      fanId: localStorage.getItem("id"),
      streamId: props.streamObj._id,
      total: props.streamObj.price,
      dateTime: moment.utc(),
    };
    await dispatch(paymentForTicket(dataToPass));
  }

  return (
    <div className="MainwrapperTicket">
      <div className="main_reciept_container position-relative ">
        <div className="background_image">
          <img src="../assets/images/JL_RECEIPT_PAID.jpg" />
        </div>
        {/* <div
          className="position-absolute text-muted cursor-pointer"
          style={{top: "10px", right: "20px"}}
        >
          <i
            className="fas fa-times "
            role="button"
            onClick={() => {
              if (props.freeSessionCompleted) {
                props.setShow(true);
              } else {
                console.log("3 minutes props.. ", props.threeMinutesComplete);
                if (props.threeMinutesComplete) {
                  swal({
                    text: "Our Apologies You have exceeded the three minutes time limit. Are you sure you want to exit live session?",
                    buttons: ["Exit", "Go back to pay"],
                  }).then(async function (isConfirm) {
                    if (isConfirm) {
                      props.setShow(true);
                    } else {
                      props.leaveCallFromFan();
                    }
                  });
                } else {
                  props.handleClose();
                }
              }
            }}
            style={{zIndex: "1", padding: "5px"}}
          />
        </div>
         */}
        <Modal
          show={paypalModal}
          onHide={() => {
            setPaypalModal(false);
          }}
          centered
          // dialogClassName="modal-ticket"
          aria-labelledby="example-custom-modal-styling-title">
          <Modal.Body style={{padding: "0", background: "black"}}>
            <div class="d-flex justify-content-end text-muted">
              <i
                class="fas fa-times "
                role="button"
                onClick={() => {
                  setPaypalModal(false);
                }}
                style={{zIndex: "1", padding: "5px"}}
              />
            </div>
          </Modal.Body>
        </Modal>

        <div className="main_container d-flex flex-column align-items-center">
          <div
            className="position-absolute text-muted cursor-pointer"
            style={{top: "0px", right: "10px"}}>
            <i
              className="fas fa-times "
              role="button"
              onClick={() => {
                if (props.freeSessionCompleted) {
                  props.setShow(true);
                } else {
                  console.log("3 minutes props.. ", props.threeMinutesComplete);
                  if (props.threeMinutesComplete) {
                    swal({
                      text: "Our Apologies You have exceeded the three minutes time limit. Are you sure you want to exit live session?",
                      buttons: ["Exit", "Go back to pay"],
                    }).then(async function (isConfirm) {
                      if (isConfirm) {
                        props.setShow(true);
                      } else {
                        props.leaveCallFromFan();
                      }
                    });
                  } else {
                    props.handleClose();
                  }
                }
              }}
              style={{zIndex: "1", padding: "5px"}}
            />
          </div>

          <div className="text-center">
            <img
              src="../assets/images/silver_logo.png"
              style={{height: "65px"}}
            />
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
                      "https://jeremysLive.com:8000/default/profile.jpg";
                  }}
                />
              </div>
            </div>
          </div>
          <button className="reciept_button ">
            {userInfo.firstName + " " + userInfo.lastName}
          </button>
          <h4
            className="my-4 text-uppercase text-light"
            style={{
              fontWeight: "500",
              fontSize: "16px",
              letterSpacing: "4px",
            }}>
            Live Performance
          </h4>
          <div className="text-center">
            <div
              className="table_down d-flex align-items-center "
              style={{letterSpacing: "2px"}}>
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
          <div
            className="d-flex justify-content-between mt-4 mb-0"
            style={{width: "68%"}}>
            <div className="mb-0">
              <span style={{fontWeight: "500", letterSpacing: "2px"}}>
                {" "}
                Duration :
              </span>
              <span style={{letterSpacing: "2px"}}>
                {props.streamObj.timer / 60} Minutes
              </span>
            </div>

            <div className=" mb-0">
              <span style={{fontWeight: "500", letterSpacing: "2px"}}>
                Seats :{/* </p> */}
              </span>

              <span style={{letterSpacing: "2px"}}>
                {props.streamObj.seats}
              </span>
            </div>
          </div>
          <p
            className="mt-2 mb-0"
            style={{fontWeight: "500", letterSpacing: "3px"}}>
            Ticket price :
            <span style={{letterSpacing: "2px"}}>
              $ {props.streamObj.price}
            </span>
          </p>

          {/* <div ref={paypalRef} /> */}
          <div
            className="paid_image mt-2 pointer "
            role="button"
            onClick={() => {
              callMakePayment();
            }}>
            <img src="../assets/images/pay.png" />
          </div>
          {/* <p className="thanks">Thank you from Jeremy’s Live!</p> */}
        </div>
      </div>
    </div>
  );
}

export default Ticket;

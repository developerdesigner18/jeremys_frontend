import React, {useState, useEffect, useRef} from "react";
import "../../assets/css/ratings.css";
import {useDispatch, useSelector} from "react-redux";

import moment from "moment";
import {
  tipOrTicketPayment,
  paymentForTIcktOrTip,
  getPaymentDetailsOfStarTrainer,
  tipPaymentDetail,
  makeTipEmpty,
} from "../../actions/paymentActions";
import Modal from "react-bootstrap/Modal";
import socketIOClient from "socket.io-client";

function Tip(props) {
  const [tipAmount, setTipAmount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [paypalModal, setPaypalModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [tipPaid, settipPaid] = useState(false);

  const dispatch = useDispatch();

  const paypalRef = useRef();
  const paymentState = useSelector(state => state.payment);
  let socket;

  const storeTipAmount = value => {
    if (value >= 1 && value <= 100) {
      setErrorMsg("");
      setTipAmount(value);
    } else {
      setErrorMsg("You can give tip from $1 to $100");
      setTipAmount(0);
    }
  };

  useEffect(() => {
    const sript = document.createElement("script");
    sript.src =
      "https://www.paypal.com/sdk/js?client-id=AX9JUYCp-VOmxZI1JINHxcV86njVZCE_dFE30EkjAh0_WXgaKRy6_NxXzb0Jwuf0LBlx5OiJ6DJjo00n";

    sript.addEventListener("load", () => {
      setLoaded(true);
    });
    document.body.appendChild(sript);
    console.log("load............. ", loaded);

    if (loaded) {
      setTimeout(() => {
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: "Tip for " + props.type ? props.type : "",
                    amount: {
                      currency_code: "USD",
                      value: tipAmount,
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
                  userId: props.userId,
                  tipAmount: tipAmount,
                  streamId: props.streamId,
                  fanId: localStorage.getItem("id"),
                  dateTime: moment.utc(),
                };

                await dispatch(tipOrTicketPayment(dataToPass));
                props.setShow(false);
              }
            },
            onError: err => {
              setError(err);
              console.error("erorr in payapl......... ", err);
            },
          })
          .render(paypalRef.current);
      }, 1000);
    }
  }, [tipAmount, loaded]);

  useEffect(() => {
    if (paymentState) {
      console.log(
        "paid response.. ",
        paymentState.paidResponse,
        paymentState.tipDetail,
        paymentState.paidResponse && !paymentState.tipDetail
      );
      // if (paymentState.tipDetail) {
      //   console.log("tip response..");
      //   props.closeTip();
      //   settipPaid(true);
      //   socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);

      //   socket.emit("getIdForTipAmdTicket", props.streamId);
      //   if (props.paid) {
      //     props.setTime(0);
      //     props.closeTip();
      //   } else {
      //     props.setIsActive(true);
      //   }
      // }
      if (paymentState.paidResponse && !paymentState.tipDetail) {
        console.log("payment url reponse");
        console.log(paymentState.paidResponse);
        window.open(paymentState.paidResponse);
      }

      // if (paymentState.paidResponse) {
      //   if (paymentState.ticketReceipt) {
      //     if (paymentState.ticketReceipt["total"]) {
      //       console.log(paymentState.paidResponse);
      //       window.open(paymentState.paidResponse);
      //     } else {
      //       settipPaid(true);
      //       props.setShowTip(false);
      //     }
      //   } else {
      //     console.log(paymentState.paidResponse);
      //     window.open(paymentState.paidResponse);
      //   }
      // }
      // if (props.type && (props.type == "chef" || props.type == "Chef")) {
      //   if (paymentState.paidResponse && paymentState.tipDetail === undefined) {
      //     console.log(paymentState.paidResponse);
      //     window.open(paymentState.paidResponse);
      //   }

      //   if (paymentState.tipDetail !== undefined) {
      //     if (paymentState.tipDetail === true) {
      //       settipPaid(paymentState.tipDetail);
      //       props.setShowTip(true);
      //       setLoader(true);
      //     } else {
      //       settipPaid(paymentState.tipDetail);
      //       props.setShowTip(paymentState.tipDetail);
      //       setLoader(paymentState.tipDetail);
      //     }
      //   }
      // } else if (
      //   props.type &&
      //   (props.type == "stylist" || props.type == "Stylist")
      // ) {
      //   if (paymentState.paidResponse && paymentState.tipDetail === undefined) {
      //     console.log(paymentState.paidResponse);
      //     window.open(paymentState.paidResponse);
      //   }

      //   if (paymentState.tipDetail !== undefined) {
      //     if (paymentState.tipDetail === true) {
      //       settipPaid(paymentState.tipDetail);
      //       props.setShowTip(true);
      //       setLoader(true);
      //     } else {
      //       settipPaid(paymentState.tipDetail);
      //       props.setShowTip(paymentState.tipDetail);
      //       setLoader(paymentState.tipDetail);
      //     }
      //   }
      // } else {
      //   console.log(paymentState.ticketReceipt, paymentState.tipDetail);
      //   if (paymentState.paidResponse && !paymentState.ticketReceipt) {
      //     console.log(
      //       "for star and ticket... ",
      //       paymentState.paidResponse && !paymentState.ticketReceipt
      //     );
      //     console.log(paymentState.paidResponse);
      //     window.open(paymentState.paidResponse);
      //   }
      //   if (paymentState.tipDetail !== undefined) {
      //     settipPaid(paymentState.tipDetail);
      //     props.setShowTip(true);
      //     setLoader(true);
      //   }
      // }
    }
  }, [paymentState]);

  useEffect(async () => {
    document.addEventListener("visibilitychange", event => {
      if (document.visibilityState == "visible") {
        dispatch(
          tipPaymentDetail(
            props.streamId,
            localStorage.getItem("id"),
            props.userId
          )
        );
        dispatch(getPaymentDetailsOfStarTrainer(props.streamId, props.userId));
        // dispatch(makeTipEmpty());
        console.log("tab is active");
      } else {
        console.log("tab is inactive");
      }
    });
  }, []);

  useEffect(async () => {
    if (paymentState) {
      if (paymentState.tipDetail) {
        console.log("tip response..");
        props.closeTip();
        settipPaid(true);
        await dispatch(makeTipEmpty());
        socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);

        socket.emit("getIdForTipAmdTicket", props.streamId);
        if (props.paid) {
          // props.setTime(0);
          props.closeTip();
        } else {
          props.setIsActive(true);
        }
      }
    }
  }, [paymentState && paymentState.tipDetail]);

  const callMakePayment = async () => {
    console.log("fn called..");

    setLoader(true);
    if (tipAmount >= 1 && tipAmount <= 100) {
      setErrorMsg("");
      // setTipAmount(tipAmount);
      const dataToPass = {
        userId: props.userId,
        fanId: localStorage.getItem("id"),
        streamId: props.streamId,
        tipAmount: tipAmount,
        dateTime: moment.utc(),
      };
      await dispatch(paymentForTIcktOrTip(dataToPass));
    } else {
      setErrorMsg("You can give tip from $1 to $100");
    }
  };

  return (
    <div style={{background: "black"}} className="container">
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
      <div className="justify-content-center align-items-center d-flex pt-5">
        <label className="mx-2">Enter Tip amount: </label>
        <input
          type="number"
          name="tip"
          style={{width: "180px"}}
          className="mx-2"
          placeholder="Enter your tip amount"
          onChange={e => storeTipAmount(e.target.value)}
        />
      </div>
      <div className="text-center">
        <span style={{color: "red", alignItems: "center"}}>{errorMsg}</span>
        <p style={{color: "red"}}>{tipPaid ? "You already give tip!" : ""}</p>
      </div>
      <div className="d-flex justify-content-center pb-4">
        {/* <div ref={paypalRef}></div> */}

        <button
          className="btn btn-default btn_submit"
          disabled={errorMsg !== ""}
          onClick={() => callMakePayment()}>
          Pay
          {/* {loader ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"></span>
              <span className="sr-only">Loading...</span>
            </>
          ) : (
            "Pay"
          )} */}
        </button>
      </div>
    </div>
  );
}

export default Tip;

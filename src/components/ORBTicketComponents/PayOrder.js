import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import "../../assets/css/ticket.css";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import paypal from "paypal-checkout";
import { getUserWithId } from "../../actions/userActions";
import {
  makeOrderPayment,
  makePayment,
  getPaymentDetails,
} from "../../actions/paymentActions";
import moment from "moment";

// const PayPalButton = paypal.Buttons.driver("react", {
//   React: window.React,
//   ReactDOM: window.ReactDOM,
// });

function PayOrder(props) {
  const dispatch = useDispatch();
  const stateData = useSelector((state) => state.user);
  const paymentState = useSelector((state) => state.payment);

  const [paypalModal, setPaypalModal] = useState(false);
  const [paypalModalSrc, setPaypalModalSRC] = useState(null);
  const [user, setUser] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(
    Number(props.price1) + Number(props.price2)
  );
  const [check1, setCheck1] = useState(true);
  const [check2, setCheck2] = useState(true);
  const [paid, setPaid] = useState(false);
  const paypalRef = useRef();

  useEffect(async () => {
    await dispatch(getUserWithId(localStorage.getItem("id")));

    document.addEventListener("visibilitychange", (event) => {
      if (document.visibilityState == "visible") {
        dispatch(getPaymentDetails(props.streamId));
        console.log("tab is active");
      } else {
        console.log("tab is inactive");
      }
    });
  }, []);

  useEffect(() => {
    if (stateData) {
      if (stateData.userInfo) {
        setUser(stateData.userInfo.data);
      }
    }
  }, [stateData]);

  useEffect(() => {
    if (paymentState) {
      if (paymentState.paymentResponse && !paymentState.paymentDetail) {
        console.log(paymentState.paymentResponse);
        window.open(paymentState.paymentResponse);
        // setPaypalModalSRC(paymentState.paymentResponse);
        // setPaypalModal(true);
        // setPaid(true);
      }
      if (paymentState.paymentDetail) {
        console.log(
          "paymentState.paymentDetail-=-=-=",
          paymentState.paymentDetail
        );
      }
    }
  }, [paymentState]);

  let load = false;
  const callMakePayment = () => {
    const dataToPass = {
      userId: props.userId,
      fanId: user._id,
      streamId: props.streamId,
      total: total,
      dateTime: moment.utc(),
      item:
        check1 && check2
          ? [props.item1, props.item2]
          : check1
          ? [props.item1]
          : check2
          ? [props.item2]
          : [],
      price:
        check1 && check2
          ? [props.price1, props.price2]
          : check1
          ? [props.price1]
          : check2
          ? [props.price2]
          : [],
    };
    dispatch(makePayment(dataToPass));
  };

  useEffect(() => {
    const sript = document.createElement("script");
    sript.src =
      "https://www.paypal.com/sdk/js?client-id=AX9JUYCp-VOmxZI1JINHxcV86njVZCE_dFE30EkjAh0_WXgaKRy6_NxXzb0Jwuf0LBlx5OiJ6DJjo00n";

    sript.addEventListener("load", () => {
      setLoaded(true);
      load = true;
    });
    document.body.appendChild(sript);
    console.log("load............. ", load, loaded);

    if (loaded) {
      setTimeout(() => {
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              console.log("total............ ", total);
              return actions.order.create({
                purchase_units: [
                  {
                    description: props.item1,
                    amount: {
                      currency_code: "USD",
                      value: total,
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
                  fanId: user._id,
                  streamId: props.streamId,
                  total: total,
                  dateTime: moment.utc(),
                  item:
                    check1 && check2
                      ? [props.item1, props.item2]
                      : check1
                      ? [props.item1]
                      : check2
                      ? [props.item2]
                      : [],
                  price:
                    check1 && check2
                      ? [props.price1, props.price2]
                      : check1
                      ? [props.price1]
                      : check2
                      ? [props.price2]
                      : [],
                };
                await dispatch(makeOrderPayment(dataToPass));
                // props.setShow(false);
                props.setPaid(true);
              }
            },
            onError: (err) => {
              setError(err);
              console.error("erorr in payapl......... ", err);
            },
          })
          .render(paypalRef.current);
      }, 1000);
    }
  }, [total, loaded]);

  let ans = 0;
  const getSelectedItem = (event, val) => {
    console.log("fn called.................", event.target.value);
    if (val == 1) {
      setCheck1(!check1);
    } else if (val == 2) {
      setCheck2(!check2);
    }
    if (event.target.checked) {
      ans = total + parseFloat(event.target.value);
    } else {
      ans = total - parseFloat(event.target.value);
    }
    console.log("ans............", ans);

    setTotal(ans);
    setLoaded(false);
  };
  // var ppp = paypal.apps.PPP({
  //   approvalUrl: paypalModalSrc,
  //   placeholder: "ppplus",
  //   mode: "sandbox",
  // });
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
              props.handleClose();
            }}
            style={{ zIndex: "1", padding: "5px" }}
          />
        </div>
        <Modal
          show={paypalModal}
          onHide={() => {
            setPaypalModal(false);
          }}
          centered
          // dialogClassName="modal-ticket"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Body style={{ padding: "0", background: "black" }}>
            <div class="d-flex justify-content-end text-muted">
              <i
                class="fas fa-times "
                role="button"
                onClick={() => {
                  setPaypalModal(false);
                }}
                style={{ zIndex: "1", padding: "5px" }}
              />
            </div>
            {/* <div id="ppplus"></div>
            <button
              type="submit"
              id="continueButton"
              onClick={() => {
                ppp.doContinue();
                return false;
              }}
            >
              {" "}
              Checkout
            </button> */}
            <a
              type="submit"
              className="button"
              id="continueButton"
              target="_blank"
              href={paypalModalSrc}
              // onClick={() => {
              //   ppp.doContinue();
              //   return false;
              // }}
            >
              {" "}
              Proceed to Checkout
            </a>
            {/* <iframe
              allowpaymentrequest={true}
              sandbox="allow-forms allow-modals allow-scripts allow-same-origin  allow-popups allow-top-navigation allow-top-navigation-by-user-activation"
              allow="geolocation; microphone; camera"
              // style="border: 0px; "
              src={paypalModalSrc}
              width="100%"
              height="500px"
            ></iframe> */}
          </Modal.Body>
        </Modal>

        <div class="main_container d-flex flex-column align-items-center">
          <div class="text-center">
            <img src="../assets/images/silver_logo.png" />
          </div>
          <div class="contact_mail d-flex align-items-center mb-4 mt-3">
            <div class="contact mr-2">Contact: +1547889</div>
            <div class="mail ml-2">Email: mail@jeremys.com</div>
          </div>
          <button class="reciept_button mb-3">ORDER TOTAL</button>
          <p class="mb-1">BILLED TO:</p>
          <p>{user.firstName + " " + user.lastName}</p>
          <p class="date">Date: {moment().format("DD MMM, YYYY")}</p>
          <div class="table_down mt-4 d-flex align-items-center">
            <div></div>
            <div>NO.</div>
            <div>DESCRIPTION</div>
            <div>PRICE</div>
            <div>QUANTITY</div>
            <div>TOTAL</div>
          </div>
          <div class="table_down table_middle mt-3 d-flex align-items-center">
            <div>
              <input
                type="checkbox"
                name="item1"
                value={props.price1}
                checked={check1}
                onChange={(e) => getSelectedItem(e, 1)}
              />
            </div>
            <div>1</div>
            <div>{props.item1}</div>
            <div>${props.price1}</div>
            <div>1</div>
            <div>${props.price1}</div>
          </div>
          <div class="table_down table_middle mt-1 d-flex align-items-center">
            <div>
              <input
                type="checkbox"
                name="item1"
                value={props.price2}
                checked={check2}
                onChange={(e) => getSelectedItem(e, 2)}
              />
            </div>
            <div>2</div>
            <div>{props.item2}</div>
            <div>${props.price2}</div>
            <div>1</div>
            <div>${props.price2}</div>
          </div>
          {/* <div class="tax_container mt-5 d-flex align-items-center">
            <div class="tax mr-3">Tax:</div>
            <div class="">$13</div>
          </div> */}
          <div class="tax_container d-flex align-items-center mt-4">
            <div class="tax mr-3">TOTAL</div>
            <div class="">${total}</div>
          </div>
          <div class="paid_image my-3">
            {/* {paid ? (
              <img src="../assets/images/paid_button.png" />
            ) : props.type == "chef" ||
              props.type == "Chef" ||
              props.type == "stylist" ||
              props.type == "Stylist" ? (
              total == 0 ? (
                <img src="../assets/images/pay.png" />
              ) : (
                <img src="../assets/images/paid_button.png" />
              )
            ) : total == 0 ? (
              <img src="../assets/images/pay.png" />
            ) : null} */}

            {/* {total == 0 ? 
              <img src="../assets/images/pay.png" />
            : null} */}
            <img
              src="../assets/images/pay.png"
              className="button"
              style={{ cursor: "pointer" }}
              onClick={callMakePayment}
            />
          </div>
          {/* <div ref={paypalRef} /> */}
          {/* <p class="thanks">Thank you from Jeremy’s Live!</p> */}
        </div>
      </div>
    </div>
  );
}

export default PayOrder;

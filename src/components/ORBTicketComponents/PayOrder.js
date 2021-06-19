import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom";
import "../../assets/css/ticket.css";
import {useDispatch, useSelector} from "react-redux";
import Modal from "react-bootstrap/Modal";
import paypal from "paypal-checkout";
import {getUserWithId, storeUserAddress} from "../../actions/userActions";
import {
  makeOrderPayment,
  makePayment,
  getPaymentDetails,
  makeOrderEmpty,
} from "../../actions/paymentActions";
import moment from "moment";
import swal from "sweetalert";

// const PayPalButton = paypal.Buttons.driver("react", {
//   React: window.React,
//   ReactDOM: window.ReactDOM,
// });

function PayOrder(props) {
  const dispatch = useDispatch();
  const stateData = useSelector(state => state.user);
  const paymentState = useSelector(state => state.payment);

  const [paypalModal, setPaypalModal] = useState(false);
  const [paypalModalSrc, setPaypalModalSRC] = useState(null);
  const [user, setUser] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [quantity1, setQuantity1] = useState(1);
  const [quantity2, setQuantity2] = useState(1);
  // const [total, setTotal] = useState(
  //   Number(props.price1 * quantity1) + Number(props.price2 * quantity2)
  // );
  const [total, setTotal] = useState(Number(props.selectedFoodPrice));
  // const [check1, setCheck1] = useState(true);
  // const [check2, setCheck2] = useState(true);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [paid, setPaid] = useState(false);
  const [address, setAddress] = useState("");
  const [fanDetail, setFanDetail] = useState(props.userInfo);

  const paypalRef = useRef();

  useEffect(() => {
    if (props.selectedFoodItem === 1) {
      setCheck1(true);
    } else if (props.selectedFoodItem === 2) {
      setCheck2(true);
    }
  }, [props.selectedFoodItem]);

  useEffect(async () => {
    console.log("props... ", props);
    await dispatch(getUserWithId(props.userId));

    document.addEventListener("visibilitychange", event => {
      if (document.visibilityState == "visible") {
        dispatch(getPaymentDetails(props.streamId));
        dispatch(makeOrderEmpty());
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
      console.log(
        "payment state... ",
        paymentState.paymentResponse && !paymentState.paymentDetail
      );
      if (paymentState.paymentResponse && !paymentState.paymentDetail) {
        console.log(paymentState.paymentResponse);
        window.open(paymentState.paymentResponse);
        // setPaypalModalSRC(paymentState.paymentResponse);
        // setPaypalModal(true);
      }
      if (paymentState.paymentDetail) {
        setPaid(true);
        props.setPaid(true);
        // setLoaded(false);

        console.log(
          "paymentState.paymentDetail-=-=-=",
          paymentState.paymentDetail
        );
      }
    }
  }, [paymentState]);

  let load = false;
  const callMakePayment = async () => {
    // setLoaded(true);
    const dataForAddress = {
      userId: props.userId,
      address: address,
    };
    await dispatch(storeUserAddress(dataForAddress));
    const dataToPass = {
      userId: props.userId,
      fanId: localStorage.getItem("id"),
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
      quantity:
        check1 && check2
          ? [quantity1, quantity2]
          : check1
          ? [quantity1]
          : check2
          ? [quantity2]
          : [],
    };
    await dispatch(makePayment(dataToPass));
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
                  fanId: localStorage.getItem("id"),
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
            onError: err => {
              setError(err);
              console.error("erorr in payapl......... ", err);
            },
          })
          .render(paypalRef.current);
      }, 1000);
    }
  }, [total, loaded]);

  let ans = 0;
  let itemVal = 0;
  const getSelectedItem = (event, val) => {
    console.log("fn called.................", event.target.value);
    if (val == 1) {
      setCheck1(!check1);
      itemVal = parseFloat(event.target.value) * quantity1;
    } else if (val == 2) {
      setCheck2(!check2);
      itemVal = parseFloat(event.target.value) * quantity2;
    }
    console.log("item val... ", total + itemVal);
    if (event.target.checked) {
      ans = total + itemVal;
    } else {
      ans = total - itemVal;
    }
    console.log("ans............", ans);

    setTotal(ans);
    setLoaded(false);
  };

  const calculateQuantity1 = value => {
    setQuantity1(value);
    let item2Price = parseFloat(props.price2) * quantity2;
    let item1Price = parseFloat(props.price1) * value;

    if (check1 && check2) {
      ans = item1Price + item2Price;
      setTotal(ans);
    } else if (check1) {
      ans = item1Price;
      setTotal(ans);
    } else if (check2) {
      ans = item2Price;
      setTotal(ans);
    }
  };

  const calculateQuantity2 = value => {
    setQuantity2(value);
    let item2Price = parseFloat(props.price2) * value;
    let item1Price = parseFloat(props.price1) * quantity1;

    if (check1 && check2) {
      ans = item1Price + item2Price;
      setTotal(ans);
    } else if (check1) {
      ans = item1Price;
      setTotal(ans);
    } else if (check2) {
      ans = item2Price;
      setTotal(ans);
    }
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
        {/* <div class="d-flex justify-content-end text-muted"> */}
        {/* <i
            class="fas fa-times "
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
          /> */}
        {/* </div> */}
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
            {/* <a
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
            </a> */}
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
          <div
            class="position-absolute text-muted"
            style={{cursor: "pointer", zIndex: "1", top: "0", right: "10px"}}>
            <i
              class="fas fa-times "
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

          <div class="text-center">
            <img
              src="../assets/images/silver_logo.png"
              style={{height: "65px"}}
            />
          </div>
          <div class="contact_mail d-flex align-items-center mb-4 mt-3">
            <div class="contact mr-2">Contact: {user.contactNumber}</div>
            <div class="mail ml-2">Email: {user.emailId}</div>
          </div>
          <button class="reciept_button mb-3">ORDER TOTAL</button>
          <p class="mb-2" style={{letterSpacing: "2px"}}>
            BILLED TO:
          </p>
          <p style={{letterSpacing: "2px"}}>
            {fanDetail.firstName + " " + fanDetail.lastName}
          </p>
          <div>
            <input
              type="text"
              style={{width: "300px"}}
              placeholder="Enter the address"
              defaultValue={fanDetail.startAddress}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
          <p class="date mb-0" style={{letterSpacing: "2px"}}>
            Date: {moment().format("DD MMM, YYYY")}
          </p>
          <div class="table_down mt-4 d-flex align-items-center p-0">
            <div></div>
            <div>NO.</div>
            <div>DESCRIPTION</div>
            <div>PRICE</div>
            <div>QUANTITY</div>
            <div>TOTAL</div>
          </div>
          <div class="table_down table_middle mt-2 d-flex align-items-center p-0">
            <div>
              <input
                type="checkbox"
                name="item1"
                value={props.price1}
                checked={check1}
                onChange={e => getSelectedItem(e, 1)}
              />
            </div>
            <div>1</div>
            <div>{props.item1}</div>
            <div>${props.price1}</div>
            <div>
              <input
                type="number"
                style={{width: "50px"}}
                onChange={e => calculateQuantity1(e.target.value)}
                defaultValue={quantity1}
              />
            </div>
            <div>${props.price1}</div>
          </div>
          <div class="table_down table_middle mt-1 d-flex align-items-center p-0">
            <div>
              <input
                type="checkbox"
                name="item1"
                value={props.price2}
                checked={check2}
                onChange={e => getSelectedItem(e, 2)}
              />
            </div>
            <div>2</div>
            <div>{props.item2}</div>
            <div>${props.price2}</div>
            <div>
              <input
                type="number"
                style={{width: "50px"}}
                onChange={e => calculateQuantity2(e.target.value)}
                defaultValue={quantity2}
              />
            </div>
            <div>${props.price2}</div>
          </div>
          {/* <div class="tax_container mt-5 d-flex align-items-center">
            <div class="tax mr-3">Tax:</div>
            <div class="">$13</div>
          </div> */}
          <div class="tax_container d-flex align-items-center mt-3">
            <div class="tax mr-3">TOTAL</div>
            <div class="">${total}</div>
          </div>
          <div class="paid_image mt-2">
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

            {total == 0 ? null : paid ? (
              <img src="../assets/images/pay.png" />
            ) : (
              <img
                src="../assets/images/pay.png"
                className="button"
                style={{cursor: "pointer"}}
                onClick={() => callMakePayment()}
              />
            )}
          </div>
          {/* <div ref={paypalRef} /> */}
          {/* <p class="thanks">Thank you from Jeremy’s Live!</p> */}
        </div>
      </div>
    </div>
  );
}

export default PayOrder;

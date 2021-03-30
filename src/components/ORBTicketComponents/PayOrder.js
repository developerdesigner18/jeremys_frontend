import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom";
import "../../assets/css/ticket.css";
import {useDispatch, useSelector} from "react-redux";

import {getUserWithId} from "../../actions/userActions";
import {makeOrderPayment} from "../../actions/paymentActions";
import moment from "moment";

// const PayPalButton = paypal.Buttons.driver("react", {
//   React: window.React,
//   ReactDOM: window.ReactDOM,
// });

function PayOrder(props) {
  const dispatch = useDispatch();
  const stateData = useSelector(state => state.user);
  const paymentState = useSelector(state => state.payment);

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
      if (paymentState.paymentResponse) {
        setPaid(true);
      }
    }
  }, [paymentState]);

  let load = false;

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
                  price:
                    check1 && check2
                      ? [props.price1, props.price2]
                      : check1
                      ? [props.price1]
                      : check2
                      ? [props.price2]
                      : [],
                  total: total,
                  fanId: user._id,
                  item:
                    check1 && check2
                      ? [props.item1, props.item2]
                      : check1
                      ? [props.item1]
                      : check2
                      ? [props.item2]
                      : [],
                  userId: props.userId,
                  streamId: props.streamId,
                  dateTime: moment.utc(),
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
            style={{zIndex: "1", padding: "5px"}}
          />
        </div>
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
                onChange={e => getSelectedItem(e, 1)}
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
                onChange={e => getSelectedItem(e, 2)}
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

            {/* {total == 0 ? <img src="../assets/images/pay.png" /> : null} */}
          </div>
          <div ref={paypalRef} />
          {/* <p class="thanks">Thank you from Jeremy’s Live!</p> */}
        </div>
      </div>
    </div>
  );
}

export default PayOrder;

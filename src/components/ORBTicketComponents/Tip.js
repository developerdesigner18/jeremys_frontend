import React, {useState, useEffect, useRef} from "react";
import "../../assets/css/ratings.css";
import {useDispatch, useSelector} from "react-redux";

import {tipOrTicketPayment} from "../../actions/paymentActions";
import moment from "moment";

function Tip(props) {
  const [tipAmount, setTipAmount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const paypalRef = useRef();

  const storeTipAmount = value => {
    if (value > 100) {
      setErrorMsg("You can give tip from $1 to $100");
      setTipAmount(0);
    } else {
      setErrorMsg("");
      setTipAmount(value);
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
                    description: "Tip for" + props.type,
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

  return (
    <div style={{background: "black"}} className="container">
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
      </div>
      <div className="d-flex justify-content-center p-4">
        <div ref={paypalRef}></div>
        {/* <button className="btn btn-default btn_submit">Submit</button> */}
      </div>
    </div>
  );
}

export default Tip;

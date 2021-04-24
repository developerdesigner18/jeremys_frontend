import React, {useState, useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {getTipDetails} from "../../actions/paymentActions";

function TipList(props) {
  console.log("props..... ", props);
  const [totalTip, setTotalTip] = useState(0);

  const statePayment = useSelector(state => {
    console.log("states... ", state);
    return state.payment;
  });
  const dispatch = useDispatch();

  useEffect(async () => {
    await dispatch(getTipDetails(props.streamId));
  }, []);

  useEffect(() => {
    console.log("statePayment.tipList", statePayment);
    if (statePayment) {
      if (statePayment.tipList && statePayment.tipList.length) {
        let total = statePayment.tipList.reduce((previous, current) => {
          if (current.tipAmount) {
            previous += current.tipAmount;

            return previous;
          }
        }, 0);

        setTotalTip(total);
      }
    }
  }, [statePayment]);

  const callClose = () => {
    props.setTip(false);
  };

  return (
    <div style={{background: "black", height: "90px"}} className="container">
      <div className="d-flex justify-content-end text-muted">
        <i
          className="fas fa-times pt-1"
          role="button"
          onClick={() => {
            props.setTip(false);
          }}
          style={{zIndex: "1"}}
        />
      </div>
      <div className="justify-content-center align-items-center d-flex pt-3">
        <label className="mx-2">Total Tip amount: </label>
        <label className="mx-2">{totalTip}</label>
        {/* <input
            type="number"
            name="tip"
            style={{width: "180px"}}
            className="mx-2"
            placeholder="Enter your tip amount"
          /> */}
      </div>
    </div>
  );
}

export default TipList;

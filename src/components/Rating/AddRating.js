import React, { useState, useEffect } from "react";
import StarRatings from "react-star-ratings";
import "../../assets/css/ratings.css";
import { storeRateReview } from "../../actions/orbActions";
import { useDispatch, useSelector } from "react-redux";
// import {} from "../../assets/images/";

function AddRating(props) {
  const [review, setReview] = useState("");
  const [rate, setRate] = useState(0);

  const dispatch = useDispatch();
  const stateData = useSelector(state => state.ORB);

  const escFunction = event => {
    if (event.keyCode === 27) {
      //Do whatever when esc is pressed
      console.log("esc pressed");
      props.closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  const submitRateReview = async () => {
    const dataToPass = {
      fanId: localStorage.getItem("id"),
      review: review,
      rating: rate,
      artistId: props.userId,
      item: props.itemDetail
        ? props.itemDetail.chefItems
          ? props.itemDetail.chefItems[0].name
          : "Ticket"
        : "",
    };

    await dispatch(storeRateReview(dataToPass));
  };

  const setRateValue = value => {
    console.log("value ", value);
    setRate(value);
  };

  const callCloseMethod = () => {
    props.closeModal();
  };

  return (
    <div className="container" tabIndex="-1">
      <div className="rating_title">
        <h3>Rating and Review</h3>
        <div className="cancel_img">
          <img src="../../assets/images/cancel.png" onClick={callCloseMethod} />
        </div>
      </div>
      <div
        className="d-flex review_form"
        style={{ background: "black", flexDirection: "row" }}>
        <label>Give Review:</label>
        <input
          type="text"
          placeholder="Give review"
          className="form control review_text"
          onChange={e => setReview(e.target.value)}
        />
        <label className="rate">Rate:</label>
        <StarRatings
          rating={rate}
          starRatedColor="white"
          starEmptyColor="#b1b0b0"
          starDimension="25px"
          starSpacing="1px"
          isSelectable={true}
          starHoverColor="white"
          isAggregateRating={true}
          changeRating={value => setRateValue(value)}></StarRatings>
      </div>
      <div className="submit_container">
        <button className="btn btn-default btn_close" onClick={callCloseMethod}>
          Close
        </button>
        <button
          className="btn btn-default btn_submit"
          onClick={() => {
            submitRateReview();
          }}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default AddRating;

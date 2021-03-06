import swal from "sweetalert";
import axios from "axios";

export const storeScreenShot = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}api/user/saveScreenShot`, data)
      .then(result => {
        if (result.status === 200) {
          dispatch({
            type: "STORE_SCREENSHOT",
          });
          swal(
            "Success",
            "Screen shot saved successfully",
            "success"
          ).then(() => window.scrollTo());
        }
      })
      .catch(error => console.log("error while storing ss", error));
  };
};

export const storeChefOrbDetails = data => {
  return dispatch => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}api/stream/addDetailsChefStream`,
        data
      )
      .then(result => {
        console.log("result ", result.data);
        if (result.status === 201) {
          dispatch({
            type: "STORE_CHEF_ORB_DETAILS",
            payload: result.data,
          });
        }
      })
      .catch(error => console.log("error while storing ss", error));
  };
};

export const storeFanStatus = data => {
  return dispatch => {
    dispatch({
      type: "FAN_GO_LIVE",
      payload: data,
    });
  };
};

export const getUserToken = data => {
  return dispatch => {
    axios
      .get(`${process.env.REACT_APP_API_URL}api/agora/getUserToken?id=${data}`)
      .then(result => {
        console.log("api response ", result);
        if (result.data.code == 201) {
          dispatch({
            type: "USER_TOKEN",
            payload: result.data.data,
          });
        }
      })
      .catch(error => console.log("error while fetching data", error));
  };
};

export const getStreamDetails = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}api/stream/getStreamdata`, data)
      .then(result => {
        console.log("result ", result.data);
        if (result.status === 201) {
          dispatch({
            type: "GET_STREAM_DETAILS",
            payload: result.data,
          });
        }
      })
      .catch(error => console.log("error while storing ss", error));
  };
};

export const storeRateReview = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}api/reviews/addRatings`, data)
      .then(result => {
        if (result.data.success) {
          dispatch({
            type: "STORE_RATE_REVIEW",
            payload: result.data.success,
          });
          window.location.replace("/fanHomePage");
        }
      })
      .catch(error => {
        console.log("error ", error);
      });
  };
};

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

export const storeFanStatus = data => {
  return dispatch => {
    dispatch({
      type: "FAN_GO_LIVE",
      payload: data,
    });
  };
};

import axios from "axios";

export const getUsersForAdmin = () => {
  return dispatch => {
    axios
      .get(`${process.env.REACT_APP_API_URL}api/admin/getUsersForAdmin`)
      .then(result => {
        if (result.data.code === 200) {
          dispatch({
            type: "GET_ALL_USERS",
            payload: result.data.data,
          });
        }
      })
      .catch(error => console.log("error in admin api......... ", error));
  };
};

export const getPaymentForAdmin = () => {
  return dispatch => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/admin/getUserPaymentDetailForAdmin`
      )
      .then(result => {
        if (result.data.code === 200) {
          dispatch({
            type: "GET_ALL_PAYMENTS",
            payload: result.data.data,
          });
        } else {
          dispatch({
            type: "GET_ALL_PAYMENTS",
            payload: [],
          });
        }
      })
      .catch(error => console.log("error in payment admin api........", error));
  };
};

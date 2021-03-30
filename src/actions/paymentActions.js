import axios from "axios";

export const makeOrderPayment = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}api/payment/makeNewPayment`, data)
      .then(result => {
        if (result.data.code == 200) {
          dispatch({
            type: "MAKE_PAYMENT",
            payload: result.data.data,
          });
        }
      })
      .catch(error => {
        console.log("error..........", error);
      });
  };
};

export const tipOrTicketPayment = data => {
  return dispatch => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}api/payment/storeTicketOrTipPayment`,
        data
      )
      .then(result => {
        if (result.data.code == 200) {
          dispatch({
            type: "TICKET_TIP_PAYMENT",
            payload: result.data.data,
          });
        }
      })
      .catch(error => {
        console.log("error in api.....", error);
      });
  };
};

export const getPaymentDetails = data => {
  return dispatch => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/payment/getReceipt?streamId=${data}`
      )
      .then(result => {
        if (result.data.code == 200) {
          console.log("res.ult .data. ", result.data.data);
          dispatch({
            type: "GET_PAYMENT",
            payload: result.data.data,
          });
        }
      })
      .catch(err => console.log("err....... ", err));
  };
};

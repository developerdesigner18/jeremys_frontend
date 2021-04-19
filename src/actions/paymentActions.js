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
        console.log("res.ult .data. ", result.data);
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

export const getPaymentDetailsOfStarTrainer = data => {
  return dispatch => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/payment/getReceiptForStarOrTrainer?streamId=${data}`
      )
      .then(result => {
        if (result.data.code === 200) {
          dispatch({
            type: "GET_TICKET_PAYMENT",
            payload: result.data.data,
          });
        }
      })
      .catch(error => console.log("eror... ", error));
  };
};

export const fanJournalData = (data, type) => {
  return dispatch => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/payment/userJournal?userId=${data}&type=${type}`
      )
      .then(result => {
        if (result.data.code == 200) {
          dispatch({
            type: "FAN_JOURNAL_DATA",
            payload: result.data.data,
          });
        }
      })
      .catch(error => console.log("error..... ", error));
  };
};
export const chefJournalData = data => {
  return dispatch => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/payment/chefJournal?userId=${data}`
      )
      .then(result => {
        if (result.data.code == 200) {
          dispatch({
            type: "CHEF_JOURNAL_DATA",
            payload: result.data.data,
          });
        }
      })
      .catch(error => console.log("error..... ", error));
  };
};
export const starJournalData = data => {
  return dispatch => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/payment/starJournal?userId=${data}`
      )
      .then(result => {
        if (result.data.code == 200) {
          dispatch({
            type: "STAR_JOURNAL_DATA",
            payload: result.data.data,
          });
        }
      })
      .catch(error => console.log("error..... ", error));
  };
};
export const makePayment = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}api/payment/makePayment`, data)
      .then(result => {
        if (result.data.code == 200) {
          console.log("MAke payment data..... ", result.data);
          dispatch({
            type: "MAKE_PAYMENT",
            payload: result.data.data,
          });
        }
      })
      .catch(error => console.log("error..... ", error));
  };
};

export const paymentForTIcktOrTip = data => {
  return dispatch => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}api/payment/tipOrTicketPayment`,
        data
      )
      .then(result => {
        if (result.data.code === 200) {
          dispatch({
            type: "TICKET_TIP_PAYMENT",
            payload: result.data.data,
          });
        }
      })
      .catch(err => console.log("err... ", err));
  };
};

export const tipPaymentDetail = (streamId, fanId, userId) => {
  return dispatch => {
    axios
      .get(
        `${process.env.REACT_APP_API_URL}api/payment/getTipPaymentInfo?streamId=${streamId}&fanId=${fanId}&userId=${userId}`
      )
      .then(result => {
        if (result.data.code == 200) {
          dispatch({
            type: "GET_TIP_PAYMENT",
            payload: result.data.data,
          });
        }
      })
      .catch(error => console.log("error....... ", error));
  };
};

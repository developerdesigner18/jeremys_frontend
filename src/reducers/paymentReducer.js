const paymentReducer = (state = null, action) => {
  switch (action.type) {
    case "MAKE_PAYMENT":
      return {
        ...state,
        paymentResponse: action.payload,
      };

    case "TICKET_TIP_PAYMENT":
      return {
        ...state,
        paidResponse: action.payload,
      };

    case "GET_PAYMENT":
      return {
        ...state,
        paymentDetail: action.payload,
      };

    case "GET_TICKET_PAYMENT":
      return {
        ...state,
        ticketReceipt: action.payload,
      };

    default:
      return {
        ...state,
      };
  }
};

export default paymentReducer;

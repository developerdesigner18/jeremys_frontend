export const adminReducer = (state = null, action) => {
  switch (action.type) {
    case "GET_ALL_USERS":
      return {
        ...state,
        usersList: action.payload,
      };

    case "GET_ALL_PAYMENTS":
      return {
        ...state,
        paymentList: action.payload,
      };

    default:
      return state;
  }
};

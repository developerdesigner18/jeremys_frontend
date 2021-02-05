const followReducer = (state = null, action) => {
  switch (action.type) {
    case "GET_FOLLOWING":
      return {
        ...state,
        following: action.payload,
      };

    case "GET_FOLLOWERS":
      return {
        ...state,
        starFollowers: action.payload,
      };

    default:
      return state;
  }
};

export default followReducer;

export const orbReducer = (state = null, action) => {
  switch (action.type) {
    case "STORE_SCREENSHOT":
      return {
        ...state,
      };
    case "STORE_CHEF_ORB_DETAILS":
        return {
          ...state,
          response: action.payload,
        };
    case "FAN_GO_LIVE":
      return {
        ...state,
        goLiveStatus: action.payload,
      };

    default:
      return state;
  }
};

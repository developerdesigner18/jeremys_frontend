export const orbReducer = (state = null, action) => {
  switch (action.type) {
    case "STORE_SCREENSHOT":
      return {
        ...state,
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

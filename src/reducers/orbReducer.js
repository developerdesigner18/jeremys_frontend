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

    case "GET_STREAM_DETAILS":
      return {
        ...state,
        streamData: action.payload,
      };

    case "USER_TOKEN":
      return {
        ...state,
        userToken: action.payload,
      };

    case "STORE_RATE_REVIEW":
      return {
        ...state,
        storedReview: action.payload,
      };

    case "STORE_ONLINE_USER":
      return {
        ...state,
      };

    case "STORE_JOINED_FAN":
      return {
        ...state,
      };

    case "JOINED_FAN":
      return {
        ...state,
        joinedFanList: action.payload,
      };

    case "REMOVE_USER":
      return {
        ...state,
      };

    case "REMOVE_FAN":
      return {
        ...state,
      };

    case "REMOVE_USER":
      return {
        ...state,
      };

    case "GET_ONLINE_USERS":
      return {
        ...state,
        onlineUsers: action.payload,
      };

    case "CHECK_ONLNIE_USER":
      return {
        ...state,
        checkOnlineUser: action.payload,
      };

    case "DELETE_STREAM":
      return {
        ...state,
      };

    case "CHANGE_STATUS":
      return {
        ...state,
      };

    case "GET_USER_STATUS":
      return {
        ...state,
        userStatus: action.payload,
      };
    default:
      return state;
  }
};

const userReducer = (state = null, action) => {
  switch (action.type) {
    case "SIGN_UP":
      return {
        ...state,
        createdUser: action.payload,
      };

    case "SIGN_IN":
      return {
        ...state,
        userInfo: action.payload,
      };

    case "GET_USER":
      return {
        ...state,
        userDetail: action.payload,
      };

    case "UPDATE_PROFILE":
      return {
        ...state,
      };

    case "FORGOT_PASSWORD":
      return {
        ...state,
      };

    case "RESET_PASSWORD":
      return {
        ...state,
      };

    case "LOGOUT":
      return {
        ...state,
      };

    case "USER_INFO":
      return {
        ...state,
        userInfo: action.payload,
      };

    case "DEACTIVATE_USER":
      return {
        ...state,
      };

    case "STORE_CONTACT_US":
      return {
        ...state,
      };
    case "GET_ALL_FANS":
      return {
        ...state,
        fans: action.payload,
      };
    case "GET_ALL_ARTISTS":
      return {
        ...state,
        artists: action.payload,
      };
    case "GET_FROM_COMMUNITY_ERROR":
      return {
        ...state,
        communityError: action.payload,
      };
    case "GET_ALL_FOLLOWER":
      return {
        ...state,
        followers: action.payload,
      };

    case "HIDE_THE_STORY":
      return {
        ...state,
        updatedValue: action.payload,
      };

    case "GET_REVIEW_FAN":
      return {
        ...state,
        reviewOfFan: action.payload,
      };
    case "GET_REVIEW_ARTIST":
      return {
        ...state,
        reviewOfArtist: action.payload,
      };
    case "HIDE_REVIEW":
      return {
        ...state,
      };

    case "GET_FROM_COMMUNITY_SUCCESS":
      return {
        ...state,
        community: action.payload,
      };
    case "ADD_TO_COMMUNITY_SUCCESS":
    case "ADD_TO_COMMUNITY_ERROR":
    case "REMOVE_FROM_COMMUNITY_SUCCESS":
    case "REMOVE_FROM_COMMUNITY_ERROR":
      return {
        ...state,
        addcommunity: action.payload,
      };

    case "FAN_LIST":
      return {
        ...state,
        fanList: action.payload,
      };

    case "CHECK_IN_COMMUNITY":
      return {
        ...state,
        checkInCommunityUser: action.payload,
      };

    default:
      return state;
  }
};

export default userReducer;

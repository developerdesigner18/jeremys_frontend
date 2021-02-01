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
    default:
      return state;
  }
};

export default userReducer;

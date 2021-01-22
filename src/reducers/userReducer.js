const userReducer = (state = null, action) => {
  switch (action.type) {
    case "SIGN_UP":
      return {
        ...state,
        createdUser: action.payload,
      }

    case "SIGN_IN":
      return {
        ...state,
        userInfo: action.payload,
      }

    case "GET_USER":
      return {
        ...state,
        userDetail: action.payload,
      }

    case "UPDATE_PROFILE":
      return {
        ...state,
      }

    case "FORGOT_PASSWORD":
      return {
        ...state,
      }

    case "RESET_PASSWORD":
      return {
        ...state,
      }

    case "LOGOUT":
      return {
        ...state,
      }

    case "USER_INFO":
      return {
        ...state,
        userInfo: action.payload,
      }

    case "DEACTIVATE_USER":
      return {
        ...state,
      }

    default:
      return state
  }
}

export default userReducer

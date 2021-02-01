import { combineReducers } from "redux";
import { orbReducer } from "./orbReducer";
import userReducer from "./userReducer";

export default combineReducers({
  user: userReducer,
  ORB: orbReducer,
});

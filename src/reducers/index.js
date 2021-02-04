import { combineReducers } from "redux";
import { orbReducer } from "./orbReducer";
import userReducer from "./userReducer";
import followReducer from "./followReducer";

export default combineReducers({
  user: userReducer,
  ORB: orbReducer,
  follow: followReducer,
});

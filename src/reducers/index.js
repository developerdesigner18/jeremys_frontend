import {combineReducers} from "redux";
import {orbReducer} from "./orbReducer";
import userReducer from "./userReducer";
import followReducer from "./followReducer";
import paymentReducer from "./paymentReducer";

export default combineReducers({
  user: userReducer,
  ORB: orbReducer,
  follow: followReducer,
  payment: paymentReducer,
});

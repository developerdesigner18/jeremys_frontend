import {combineReducers} from "redux";
import {orbReducer} from "./orbReducer";
import userReducer from "./userReducer";
import followReducer from "./followReducer";
import paymentReducer from "./paymentReducer";
import {adminReducer} from "./adminReducer";

export default combineReducers({
  user: userReducer,
  ORB: orbReducer,
  follow: followReducer,
  payment: paymentReducer,
  admin: adminReducer,
});

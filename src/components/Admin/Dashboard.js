import React, { useState, useEffect } from "react";
import {
  Search,
  ViewColumn,
  SaveAlt,
  Remove,
  LastPage,
  FilterList,
  FirstPage,
  Edit,
  DeleteOutline,
  Clear,
  ChevronRight,
  Check,
  ArrowDownward,
  AddBox,
  AppsTwoTone,
  ArrowBackIosTwoTone,
  CategoryTwoTone,
  ChevronLeft,
  ClassTwoTone,
  ExitToAppTwoTone,
  HomeTwoTone,
  SettingsApplicationsTwoTone,
  ArrowForwardIosTwoTone,
} from "@material-ui/icons";
import { Route, Switch, useHistory } from "react-router";
import { BrowserRouter, Link } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Box,
  Typography,
  Icon,
} from "@material-ui/core";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import "../../assets/css/adminSidebar.css";
import { getPaymentForAdmin } from "../../actions/adminAction";
import { useDispatch, useSelector } from "react-redux";
import { getUsersForAdmin } from "../../actions/adminAction";
import Admin from "./Admin";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

function PaymentManagement() {
  const [paymentData, setPaymentData] = useState([]);

  const dispatch = useDispatch();
  const adminState = useSelector((state) => state.admin);

  useEffect(async () => {
    await dispatch(getPaymentForAdmin());
  }, []);

  useEffect(() => {
    if (adminState) {
      if (adminState.paymentList) {
        console.log("adminState.paymentList", adminState.paymentList);
        setPaymentData(adminState.paymentList);
      }
    }
  }, [adminState]);

  return (
    <div>
      <Admin />
      <main>
        <div className="container">
          <Box display="flex" height={500}>
            <Box
              m="auto"
              border={1}
              height={150}
              width={300}
              // bgcolor="white"
              // style={{cursor: "pointer"}}
              // onClick={goToUser}
            >
              <Link to="/admin/user">
                <div style={{ textAlign: "center", paddingTop: "10px" }}>
                  <i className="fas fa-users fa-7x"></i>
                  <p style={{ color: "white" }}>Users</p>
                </div>
              </Link>
            </Box>
            <Box
              m="auto"
              border={1}
              height={150}
              width={300}
              // bgcolor="white"
              // onClick={goToPayment}
              // style={{ cursor: "pointer" }}
            >
              <Link to="/admin/payment">
                <div style={{ textAlign: "center", paddingTop: "10px" }}>
                  <i className="fas fa-money-check-alt fa-7x"></i>
                  <p style={{ color: "white" }}>Payments</p>
                </div>
              </Link>
            </Box>
          </Box>
        </div>
      </main>{" "}
    </div>
  );
}

export default PaymentManagement;

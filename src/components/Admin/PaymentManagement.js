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
import MaterialTable from "material-table";
import { forwardRef } from "react";
import "../../assets/css/adminSidebar.css";
import { getPaymentForAdmin } from "../../actions/adminAction";
import { useDispatch, useSelector } from "react-redux";
import { getUsersForAdmin } from "../../actions/adminAction";
import Admin from "./Admin";
import { JsonToCsv, useJsonToCsv } from "react-json-csv";
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
  const { saveAsCsv } = useJsonToCsv();
  const dispatch = useDispatch();
  const adminState = useSelector((state) => state.admin);

  useEffect(async () => {
    await dispatch(getPaymentForAdmin());
  }, []);

  useEffect(() => {
    if (adminState) {
      if (adminState.paymentList) {
        // console.log("adminState.paymentList", adminState.paymentList);
        setPaymentData(adminState.paymentList);
      }
    }
  }, [adminState]);

  return (
    <div>
      <Admin />
      <main>
        <div className="container">
          <MaterialTable
            icons={tableIcons}
            title="Payment Details"
            columns={[
              {
                title: "Profile Image",
                field: "userId.profileImgURl",
                render: (rowData) => (
                  <img
                    src={rowData.userId.profileImgURl}
                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://jeremysLive.com:8000/default/profile.jpg";
                    }}
                  />
                ),
              },
              { title: "First Name", field: "userId.firstName" },
              { title: "Last Name", field: "userId.lastName" },
              {
                title: "Type",
                field: "userId.type",
              },
              { title: "Total Price", field: "totalPrice" },
              { title: "Total Tip", field: "tips" },
              { title: "Received Amount", field: "receivedAmount" },
              {
                title: "User's paypal email",
                field: "userId.paypalEmail",
                defaultGroupOrder: 0,
              },
            ]}
            data={paymentData}
            options={{
              exportButton: true,
              exportAllData: true,
              pageSizeOptions: [5, 10, 20, paymentData.length],
              exportCsv: (columns, data) => {
                // console;
                console.log("data-=-=-=", data);
                data.map((row) => {
                  let csvData = [];
                  row.data.map((rowData) => {
                    csvData.push({
                      profileImgURl: rowData.userId.profileImgURl,
                      userId: rowData.userId._id,
                      firstName: rowData.userId.firstName,
                      lastName: rowData.userId.lastName,
                      type: rowData.userId.type,
                      totalPrice: rowData.totalPrice,
                      tips: rowData.tips,
                      receivedAmount: rowData.receivedAmount,
                      paypalEmail: rowData.userId.paypalEmail,
                    });
                  });
                  console.log("csvData", csvData);
                  let fields = {
                    profileImgURl: "Profile Image",
                    userId: "userId",
                    firstName: "First Name",
                    lastName: "Last Name",
                    type: "Type",
                    totalPrice: "Total Price",
                    tips: "Tips",
                    receivedAmount: "Received Amount",
                    paypalEmail: "User's paypal email",
                  };

                  let filename =
                    row.data[0].userId.firstName +
                    " " +
                    row.data[0].userId.lastName;
                  saveAsCsv({ data: csvData, fields, filename });
                });
              },
              grouping: true,
              emptyRowsWhenPaging: false,
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default PaymentManagement;

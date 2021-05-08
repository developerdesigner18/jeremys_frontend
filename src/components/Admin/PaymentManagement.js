import React, {useState, useEffect} from "react";
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
import {forwardRef} from "react";
import "../../assets/css/adminSidebar.css";
import {getPaymentForAdmin} from "../../actions/adminAction";
import {useDispatch, useSelector} from "react-redux";
import {getUsersForAdmin} from "../../actions/adminAction";

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
  const adminState = useSelector(state => state.admin);

  useEffect(async () => {
    await dispatch(getPaymentForAdmin());
  }, []);

  useEffect(() => {
    if (adminState) {
      if (adminState.paymentList) {
        console.log("adminState.paymentList", adminState.paymentList.length);
        setPaymentData(adminState.paymentList);
      }
    }
  }, [adminState]);

  return (
    <div className="container">
      <MaterialTable
        icons={tableIcons}
        title="Payment Details"
        columns={[
          {
            title: "Profile Image",
            field: "userId.profileImage",
            render: rowData => (
              <img
                src={rowData.userId.profileImgURl}
                style={{width: 40, height: 40, borderRadius: "50%"}}
              />
            ),
          },
          {title: "First Name", field: "userId.firstName"},
          {title: "Last Name", field: "userId.lastName"},
          {
            title: "Type",
            field: "userId.type",
          },
          {title: "Total Price", field: "totalPrice"},
          {title: "Total Tip", field: "tips"},
          {title: "Received Amount", field: "receivedAmount"},
          {title: "User's paypal email", field: "userId.paypalEmail"},
        ]}
        data={paymentData}
        options={{
          exportButton: true,
        }}
      />
    </div>
  );
}

export default PaymentManagement;

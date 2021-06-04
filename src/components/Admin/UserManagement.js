import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { getUsersForAdmin } from "../../actions/adminAction";
import "../../assets/css/adminSidebar.css";
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

function UserManagement() {
  const [usersData, setUsersData] = useState([]);

  const dispatch = useDispatch();
  const adminState = useSelector((state) => state.admin);

  useEffect(async () => {
    await dispatch(getUsersForAdmin());
  }, []);

  useEffect(() => {
    if (adminState) {
      if (adminState.usersList) {
        console.log("adminState.usersList", adminState.usersList.length);
        setUsersData(adminState.usersList);
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
            title="Users"
            columns={[
              {
                title: "Profile Image",
                field: "profileImgURl",
                render: (rowData) => (
                  <img
                    src={rowData.profileImgURl}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://jeremysLive.com:8000/default/profile.jpg";
                    }}
                  />
                ),
              },
              { title: "First Name", field: "firstName" },
              { title: "Last Name", field: "lastName" },
              {
                title: "Type",
                field: "type",
              },
              // {field: "_id"},
            ]}
            data={usersData}
          />
        </div>
      </main>{" "}
      {/* <div className="container">
        <MaterialTable
          icons={tableIcons}
          title="Users"
          columns={[
            { title: "First Name", field: "firstName" },
            { title: "Last Name", field: "lastName" },
            {
              title: "Type",
              field: "type",
            },
            { title: "Profile Image", field: "profileImage" },
          ]}
          data={[
            {
              name: "Mehmet",
              surname: "Baran",
              birthYear: 1987,
              birthCity: 63,
            },
            {
              name: "Zerya Betül",
              surname: "Baran",
              birthYear: 2017,
              birthCity: 34,
            },
          ]}
          options={{
            sorting: true,
            exportButton: true,
          }}
        />
      </div>
     */}
    </div>
  );
}

export default UserManagement;

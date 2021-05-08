import React, {useState, useRef, useEffect} from "react";
import "../../assets/css/adminSidebar.css";
import {Route, Switch, useHistory} from "react-router";
import {BrowserRouter, Link} from "react-router-dom";
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
import {
  AppsTwoTone,
  ArrowBackIosTwoTone,
  ArrowForwardIosTwoTone,
  CategoryTwoTone,
  ClassTwoTone,
  ExitToAppTwoTone,
  HomeTwoTone,
  SettingsApplicationsTwoTone,
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
  ChevronLeft,
  GroupIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import PaymentManagement from "./PaymentManagement";
import UserManagement from "./UserManagement";
import MaterialTable from "material-table";
import {forwardRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUsersForAdmin} from "../../actions/adminAction";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "block",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerOpen: {
    width: drawerWidth,
    background: "black",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    padding: 8,
    paddingTop: 150,
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    background: "black",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
    padding: 8,
    paddingTop: 150,
  },
}));

function Admin() {
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);

  const dispatch = useDispatch();
  const adminState = useSelector(state => state.admin);

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

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const history = useHistory();

  const ref = useRef();

  const menuClass = `dropdown-menu dropdown-menu-right${isOpen ? " show" : ""}`;

  const toggleValue = () => {
    console.log("fn click");
    setIsOpen(!isOpen);
  };
  //   if (isOpen) {
  //     window.addEventListener("click", function (e) {
  //       if (isOpen) {
  //         setIsOpen(false);
  //       }
  //     });
  //   }

  const callLogout = () => {
    localStorage.clear();
    history.push("/");
  };

  const goToUser = () => {
    history.push("/admin/user");
  };

  const goToPayment = () => {
    history.push("/admin/payment");
  };

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    // Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  };

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}>
          <div onMouseEnter={handleDrawerOpen} onMouseLeave={handleDrawerClose}>
            <List>
              {open == true ? (
                <>
                  <ListItem button>
                    <ListItemIcon style={{color: "white"}}>
                      <ArrowForwardIosTwoTone />
                    </ListItemIcon>
                  </ListItem>
                </>
              ) : (
                <>
                  <ListItem button>
                    <ListItemIcon style={{color: "white"}}>
                      <ArrowBackIosTwoTone />
                    </ListItemIcon>
                  </ListItem>
                </>
              )}
              <Link to="/admin/user">
                <ListItem button key="UserManagement">
                  <ListItemIcon style={{color: "white"}}>
                    <AppsTwoTone />
                  </ListItemIcon>
                  <ListItemText
                    style={{color: "white"}}
                    primary="User Management"
                  />
                </ListItem>
              </Link>

              <Link to="/admin/payment">
                <ListItem button key="PaymentManagement">
                  <ListItemIcon style={{color: "white"}}>
                    <ClassTwoTone />
                  </ListItemIcon>
                  <ListItemText
                    style={{color: "white"}}
                    primary="Payment Management"
                  />
                </ListItem>
              </Link>
            </List>
          </div>
        </Drawer>

        <main>
          <div className="form_container px-3 px-md-5">
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <a
                    className="dropdown-toggle"
                    data-widget="control-sidebar"
                    data-slide="true"
                    role="button"
                    style={{color: "white"}}
                    data-toggle="dropdown"
                    id="dropdownMenuButton"
                    onClick={toggleValue}>
                    <span style={{position: "relative"}} ref={ref}>
                      {"welcome " +
                        localStorage.getItem("name")[0].toUpperCase() +
                        localStorage.getItem("name").slice(1) +
                        "!"}
                    </span>
                  </a>
                </li>
              </ul>

              <div className={menuClass} aria-labelledby="dropdownMenuButton">
                <ul>
                  <li
                    className="dropdown-item menu text-align-center p-0"
                    onClick={callLogout}
                    style={{paddingTop: "5px"}}>
                    <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
                    Log Out
                  </li>
                  {/* <li className="dropdown-item menu">Link 3</li> */}
                </ul>
              </div>
            </nav>

            {window.location.pathname === "/admin/" ||
            window.location.pathname === "/admin" ? (
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
                  <div style={{textAlign: "center", paddingTop: "10px"}}>
                    <i className="fas fa-users fa-7x"></i>
                    <p style={{color: "white"}}>Users</p>
                  </div>
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
                  <div style={{textAlign: "center", paddingTop: "10px"}}>
                    <i className="fas fa-money-check-alt fa-7x"></i>
                    <p style={{color: "white"}}>Payments</p>
                  </div>
                </Box>
              </Box>
            ) : null}

            <Switch>
              <Route exact path="/admin/user">
                <div className="container">
                  <MaterialTable
                    icons={tableIcons}
                    title="Users"
                    columns={[
                      {
                        title: "Profile Image",
                        field: "profileImgURl",
                        render: rowData => (
                          <img
                            src={rowData.profileImgURl}
                            style={{width: 40, height: 40, borderRadius: "50%"}}
                          />
                        ),
                      },
                      {title: "First Name", field: "firstName"},
                      {title: "Last Name", field: "lastName"},
                      {
                        title: "Type",
                        field: "type",
                      },
                      // {field: "_id"},
                    ]}
                    data={usersData}
                  />
                </div>
              </Route>
              <Route exact path="/admin/payment">
                <PaymentManagement />
              </Route>
            </Switch>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default Admin;

import React, {Component} from "react";
import {BrowserRouter, Route, Redirect} from "react-router-dom";
import ArtistsProfile from "./components/artistsProfile/artistsProfile";
import CustomerService from "./components/CustomerService";
import fanHomePage from "./components/fanHomePage/fanHomePage";
import ForgotPassword from "./components/ForgotPassword";
import HomePage from "./components/HomePage";
import Login from "./components/login/Login";
import SingleUserORBPage from "./components/ORB/SingleUserORBPage";
import ORBPage from "./components/ORB/ORBPage";
import ChefORBPage from "./components/ORB/ChefORBPage";
import Calendar from "./components/passport/CalendarShow";
import UserProfile from "./components/profile/UserProfile";
import Register from "./components/register/Register";
import ResetPassword from "./components/Reset";
import TermsCondition from "./components/TermsCondition";
import UserCategoryHomePage from "./components/userCategoryHome/UserCategoryHomePage";
import VideoChat from "./components/videoCall/videoCallHost";
import VideoChatAttendee from "./components/videoCall/videoCallAttendee";
import {isAuthenticate} from "./utill";
import MyStory from "./components/placeholder/myStory";
import FanChefORB from "./components/ORB/fanChefORBPage";
import FanOrbForUser from "./components/ORB/FanOrbForUser";
import VideoCallBasicCall from "./components/videoCall/VideoCallBasicCall";
import VideoCallBasicCall1 from "./components/videoCall/VideoCallBasicCall1";
import VideoCall1 from "./components/videoCall/videoCallHost copy";
import Privacy from "./components/Privacy";
import ORBPageOLD from "./components/ORB/ORBPageOld";
import TrainerORBPage from "./components/ORB/TrainerORBPage";
import Admin from "./components/Admin/Admin";
import UserManagement from "./components/Admin/UserManagement";
import PaymentManagement from "./components/Admin/PaymentManagement";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Route
          exact
          path="/"
          render={() =>
            localStorage.getItem("id") ? (
              localStorage.getItem("type") == "fan" ||
              localStorage.getItem("type") == "Fan" ? (
                <Redirect to="/fanHomePage" />
              ) : localStorage.getItem("type") == "admin" ||
                localStorage.getItem("type") == "Admin" ? (
                <Redirect to="/admin" />
              ) : (
                <Redirect to="/userHomepage" />
              )
            ) : (
              <Redirect to="/home" />
            )
          }
        />
        <Route path="/home" component={HomePage} />
        {/* <PrivateRoute path="/ticket" component={Ticket} /> */}

        <PublicRoute path="/login" component={Login} />
        <PublicRoute path="/register" component={Register} />
        <Route path="/termsCondition" component={TermsCondition} />
        <PublicRoute path="/forgotPassword" component={ForgotPassword} />
        <PublicRoute path="/resetPassword" component={ResetPassword} />
        <PrivateRoute path="/profile" component={UserProfile} />
        <PrivateRoute path="/fanHomePage" component={fanHomePage} />
        {/* <Route
          path="/fanHomePage"
          exact
          component={(props) => <FanHomePage socket={socket} />}
        /> */}
        <PrivateRoute path="/userHomepage" component={UserCategoryHomePage} />
        <PrivateRoute path="/customerService" component={CustomerService} />
        <PrivateRoute path="/ORBpage" component={ORBPage} />
        <PrivateRoute path="/trainerORBpage" component={TrainerORBPage} />
        <PrivateRoute path="/ORBpageOLD" component={ORBPageOLD} />
        <PrivateRoute path="/fanORB" component={SingleUserORBPage} />
        <PrivateRoute path="/chefORB" component={ChefORBPage} />
        <PrivateRoute path="/fanChefORB" component={FanChefORB} />
        <PrivateRoute path="/fanStylistORB" component={FanChefORB} />
        <PrivateRoute path="/stylistORB" component={ChefORBPage} />
        <PrivateRoute path="/artistProfile" component={ArtistsProfile} />
        <PrivateRoute path="/videoChatHost" component={VideoChat} />
        <PrivateRoute path="/videoCallBasic" component={VideoCall1} />
        <PrivateRoute path="/videoChatAttendee" component={VideoChatAttendee} />
        <PrivateRoute path="/userORB" component={FanOrbForUser} />

        <Route exact path="/myCalendar" component={Calendar} />
        <Route path="/one-to-one" component={VideoCallBasicCall} />
        <Route path="/one-to-one-1" component={VideoCallBasicCall1} />
        <Route path="/privacy-policy" component={Privacy} />
        <PrivateRoute path="/myStory" component={MyStory} />

        {/*============ admin route ========================*/}
        <AdminRoute path="/admin" component={Admin} />
        <AdminRoute path="/admin/user" component={UserManagement} />
        <AdminRoute path="/admin/payment" component={PaymentManagement} />
      </BrowserRouter>
    </div>
  );

  function PrivateRoute({component: Component, ...rest}) {
    return (
      <Route
        {...rest}
        render={props =>
          localStorage.getItem("id") ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function PublicRoute({component, ...rest}) {
    return (
      <Route
        {...rest}
        render={props =>
          !localStorage.getItem("id") ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }

  function AdminRoute({component, ...rest}) {
    return (
      <Route
        {...rest}
        render={props =>
          localStorage.getItem("type") == "Admin" ||
          localStorage.getItem("type") == "admin" ? (
            React.createElement(component, props)
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  }
}

export default App;

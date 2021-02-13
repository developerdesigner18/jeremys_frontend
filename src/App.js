import React, { Component } from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
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
import UserProfileCopy from "./components/profile/UserProfile copy";
import Register from "./components/register/Register";
import ResetPassword from "./components/Reset";
import TermsCondition from "./components/TermsCondition";
import UserCategoryHomePage from "./components/userCategoryHome/UserCategoryHomePage";
import { isAuthenticate } from "./utill";
import DemoWithVonage from "./components/ORB/DemoWithVonage";

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
              ) : (
                <Redirect to="/userHomepage" />
              )
            ) : (
              <Redirect to="/home" />
            )
          }
        />
        <Route path="/home" component={HomePage} />
        <PublicRoute path="/login" component={Login} />
        <PublicRoute path="/register" component={Register} />
        <Route path="/termsCondition" component={TermsCondition} />
        <PublicRoute path="/forgotPassword" component={ForgotPassword} />
        <PublicRoute path="/resetPassword" component={ResetPassword} />
        <PrivateRoute path="/profile" component={UserProfile} />
        <PrivateRoute path="/fanHomePage" component={fanHomePage} />
        <PrivateRoute path="/userHomepage" component={UserCategoryHomePage} />
        <PrivateRoute path="/customerService" component={CustomerService} />
        <PrivateRoute path="/ORBpage" component={ORBPage} />
        <PrivateRoute path="/fanORB" component={SingleUserORBPage} />
        <PrivateRoute path="/chefORB" component={ChefORBPage} />
        <PrivateRoute path="/stylistORB" component={ChefORBPage} />
        <PrivateRoute path="/artistProfile" component={ArtistsProfile} />
        <Route exact path="/demoWithVonage" component={DemoWithVonage} />

        <Route exact path="/myCalendar" component={Calendar} />
      </BrowserRouter>
    </div>
  );

  function PrivateRoute({ component: Component, ...rest }) {
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

  function PublicRoute({ component, ...rest }) {
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
}

export default App;

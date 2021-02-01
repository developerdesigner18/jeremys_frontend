import { BrowserRouter, Route } from "react-router-dom";
import ArtistsProfile from "./components/artistsProfile/artistsProfile";
import CustomerService from "./components/CustomerService";
import fanHomePage from "./components/fanHomePage/fanHomePage";
import ForgotPassword from "./components/ForgotPassword";
import HomePage from "./components/HomePage";
import Login from "./components/login/Login";
import FanORBPage from "./components/ORB/FanORBPage";
import ORBPage from "./components/ORB/ORBPage";
import Calendar from "./components/passport/CalendarShow";
import UserProfile from "./components/profile/UserProfile";
import UserProfileCopy from "./components/profile/UserProfile copy";
import Register from "./components/register/Register";
import ResetPassword from "./components/Reset";
import TermsCondition from "./components/TermsCondition";
import UserCategoryHomePage from "./components/userCategoryHome/UserCategoryHomePage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profile" component={UserProfile} />
        <Route exact path="/profile1" component={UserProfileCopy} />
        <Route exact path="/fanHomePage" component={fanHomePage} />
        <Route exact path="/forgotPassword" component={ForgotPassword} />
        <Route exact path="/resetPassword" component={ResetPassword} />
        <Route exact path="/artistProfile" component={ArtistsProfile} />
        <Route exact path="/userHomepage" component={UserCategoryHomePage} />
        <Route exact path="/termsCondition" component={TermsCondition} />
        <Route exact path="/customerService" component={CustomerService} />
        <Route exact path="/ORBpage" component={ORBPage} />
        <Route exact path="/fanORB" component={FanORBPage} />
        <Route exact path="/myCalendar" component={Calendar} />
      </BrowserRouter>
    </div>
  );
}

export default App;

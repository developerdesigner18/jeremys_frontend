import { BrowserRouter, Route } from 'react-router-dom';
import fanHomePage from './components/fanHomePage/fanHomePage';
import ForgotPassword from './components/ForgotPassword';
import HomePage from './components/HomePage';
import Login from './components/login/Login';
import UserProfile from './components/profile/UserProfile';
import UserProfileCopy from './components/profile/UserProfile copy';
import Register from './components/register/Register';
import ResetPassword from './components/Reset';

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
      </BrowserRouter>
    </div>
  );
}

export default App;

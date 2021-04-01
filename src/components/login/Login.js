import React, {useState} from "react";
import "../../assets/css/signin.css";
import {useHistory} from "react-router-dom";
import {login} from "../../actions/userActions";
import {useDispatch} from "react-redux";
import Header from "../header/Header";
import swal from "sweetalert";

function Login(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const goToRegister = () => {
    history.push("/register");
  };

  const callLogin = async e => {
    e.preventDefault();

    if (email && password) {
      const dataToPass = {
        email,
        password,
        remember,
      };

      await dispatch(login(dataToPass, props));
    } else {
      swal("!Oops", "Field cannot be blank", "error");
    }
  };

  const callForgotPassword = () => {
    history.push("/forgotPassword");
  };

  return (
    <div style={{background: "black"}}>
      <Header />
      <div className="container">
        <form method="post" onSubmit={e => callLogin(e)}>
          <div className="login_form_container p-3 p-md-5 mt-5">
            <div className="form_detail">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="form_detail">
              <label>PASSWORD</label>
              <input
                type="password"
                name="password"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="forgot_pass">
              <a style={{cursor: "pointer"}} onClick={callForgotPassword}>
                <span>forgot password</span>
              </a>
            </div>
            <div className="remember">
              <input
                type="checkbox"
                name=""
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              <label>Remember me</label>
            </div>
            <div className="login">
              <button>Login</button>
            </div>
            <div className="text-center newbie">
              Just Joining Us?{" "}
              <a onClick={goToRegister} style={{cursor: "pointer"}}>
                Sign Up
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

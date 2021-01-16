import React from "react";
import { useHistory } from "react-router-dom";

function Header() {
  const history = useHistory();
  const goToRegister = () => {
    history.push("/register");
  };

  const goToLogin = () => {
    history.push("/login");
  };
  const goToHome = () => {
    history.push("/");
  };
  return (
    <div className="container p-3 p-md-3 ">
      <header>
        {window.location.pathname ==
        "/fanHomePage" ? null : localStorage.getItem("token") ? (
          "welcome " + localStorage.getItem("name")
        ) : (
          <div>
            <div className="d-flex align-items-center hader_top">
              <a
                className="login"
                onClick={goToLogin}
                style={{ cursor: "pointer" }}
              >
                Login
              </a>
              <a
                className="login"
                onClick={goToRegister}
                style={{ cursor: "pointer" }}
              >
                Register
              </a>
            </div>
            <div>
              <a onClick={goToRegister} style={{ cursor: "pointer" }}>
                sign up for FREE
              </a>
            </div>
          </div>
        )}
      </header>
      <div className="main_sec">
        <div className="links left_links">
          <ul>
            <li>
              <a href="#">stars</a>
            </li>
            <li>
              <a href="#">chef</a>
            </li>
            <li>
              <a href="#">style</a>
            </li>
            <li>
              <a href="#">trainer</a>
            </li>
          </ul>
        </div>
        <div className="logo">
          <img
            src={`../assets/images/logo.png`}
            onClick={goToHome}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="links right_links">
          <ul>
            <li>
              <a href="#">fans</a>
            </li>
            <li>
              <a href="#">food</a>
            </li>
            <li>
              <a href="#">shopping</a>
            </li>
            <li>
              <a href="#">athlete</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="hero_text text-center mb-4">
        "Go live! and lets make our Earth a better place"
      </div>
    </div>
  );
}

export default Header;

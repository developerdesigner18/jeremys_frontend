import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import "../../assets/css/homepage.css";
import { getUser, logout } from "../../actions/userActions";
import { useSelector, useDispatch } from "react-redux";
import { storeFanStatus } from "../../actions/orbActions";

const useOutsideClick = (ref, callback) => {
  const handleClick = e => {
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

function Header(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const stateData = useSelector(state => state.user);
  const ref = useRef();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(async () => {
    if (localStorage.getItem("token")) await dispatch(getUser());
  }, []);

  const menuClass = `dropdown-menu dropdown-menu-right${isOpen ? " show" : ""}`;

  const goToRegister = () => {
    history.push("/register");
  };

  const goToLogin = () => {
    history.push("/login");
  };
  const goToHome = () => {
    if (localStorage.getItem("type")) {
      if (
        localStorage.getItem("type") === "Fan" ||
        localStorage.getItem("type") === "fan"
      ) {
        history.push("/fanHomePage");
      } else {
        history.push("/userHomepage");
      }
    } else {
      history.push("/");
    }
  };

  const toggleValue = () => {
    setIsOpen(!isOpen);
  };
  useOutsideClick(ref, () => {
    setIsOpen(false);
  });

  const callLogout = async () => {
    localStorage.clear();
    history.push("/");
    // if (stateData && stateData.userDetail) {
    // const dataToPass = {
    //   userId: stateData.userDetail.data._id,
    // };
    // await dispatch(logout(dataToPass));
    // }
  };

  const goToProfile = () => {
    history.push("/profile");
  };

  const goToContactUs = () => {
    history.push("/customerService");
  };

  const changeStatus = async () => {
    // await dispatch(storeFanStatus(true));
  };

  return (
    <div className="container p-3 p-md-3 cust_home_page">
      <header>
        {localStorage.getItem("token") ? (
          <span style={{ position: "relative" }} ref={ref}>
            <i className="fa fa-user mx-2" aria-hidden="true"></i>
            {"welcome " +
              localStorage.getItem("name")[0].toUpperCase() +
              localStorage.getItem("name").slice(1) +
              "!"}
          </span>
        ) : (
          <div>
            <div className="d-flex align-items-center hader_top">
              <a
                className="login"
                onClick={goToLogin}
                style={{ cursor: "pointer" }}>
                Login
              </a>
              <a
                className="login"
                onClick={goToRegister}
                style={{ cursor: "pointer" }}>
                Register
              </a>
            </div>
            <div>
              <a onClick={goToRegister} style={{ cursor: "pointer" }}>
                sign up - It's FREE!
              </a>
            </div>
          </div>
        )}
      </header>
      <div className="main_sec custom_main_sec">
        <div className="logo">
          <img
            src={`../assets/images/logo_without_live.png`}
            onClick={goToHome}
            style={{
              cursor: "pointer",
            }}
          />
          {localStorage.getItem("type") === "Fan" ||
          localStorage.getItem("type") === "fan" ? (
            <p
              className="go_live mt-1 mb-0"
              style={{ cursor: "pointer" }}
              onClick={changeStatus}>
              Go Live!
            </p>
          ) : (
            <p className="go_live mt-1 mb-0">Go Live!</p>
          )}
        </div>
      </div>
      <div className="hero_text text-center mb-4"></div>
    </div>
  );
}

export default Header;

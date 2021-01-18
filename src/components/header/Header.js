import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import '../../assets/css/homepage.css';
import { getUser } from '../../actions/userActions';
import { useSelector, useDispatch } from 'react-redux';

function Header(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const stateData = useSelector(state => state.user);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(async () => {
    if (localStorage.getItem('token')) await dispatch(getUser());
  }, []);

  const goToRegister = () => {
    history.push('/register');
  };

  const goToLogin = () => {
    history.push('/login');
  };
  const goToHome = () => {
    history.push('/');
  };

  const toggleValue = () => {
    setIsOpen(!isOpen);
  };

  const menuClass = `dropdown-menu dropdown-menu-right${isOpen ? ' show' : ''}`;

  const callLogout = () => {
    localStorage.clear();
    history.push('/');
  };

  return (
    <div className="container p-3 p-md-3 cust_home_page">
      <header>
        {window.location.pathname ==
        '/fanHomePage' ? null : localStorage.getItem('token') ? (
          <>
            <span
              style={{ cursor: 'pointer' }}
              className="dropdown-toggle"
              data-toggle="dropdown"
              id="dropdownMenuButton"
              onClick={toggleValue}>
              {'welcome ' + localStorage.getItem('name')}
            </span>
            <span style={{ cursor: 'pointer' }} onClick={callLogout}>
              <i className="fas fa-sign-out-alt" /> Logout
            </span>
          </>
        ) : (
          <div>
            <div className="d-flex align-items-center hader_top">
              <a
                className="login"
                onClick={goToLogin}
                style={{ cursor: 'pointer' }}>
                Login
              </a>
              <a
                className="login"
                onClick={goToRegister}
                style={{ cursor: 'pointer' }}>
                Register
              </a>
            </div>
            <div>
              <a onClick={goToRegister} style={{ cursor: 'pointer' }}>
                sign up for FREE
              </a>
            </div>
          </div>
        )}
      </header>
      <div className="main_sec custom_main_sec">
        {window.location.pathname === 'login' ||
        window.location.pathname === 'register' ||
        window.location.pathname === '/' ||
        (stateData && stateData.userDetail) ? (
          stateData.userDetail.data.type === 'fan' ||
          stateData.userDetail.data.type === 'Fan' ? (
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
          ) : null
        ) : null}
        {/* <div className="links left_links">
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
        </div> */}
        <div className="logo">
          <img
            src={`../assets/images/logo.png`}
            onClick={goToHome}
            style={{ cursor: 'pointer' }}
          />
        </div>
        {window.location.pathname === 'login' ||
        window.location.pathname === 'register' ||
        window.location.pathname === '/' ||
        (stateData && stateData.userDetail) ? (
          stateData.userDetail.data.type === 'fan' ||
          stateData.userDetail.data.type === 'Fan' ? (
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
          ) : null
        ) : null}
      </div>
      <div className="hero_text text-center mb-4"></div>
    </div>
  );
}

export default Header;

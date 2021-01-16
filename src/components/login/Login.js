import React, { useState } from 'react';
import '../../assets/css/signin.css';
import { useHistory } from 'react-router-dom';
import { login } from '../../actions/userActions';
import { useDispatch } from 'react-redux';

function Login(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const goToRegister = () => {
    history.push('/register');
  };

  const callLogin = async e => {
    e.preventDefault();

    if (email && password) {
      const dataToPass = {
        email,
        password,
      };

      await dispatch(login(dataToPass));
    }
  };

  return (
    <div className="container">
      <form method="post" onSubmit={e => callLogin(e)}>
        <div className="login_form_container p-3 p-md-5 mt-5">
          <div className="form_detail">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              required
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="form_detail">
            <label>PASSWORD</label>
            <input
              type="password"
              name="password"
              required
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="forgot_pass">
            <a>
              <span>forgot password</span>
            </a>
          </div>
          <div className="remember">
            <input type="checkbox" name="" />
            <label>Remember me</label>
          </div>
          <div className="login">
            <button>Login</button>
          </div>
          <div className="text-center newbie">
            are You a newbie?{' '}
            <a onClick={goToRegister} style={{ cursor: 'pointer' }}>
              Sign Up
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;

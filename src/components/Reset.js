import React, { useState } from 'react';
import '../assets/css/forgotPassword.css';
import Header from './header/Header';
import { resetPassword } from '../actions/userActions';
import { useDispatch } from 'react-redux';
import swal from 'sweetalert';

function ResetPassword(props) {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const callResetPassword = async e => {
    e.preventDefault();
    if (
      password === '' ||
      confirmPassword === ''
    ) {
      swal('!Oops', 'Field cannot be blank', 'error')
      return;
    }
    else if (password === confirmPassword) {
      setError('');
      const dataToPass = {
        token: props.location.search.split('=')[1],
        password: password,
      };

      await dispatch(resetPassword(dataToPass));
    } else {
      setError('Password and confirm password must be same!!');
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <form method="post" onSubmit={e => callResetPassword(e)}>
          <div className="forgot_form_container p-3 p-md-5 ">
            <div className="form_detail">
              <h3>Reset Password</h3>
              <label>New Password</label>
              <input
                type="password"
                name="password"
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="form_detail">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <small style={{ color: 'red' }}>{error}</small>
            </div>
            <div className="row mt-3">
              <div className="col-6 forgot_button">
                <button className="btn btn-default" type="submit">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;

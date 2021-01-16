import axios from 'axios';
import swal from 'sweetalert';

export const registration = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}auth/signup`, data)
      .then(result => {
        if (result.status === 200) {
          dispatch({
            type: 'SIGN_UP',
            payload: result.data,
          });
          swal('Info', 'Registration done successfully!', 'success').then(
            () => {
              window.location.replace('/profile');
              localStorage.setItem('token', result.data.authToken);
              localStorage.setItem('name', result.data.data.firstName);
            }
          );
          //   props.history.push('/profile', {
          //     name: result.data.data.firstName,
          //   });
        } else {
          swal('Error!', 'Somthing went wrong,Please try again!', 'error');
        }
      })
      .catch(err => console.log('error ', err));
  };
};

export const login = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}auth/signin`, data)
      .then(result => {
        if (result.status === 200) {
          dispatch({
            type: 'SIGN_IN',
            payload: result.data,
          });
          window.location.replace('/profile');
          localStorage.setItem('token', result.data.authToken);
          localStorage.setItem('name', result.data.data.firstName);
        } else {
          swal('Error!', 'Somthing went wrong,Please try again!', 'error');
        }
      })
      .catch(err => console.log('error ', err));
  };
};

export const getUser = () => {
  return dispatch => {
    axios
      .get(`${process.env.REACT_APP_API_URL}api/user/getUserData`, {
        headers: {
          token: localStorage.getItem('token'),
        },
      })
      .then(result => {
        if (result.status === 200) {
          dispatch({
            type: 'GET_USER',
            payload: result.data,
          });
        } else {
          console.log('error while retriving api ');
        }
      })
      .catch(error => console.log('error in get user api ', error));
  };
};

export const updateProfile = data => {
  return dispatch => {
    axios
      .post(`${process.env.REACT_APP_API_URL}api/user/updateProfile`, data, {
        headers: {
          token: localStorage.getItem('token'),
        },
      })
      .then(result => {
        if (result.status === 200) {
          dispatch({
            type: 'UPDATE_PROFILE',
            payload: result.data,
          });
          swal('Info', 'User updatetion done successfully!', 'success');
        }
      })
      .catch(err => console.log('error ', err));
  };
};

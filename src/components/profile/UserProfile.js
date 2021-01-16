import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function UserProfile(props) {
  const history = useHistory();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      axios
        .get('https://radiant-beach-45888.herokuapp.com/api/user/getUserData', {
          headers: {
            token: localStorage.getItem('token'),
          },
        })
        .then(result => {
          console.log('reslu', result);
          if (result.status === 201) {
            const {
              firstName,
              lastName,
              emailId,
              city,
              state,
              country,
              password,
              phoneNumber,
              profileImgURl,
              type,
            } = result.data.data;
            const {
              paymentType,
              cardNumber,
              cvv,
              expiryDate,
            } = result.data.paymentData;

            setUserInfo(prevState => ({
              ...prevState,
              firstName: firstName,
              lastName: lastName,
              email: emailId,
              city: city,
              state: state,
              password: password,
              mobileNumber: phoneNumber,
              country: country,
              showImage: profileImgURl,
              type: type,
              paymentType: paymentType,
              expiryDate: expiryDate,
              cvv: cvv,
              cardNumber: cardNumber,
            }));
          }
        })
        .catch(err => console.log('err ', err));
    }
  }, []);

  const [userInfo, setUserInfo] = useState({
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    confPass: '',
    country: '',
    city: '',
    mobileNumber: '',
    paymentType: '',
    expiryDate: '',
    state: '',
    preferredCarrier: '',
    cardNumber: '',
    image: '',
    showImage: '',
    type: '',
    cvv: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const imageChange = e => {
    setUserInfo(prevState => ({
      ...prevState,
      image: e.target.files[0],
      showImage: URL.createObjectURL(e.target.files[0]),
    }));
  };

  const callUpdate = e => {
    e.preventDefault();
    if (userInfo.image) {
      let fd = new FormData();
      fd.append('firstName', userInfo.firstName);
      fd.append('lastName', userInfo.lastName);
      fd.append('city', userInfo.city);
      fd.append('state', userInfo.state);
      fd.append('country', userInfo.country);
      fd.append('paymentType', userInfo.paymentType);
      fd.append('cardNumber', userInfo.cardNumber);
      fd.append('expiryDate', userInfo.expiryDate);
      fd.append('phoneNumber', userInfo.mobileNumber);
      fd.append('type', userInfo.type);
      fd.append('email', userInfo.email);
      fd.append('image', userInfo.image);
      axios
        .post(
          'https://radiant-beach-45888.herokuapp.com/api/user/updateProfile',
          fd,
          {
            headers: {
              token: localStorage.getItem('token'),
            },
          }
        )
        .then(result => {
          if (result.status === 200) {
            alert('updated profile successfully');
            history.push('/');
          }
        })
        .catch(err => console.log('error ', err));
    } else {
      axios
        .post('http://localhost:8000/api/user/updateProfile', userInfo, {
          headers: {
            token: localStorage.getItem('token'),
          },
        })
        .then(result => {
          if (result.status === 200) {
            alert('updated profile successfully');
            history.push('/');
          }
        })
        .catch(err => console.log('error ', err));
    }
  };

  return (
    <div className="container mb-5  ">
      <div className="wrapper " style={{ color: 'white' }}>
        <div className="my-5" style={{ textAlign: 'center' }}>
          USER INFORMATION
        </div>
        <form method="post" onSubmit={e => callUpdate(e)}>
          <div>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="form_detail">
                  <label>LAST NAME</label>
                  <input
                    type="text"
                    name="lastName"
                    value={userInfo.lastName}
                    onChange={e => handleChange(e)}
                  />
                </div>
                <div className="form_detail">
                  <label>FIRST NAME</label>
                  <input
                    type="text"
                    name="firstName"
                    value={userInfo.firstName}
                    onChange={e => handleChange(e)}
                  />
                </div>
                <div className="form_detail">
                  <label>EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail">
                  <label>PASSWORD</label>
                  <input
                    type="password"
                    name="password"
                    value={userInfo.password}
                    onChange={e => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <label style={{}}></label>
                <div
                  style={{ marginTop: '0.5rem', width: '100%' }}
                  className="upload"
                  method="POST">
                  <input type="file" onChange={e => imageChange(e)} />
                  <p>
                    {/* <img
                      src={userInfo.showImage}
                      style={{
                        height: '200px',
                        width: '440px',
                        objectFit: 'cover',
                      }}
                    /> */}
                    UPLOAD
                    <br />
                    PROFILE PHOTO
                  </p>
                </div>

                <div className="form_detail">
                  <label>CONFIRM PASSWORD</label>
                  <input
                    type="password"
                    name="confPass"
                    value={userInfo.password}
                    onChange={e => handleChange(e)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="my-5" style={{ textAlign: 'center' }}>
            CONTACT DETAILS
          </div>
          <div>
            <p>*SHIPPING ADDRESS / DROP-OFF</p>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="form_detail">
                  <label>COUNTRY</label>
                  <input
                    type="text"
                    name="country"
                    value={userInfo.country}
                    onChange={e => handleChange(e)}
                  />
                </div>
                <div className="form_detail">
                  <label>CITY</label>
                  <input
                    type="text"
                    name="city"
                    value={userInfo.city}
                    onChange={e => handleChange(e)}
                  />
                </div>
                <div className="form_detail">
                  <label>MOBILE NUMBER</label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={userInfo.mobileNumber}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail">
                  <label>PAYMENT TYPE</label>
                  <input
                    type="text"
                    name="paymentType"
                    value={userInfo.paymentType}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail">
                  <label>EXPIRY DATE</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={userInfo.expiryDate}
                    onChange={e => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12 d-flex align-items-stretch flex-column ">
                <div className="form_detail">
                  <label>STATE</label>
                  <input
                    type="text"
                    name="state"
                    value={userInfo.state}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail d-none d-sm-block ">
                  <label>PREFERRED CARRIER</label>
                  <input type="text" />
                </div>
                {/* <div className="form_detail">
                  <label>PREFERRED CARRIER</label>
                  <input
                    type="text"
                    name="preferredCarrier"
                    value={userInfo.preferredCarrier}
                    onChange={e => handleChange(e)}
                  />
                </div> */}

                <div
                  className="form_detail d-none d-sm-block "
                  style={{ opacity: 0 }}>
                  <label>PREFERRED CARRIER</label>
                  <input type="text" />
                </div>
                <div className="form_detail">
                  <label>CARD NUMBER</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={userInfo.cardNumber}
                    onChange={e => handleChange(e)}
                  />
                </div>
                <div className="form_detail">
                  <label>CVV</label>
                  <input type="password" />
                </div>
              </div>
            </div>
          </div>
          <div className="create_ac_container d-flex justify-content-center mt-5">
            <button className="create_ac">SAVE</button>
          </div>
        </form>
        <div className="privacy">
          By clicking the button, you agree to our <span>Terms</span>,{' '}
          <span>Privacy</span> and <span>Security Policy</span>.
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

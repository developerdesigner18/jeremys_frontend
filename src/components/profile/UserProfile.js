import React, { useState, useEffect, useRef } from 'react';
import Header from '../header/Header';
import { getUser, updateProfile } from '../../actions/userActions';
import { useSelector, useDispatch } from 'react-redux';
import swal from 'sweetalert';

function UserProfile(props) {
  const dispatch = useDispatch();
  const stateData = useSelector(state => {
    if (localStorage.getItem('token')) return state.user;
  });
  const [userInfo, setUserInfo] = useState({
    lastName: '',
    firstName: '',
    email: '',
    password: '',
    confPass: '',
    country: '',
    city: '',
    phoneNumber: '',
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
  const useHasChanged = val => {
    const prevVal = usePrevious(val);
    return prevVal !== val;
  };

  const usePrevious = value => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const hasVal1Changed = useHasChanged(userInfo);

  useEffect(async () => {
    if (localStorage.getItem('token')) {
      let mounted = true;
      await dispatch(getUser());

      if (mounted) {
        console.log('val1 has changed', stateData, mounted);
        if (stateData && stateData.userDetail) {
          console.log(
            'stateData.userDetail.data&payment ',
            stateData.userDetail,
            stateData.userDetail.data,
            stateData.userDetail.paymentData
          );
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
          } = stateData.userDetail.data;

          setUserInfo(prevState => ({
            ...prevState,
            firstName: firstName,
            lastName: lastName,
            email: emailId,
            city: city,
            state: state,
            password: password,
            phoneNumber: phoneNumber,
            country: country,
            showImage: profileImgURl,
            type: type,
            paymentType: stateData.userDetail.paymentData
              ? stateData.userDetail.paymentData.paymentType
              : '',
            expiryDate: stateData.userDetail.paymentData
              ? stateData.userDetail.paymentData.expiryDate
              : '',
            cvv: stateData.userDetail.paymentData
              ? stateData.userDetail.paymentData.cvv
              : '',
            cardNumber: stateData.userDetail.paymentData
              ? stateData.userDetail.paymentData.cardNumber
              : '',
            preferredCarrier: stateData.userDetail.paymentData
              ? stateData.userDetail.paymentData.preferredCarrier
              : '',
          }));
        }
      }
      return () => (mounted = false);
    } else {
      swal('Info', 'Please do logout').then(() => props.history.push('/login'));
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    if (stateData) {
      if (stateData.userDetail && stateData.userDetail.data) {
        setUserInfo(prevState => ({
          ...prevState,
          email: stateData.userDetail.data.emailId,
          type: stateData.userDetail.data.type,
        }));
      }
    }
    setUserInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const imageChange = event => {
    let reader = new FileReader();
    reader.onload = e => {
      setUserInfo(prevState => ({
        ...prevState,
        image: event.target.files[0],
        showImage: e.target.result,
      }));
    };
    reader.readAsDataURL(event.target.files[0]);
  };

  const callUpdate = async e => {
    e.preventDefault();
    if (stateData) {
      if (stateData.userDetail && stateData.userDetail.data) {
        setUserInfo(prevState => ({
          ...prevState,
          email: stateData.userDetail.data.emailId,
          type: stateData.userDetail.data.type,
        }));
      }
    }
    console.log('usrinfo ', stateData, userInfo);
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
      fd.append('phoneNumber', userInfo.phoneNumber);
      fd.append('preferredCarrier', userInfo.preferredCarrier);
      fd.append('type', stateData.userDetail.data.type);
      fd.append('email', stateData.userDetail.data.emailId);
      fd.append('image', userInfo.image);
      await dispatch(updateProfile(fd));
    } else {
      console.log('new user info ', userInfo);
      if (
        userInfo.email == '' &&
        userInfo.type == '' &&
        userInfo.firstName == '' &&
        userInfo.lastName == '' &&
        userInfo.password == '' &&
        userInfo.country == '' &&
        userInfo.city == '' &&
        userInfo.state == '' &&
        userInfo.paymentType == '' &&
        userInfo.preferredCarrier == '' &&
        userInfo.cardNumber == '' &&
        userInfo.cvv == '' &&
        userInfo.expiryDate == '' &&
        userInfo.phoneNumber == ''
      ) {
        const dataToPass = {
          email: stateData.userDetail.data.emailId,
          type: stateData.userDetail.data.type,
        };
        await dispatch(updateProfile(dataToPass));
      } else {
        await dispatch(updateProfile(userInfo));
      }
    }
  };

  return (
    <div className="container mb-5  ">
      <Header />
      {console.log('state data', stateData)}
      <div className="wrapper " style={{ color: 'white' }}>
        <div className="mb-5" style={{ textAlign: 'center' }}>
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
                    value={
                      userInfo.lastName
                        ? userInfo.lastName
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.lastName
                          : userInfo.lastName
                        : userInfo.lastName
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>
                <div className="form_detail">
                  <label>FIRST NAME</label>
                  <input
                    type="text"
                    name="firstName"
                    value={
                      userInfo.firstName
                        ? userInfo.firstName
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.firstName
                          : userInfo.firstName
                        : userInfo.firstName
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>
                <div className="form_detail">
                  <label>EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={
                      userInfo.email
                        ? userInfo.email
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.emailId
                          : userInfo.email
                        : userInfo.email
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail">
                  <label>PASSWORD</label>
                  <input
                    type="password"
                    name="password"
                    value={
                      userInfo.password
                        ? userInfo.password
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.password
                          : userInfo.password
                        : userInfo.password
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <label style={{}}>CHANGE PROFILE PHOTO</label>
                <div
                  // style={{
                  //   marginTop: "0.5rem",
                  //   width: "100%",
                  //   zIndex: "1",
                  //   background: `url("../assets/images/logo.png") no-repeat  !important`,
                  //   backgroundSize: "cover",
                  // }}
                  style={
                    userInfo.showImage ||
                    (stateData != null && stateData.userDetail)
                      ? {
                          width: '100%',
                          background: `url("${
                            userInfo.showImage
                              ? userInfo.showImage
                              : stateData.userDetail.data.profileImgURl
                          }") no-repeat center `,
                          color: 'white',
                          backgroundSize: 'cover',
                        }
                      : { background: '#ffff', width: '100%' }
                  }
                  className="upload"
                  method="POST">
                  <input type="file" onChange={e => imageChange(e)} />
                  {stateData && stateData.userDetail ? null : (
                    <p>ADD PROFILE PHOTO</p>
                  )}
                </div>

                <div className="form_detail">
                  <label>CONFIRM PASSWORD</label>
                  <input
                    type="password"
                    name="confPass"
                    value={
                      userInfo.password
                        ? userInfo.password
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.password
                          : userInfo.password
                        : userInfo.password
                    }
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
                    value={
                      userInfo.country
                        ? userInfo.country
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.country
                            ? stateData.userDetail.data.country
                            : userInfo.country
                          : userInfo.country
                        : userInfo.country
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>
                <div className="form_detail">
                  <label>CITY</label>
                  <input
                    type="text"
                    name="city"
                    value={
                      userInfo.city
                        ? userInfo.city
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.city
                          : userInfo.city
                        : userInfo.city
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>
                <div className="form_detail">
                  <label>MOBILE NUMBER</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={
                      userInfo.phoneNumber
                        ? userInfo.phoneNumber
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.phoneNumber
                          : userInfo.phoneNumber
                        : userInfo.phoneNumber
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail">
                  <label>PAYMENT TYPE</label>
                  <input
                    type="text"
                    name="paymentType"
                    value={
                      userInfo.paymentType
                        ? userInfo.paymentType
                        : stateData
                        ? stateData.userDetail.paymentData
                          ? stateData.userDetail.paymentData.paymentType
                          : userInfo.paymentType
                        : userInfo.paymentType
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail">
                  <label>EXPIRY DATE</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={
                      userInfo.expiryDate
                        ? userInfo.expiryDate
                        : stateData
                        ? stateData.userDetail.paymentData
                          ? stateData.userDetail.paymentData.expiryDate
                          : userInfo.expiryDate
                        : userInfo.expiryDate
                    }
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
                    value={
                      userInfo.state
                        ? userInfo.state
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.state
                          : userInfo.state
                        : userInfo.state
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail">
                  <label>PREFERRED CARRIER</label>
                  <input
                    type="text"
                    name="preferredCarrier"
                    value={
                      userInfo.preferredCarrier
                        ? userInfo.preferredCarrier
                        : stateData
                        ? stateData.userDetail.paymentData
                          ? stateData.userDetail.paymentData.preferredCarrier
                          : userInfo.preferredCarrier
                        : userInfo.preferredCarrier
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail">
                  <label>CARD NUMBER</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={
                      userInfo.cardNumber
                        ? userInfo.cardNumber
                        : stateData
                        ? stateData.userDetail.paymentData
                          ? stateData.userDetail.paymentData.cardNumber
                          : userInfo.cardNumber
                        : userInfo.cardNumber
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>
                <div className="form_detail">
                  <label>CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    value={
                      userInfo.cvv
                        ? userInfo.cvv
                        : stateData
                        ? stateData.userDetail.paymentData
                          ? stateData.userDetail.paymentData.cvv
                          : userInfo.cvv
                        : userInfo.cvv
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>
              </div>
            </div>
            <div className="create_ac_container d-flex justify-content-center mt-5">
              <button className="create_ac">SAVE</button>
            </div>
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

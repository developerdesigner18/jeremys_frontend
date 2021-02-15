import React, { useState, useEffect, useRef } from "react";
import Header from "../header/Header";
import {
  getUser,
  updateProfile,
  deactivateUserAccount,
} from "../../actions/userActions";
import { useSelector, useDispatch } from "react-redux";
import swal from "sweetalert";
import { PayPalButton } from "react-paypal-button-v2";
import "../../assets/css/profile.css";
import axios from "axios";
import { Link } from "react-router-dom";

function UserProfile(props) {
  const dispatch = useDispatch();
  const stateData = useSelector(state => {
    if (localStorage.getItem("token")) return state.user;
  });
  const [userInfo, setUserInfo] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    confPass: "",
    country: "",
    city: "",
    phoneNumber: "",
    userNameHandle: "",
    startAddress: "",
    audienceTheme: "",
    brandName: "",
    bandName: "",
    contactNumber: "",
    userName: "",
    paymentType: "",
    expiryDate: "",
    state: "",
    preferredCarrier: "",
    cardNumber: "",
    image: "",
    showImage: "",
    bannerImage: "",
    showBannerImage: "",
    type: "",
    cvv: "",
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
    if (localStorage.getItem("token")) {
      let mounted = true;
      axios
        .get(
          `${
            process.env.REACT_APP_API_URL
          }api/user/getUserData?id=${localStorage.getItem("id")}`,
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        )
        .then(result => {
          console.log("result.data ", result);
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
              userName,
              userNameHandle,
              startAddress,
              audienceTheme,
              brandName,
              bandName,
              contactNumber,
              profileImgURl,
              bannerImgURl,
              type,
            } = result.data.data;

            setUserInfo(prevState => ({
              ...prevState,
              firstName: firstName,
              lastName: lastName,
              email: emailId,
              city: city,
              state: state,
              password: password,
              phoneNumber: phoneNumber,
              userNameHandle: userNameHandle,
              startAddress: startAddress,
              audienceTheme: audienceTheme,
              brandName: brandName,
              bandName: bandName,
              contactNumber: contactNumber,
              userName: userName,
              country: country,
              showImage: profileImgURl,
              showBannerImage: bannerImgURl,
              type: type,
              paymentType: result.data.paymentData
                ? result.data.paymentData.paymentType
                : "",
              expiryDate: result.data.paymentData
                ? result.data.paymentData.expiryDate
                : "",
              cvv: result.data.paymentData ? result.data.paymentData.cvv : "",
              cardNumber: result.data.paymentData
                ? result.data.paymentData.cardNumber
                : "",
              preferredCarrier: result.data.paymentData
                ? result.data.paymentData.preferredCarrier
                : "",
            }));
          }
        })
        .catch(err => console.log("error ", err));
    } else {
      swal("Info", "Please do logout").then(() => props.history.push("/login"));
    }
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    console.log("fn called ", value);
    // if (stateData) {
    //   if (stateData.userDetail && stateData.userDetail.data) {
    //     setUserInfo(prevState => ({
    //       ...prevState,
    //       email: stateData.userDetail.data.emailId,
    //       type: stateData.userDetail.data.type,
    //     }));
    //   }
    // }
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

  const BannerChange = event => {
    let reader = new FileReader();
    reader.onload = e => {
      setUserInfo(prevState => ({
        ...prevState,
        bannerImage: event.target.files[0],
        showBannerImage: e.target.result,
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
    console.log("usrinfo ", stateData, userInfo);
    if (userInfo.image || userInfo.bannerImage) {
      console.log("-=-=-=- inside image");
      let fd = new FormData();
      fd.append("firstName", userInfo.firstName);
      fd.append("lastName", userInfo.lastName);
      fd.append("city", userInfo.city);
      fd.append("state", userInfo.state);
      fd.append("country", userInfo.country);
      fd.append("paymentType", userInfo.paymentType);
      fd.append("cardNumber", userInfo.cardNumber);
      fd.append("expiryDate", userInfo.expiryDate);
      fd.append("phoneNumber", userInfo.phoneNumber);
      fd.append("userNameHandle", userInfo.userNameHandle);
      fd.append("startAddress", userInfo.startAddress);
      fd.append("audienceTheme", userInfo.audienceTheme);
      fd.append("brandName", userInfo.brandName);
      fd.append("bandName", userInfo.bandName);
      // fd.append('contactNumber', userInfo.contactNumber);
      fd.append("userName", userInfo.userName);
      fd.append("preferredCarrier", userInfo.preferredCarrier);
      fd.append("type", stateData.userDetail.data.type);
      fd.append("email", stateData.userDetail.data.emailId);
      if (userInfo.image) fd.append("image", userInfo.image);
      if (userInfo.bannerImage) fd.append("bannerImage", userInfo.bannerImage);
      await dispatch(updateProfile(fd));
    } else {
      console.log("new user info ", userInfo);
      await dispatch(updateProfile(userInfo));
    }
  };

  const callDeactivate = async () => {
    console.log("callDeactivatefn called");
    const dataToPass = {
      id: localStorage.getItem("id"),
    };
    await dispatch(deactivateUserAccount(dataToPass));
  };

  return (
    <div className="container mb-5  ">
      <Header />
      <div className="wrapper " style={{ color: "white" }}>
        <div className="mb-5" style={{ textAlign: "center" }}>
          USER INFORMATION
        </div>

        <div className="mb-4 deactivate">
          <button
            className="btn btn-default btn_submit"
            type="button"
            onClick={callDeactivate}>
            Deactivate Account
          </button>
        </div>

        <form method="post" onSubmit={e => callUpdate(e)}>
          <div>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("type") === "Fan" ? "none" : "",
                  }}>
                  {/* <label style={{}}>CHANGE BANNER</label> */}
                  <label style={{}}>
                    {localStorage.getItem("type") === "Advertiser"
                      ? "BANNER 1"
                      : "CHANGE BANNER"}
                  </label>
                  <div
                    style={{
                      marginTop: "0.5rem",
                      width: "100%",
                      zIndex: "1",
                      background: `url("../assets/images/logo.png") no-repeat  !important`,
                      backgroundSize: "cover",
                    }}
                    style={
                      userInfo.showBannerImage ||
                      (stateData != null && stateData.userDetail)
                        ? {
                            width: "100%",
                            background: `url("${
                              userInfo.showBannerImage
                                ? userInfo.showBannerImage
                                : null
                            }") no-repeat center `,
                            color: "white",
                            backgroundSize: "contain",
                          }
                        : { background: "#ffff", width: "100%" }
                    }
                    className="upload"
                    method="POST">
                    <input type="file" onChange={e => BannerChange(e)} />
                    {stateData && stateData.userDetail ? null : (
                      <p>ADD PROFILE PHOTO</p>
                    )}
                  </div>
                </div>

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
                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("type") === "Fan" ? "" : "none",
                  }}>
                  <label>EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={e => handleChange(e)}
                    disabled
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("type") === "Fan" ? "" : "none",
                  }}>
                  <label>PASSWORD</label>
                  <input
                    type="password"
                    name="password"
                    value={userInfo.password}
                    disabled
                    onChange={e => handleChange(e)}
                  />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                {/* <label style={{}}>CHANGE PROFILE PHOTO</label> */}
                <label style={{}} className="upload_profile">
                  {localStorage.getItem("type") === "Advertiser"
                    ? "BANNER 2"
                    : "CHANGE PROFILE PHOTO"}
                </label>
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
                          width: "100%",
                          background: `url("${
                            userInfo.showImage
                              ? userInfo.showImage
                              : stateData.userDetail.data.profileImgURl
                          }") no-repeat center `,
                          color: "white",
                          backgroundSize: "contain",
                        }
                      : { background: "#ffff", width: "100%" }
                  }
                  className="upload"
                  method="POST">
                  <input type="file" onChange={e => imageChange(e)} />
                  {stateData && stateData.userDetail ? null : (
                    <p>ADD PROFILE PHOTO</p>
                  )}
                </div>
                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("type") === "Fan" ? "none" : "",
                  }}>
                  <label>EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={e => handleChange(e)}
                    disabled
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("type") === "Fan" ? "none" : "",
                  }}>
                  <label>PASSWORD</label>
                  <input
                    type="password"
                    name="password"
                    value={userInfo.password}
                    disabled
                    onChange={e => handleChange(e)}
                  />
                </div>
                {/* <div className="form_detail">
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
                </div> */}
              </div>
            </div>
          </div>
          {/* ========================================================================================*/}
          <div className="my-5" style={{ textAlign: "center" }}>
            DETAILS
          </div>
          <div>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="form_detail">
                  <label>USER NAME</label>
                  <input
                    type="text"
                    name="userName"
                    value={userInfo.userName}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail">
                  <label>MOBILE NUMBER</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={userInfo.phoneNumber}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("type") === "Star" ? "" : "none",
                  }}>
                  <label>AUDIENCE THEME</label>
                  <input
                    type="text"
                    name="audienceTheme"
                    value={userInfo.audienceTheme}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("type") === "Advertiser"
                        ? ""
                        : "none",
                  }}>
                  <label>BRAND NAME</label>
                  <input
                    type="text"
                    name="brandName"
                    value={userInfo.brandName}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("type") === "Advertiser" ||
                      localStorage.getItem("type") === "Star"
                        ? "none"
                        : "",
                  }}>
                  <label>CITY</label>
                  <input
                    type="text"
                    name="city"
                    value={userInfo.city}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("type") === "Advertiser" ||
                      localStorage.getItem("type") === "Star"
                        ? "none"
                        : "",
                  }}>
                  <label>COUNTRY</label>
                  <input
                    type="text"
                    name="country"
                    value={userInfo.country}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail" style={{ display: "none" }}>
                  <label>PAYMENT TYPE</label>
                  <input
                    type="text"
                    name="paymentType"
                    value={userInfo.paymentType}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail" style={{ display: "none" }}>
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
                  <label>USER NAME HANDLE</label>
                  <input
                    type="text"
                    name="userNameHandle"
                    value={userInfo.userNameHandle}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("type") === "Star" ? "" : "none",
                  }}>
                  <label>BAND NAME</label>
                  <input
                    type="text"
                    name="bandName"
                    value={userInfo.bandName}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("type") === "Advertiser"
                        ? ""
                        : "none",
                  }}>
                  <label>CONTACT NUMBER</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={userInfo.contactNumber}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("type") === "Advertiser" ||
                      localStorage.getItem("type") === "Star"
                        ? "none"
                        : "",
                  }}>
                  <label>ADDRESS</label>
                  <input
                    type="text"
                    name="startAddress"
                    value={userInfo.startAddress}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("type") === "Advertiser" ||
                      localStorage.getItem("type") === "Star"
                        ? "none"
                        : "",
                  }}>
                  <label>STATE</label>
                  <input
                    type="text"
                    name="state"
                    value={userInfo.state}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail" style={{ display: "none" }}>
                  <label>PREFERRED CARRIER</label>
                  <input
                    type="text"
                    name="preferredCarrier"
                    value={userInfo.preferredCarrier}
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div className="form_detail" style={{ display: "none" }}>
                  <label>CARD NUMBER</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={userInfo.cardNumber}
                    onChange={e => handleChange(e)}
                  />
                </div>
                <div className="form_detail" style={{ display: "none" }}>
                  <label>CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    value={userInfo.cvv}
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
          By clicking the button, you agree to our{" "}
          <span>
            <Link to="/termsCondition">Terms</Link>
          </span>
          , <span>Privacy</span> and <span>Security Policy</span>.
        </div>
        {/* <div style={{ textAlign: 'center',marginTop:"10px" }}>
            <PayPalButton
              amount="0.01"
              // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
              onSuccess={(details, data) => {
                alert("Transaction completed by " + details.payer.name.given_name);
      
                // OPTIONAL: Call your server to save the transaction
                return fetch("/paypal-transaction-complete", {
                  method: "post",
                  body: JSON.stringify({
                    orderID: data.orderID
                  })
                });
              }}
            />
        </div> */}
      </div>
    </div>
  );
}

export default UserProfile;

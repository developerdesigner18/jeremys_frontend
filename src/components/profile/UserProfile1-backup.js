import React, { useState, useEffect, useRef } from "react"
import Header from "../header/Header"
import {
  getUser,
  updateProfile,
  deactivateUserAccount,
} from "../../actions/userActions"
import { useSelector, useDispatch } from "react-redux"
import swal from "sweetalert"
import "../../assets/css/profile.css"

function UserProfile(props) {
  const dispatch = useDispatch()
  const stateData = useSelector(state => {
    if (localStorage.getItem("token")) return state.user
  })
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
    type: "",
    cvv: "",
  })
  const useHasChanged = val => {
    const prevVal = usePrevious(val)
    return prevVal !== val
  }

  const usePrevious = value => {
    const ref = useRef()
    useEffect(() => {
      ref.current = value
    })
    return ref.current
  }

  const hasVal1Changed = useHasChanged(userInfo)

  useEffect(async () => {
    if (localStorage.getItem("token")) {
      let mounted = true
      await dispatch(getUser())

      if (mounted) {
        console.log("val1 has changed", stateData, mounted)
        if (stateData && stateData.userDetail) {
          console.log(
            "stateData.userDetail.data&payment ",
            stateData.userDetail,
            stateData.userDetail.data,
            stateData.userDetail.paymentData
          )
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
            type,
          } = stateData.userDetail.data

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
            type: type,
            paymentType: stateData.userDetail.paymentData
              ? stateData.userDetail.paymentData.paymentType
              : "",
            expiryDate: stateData.userDetail.paymentData
              ? stateData.userDetail.paymentData.expiryDate
              : "",
            cvv: stateData.userDetail.paymentData
              ? stateData.userDetail.paymentData.cvv
              : "",
            cardNumber: stateData.userDetail.paymentData
              ? stateData.userDetail.paymentData.cardNumber
              : "",
            preferredCarrier: stateData.userDetail.paymentData
              ? stateData.userDetail.paymentData.preferredCarrier
              : "",
          }))
        }
      }
      return () => (mounted = false)
    } else {
      swal("Info", "Please do logout").then(() => props.history.push("/login"))
    }
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
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
    }))
  }

  const imageChange = event => {
    let reader = new FileReader()
    reader.onload = e => {
      setUserInfo(prevState => ({
        ...prevState,
        image: event.target.files[0],
        showImage: e.target.result,
      }))
    }
    reader.readAsDataURL(event.target.files[0])
  }

  const callUpdate = async e => {
    e.preventDefault()
    if (stateData) {
      if (stateData.userDetail && stateData.userDetail.data) {
        setUserInfo(prevState => ({
          ...prevState,
          email: stateData.userDetail.data.emailId,
          type: stateData.userDetail.data.type,
        }))
      }
    }
    console.log("usrinfo ", stateData, userInfo)
    if (userInfo.image) {
      let fd = new FormData()
      fd.append("firstName", userInfo.firstName)
      fd.append("lastName", userInfo.lastName)
      fd.append("city", userInfo.city)
      fd.append("state", userInfo.state)
      fd.append("country", userInfo.country)
      fd.append("paymentType", userInfo.paymentType)
      fd.append("cardNumber", userInfo.cardNumber)
      fd.append("expiryDate", userInfo.expiryDate)
      fd.append("phoneNumber", userInfo.phoneNumber)
      fd.append("userNameHandle", userInfo.userNameHandle)
      fd.append("startAddress", userInfo.startAddress)
      fd.append("audienceTheme", userInfo.audienceTheme)
      fd.append("brandName", userInfo.brandName)
      fd.append("bandName", userInfo.bandName)
      fd.append("contactNumber", userInfo.contactNumber)
      fd.append("userName", userInfo.userName)
      fd.append("preferredCarrier", userInfo.preferredCarrier)
      fd.append("type", stateData.userDetail.data.type)
      fd.append("email", stateData.userDetail.data.emailId)
      fd.append("image", userInfo.image)
      await dispatch(updateProfile(fd))
    } else {
      console.log("new user info ", userInfo)
      if (
        userInfo.email == "" &&
        userInfo.type == "" &&
        userInfo.firstName == "" &&
        userInfo.lastName == "" &&
        userInfo.password == "" &&
        userInfo.country == "" &&
        userInfo.city == "" &&
        userInfo.state == "" &&
        userInfo.paymentType == "" &&
        userInfo.preferredCarrier == "" &&
        userInfo.cardNumber == "" &&
        userInfo.cvv == "" &&
        userInfo.expiryDate == "" &&
        userInfo.phoneNumber == "" &&
        userInfo.userName == "" &&
        userInfo.userNameHandle == "" &&
        userInfo.startAddress == "" &&
        userInfo.audienceTheme == "" &&
        userInfo.brandName == "" &&
        userInfo.contactNumber == "" &&
        userInfo.bandName == ""
      ) {
        const dataToPass = {
          email: stateData.userDetail.data.emailId,
          type: stateData.userDetail.data.type,
          country: stateData.userDetail.data.country,
          userName: stateData.userDetail.data.userName,
          userNameHandle: stateData.userDetail.data.userNameHandle,
          startAddress: stateData.userDetail.data.startAddress,
          audienceTheme: stateData.userDetail.data.audienceTheme,
          brandName: stateData.userDetail.data.brandName,
          bandName: stateData.userDetail.data.bandName,
          contactNumber: stateData.userDetail.data.contactNumber,
          phoneNumber: stateData.userDetail.data.phoneNumber,
          city: stateData.userDetail.data.city,
          state: stateData.userDetail.data.state,
        }
        await dispatch(updateProfile(dataToPass))
      } else {
        await dispatch(updateProfile(userInfo))
      }
    }
  }

  const callDeactivate = async () => {
    console.log("callDeactivatefn called")
    const dataToPass = {
      id: localStorage.getItem("id"),
    }
    await dispatch(deactivateUserAccount(dataToPass))
  }

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
                    disabled
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
                    disabled
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
                          width: "100%",
                          background: `url("${
                            userInfo.showImage
                              ? userInfo.showImage
                              : stateData.userDetail.data.profileImgURl
                          }") no-repeat center `,
                          color: "white",
                          backgroundSize: "cover",
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
                    value={
                      userInfo.userName
                        ? userInfo.userName
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.userName
                          : userInfo.userName
                        : userInfo.userName
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

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("name") === "star" ? "" : "none",
                  }}>
                  <label>AUDIENCE THEME</label>
                  <input
                    type="text"
                    name="audienceTheme"
                    value={
                      userInfo.audienceTheme
                        ? userInfo.audienceTheme
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.audienceTheme
                          : userInfo.audienceTheme
                        : userInfo.audienceTheme
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("name") === "advertiser"
                        ? ""
                        : "none",
                  }}>
                  <label>BRAND NAME</label>
                  <input
                    type="text"
                    name="brandName"
                    value={
                      userInfo.brandName
                        ? userInfo.brandName
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.brandName
                          : userInfo.brandName
                        : userInfo.brandName
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("name") === "advertiser" ||
                      localStorage.getItem("name") === "star"
                        ? "none"
                        : "",
                  }}>
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

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("name") === "advertiser" ||
                      localStorage.getItem("name") === "star"
                        ? "none"
                        : "",
                  }}>
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

                <div className="form_detail" style={{ display: "none" }}>
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

                <div className="form_detail" style={{ display: "none" }}>
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
                  <label>USER NAME HANDLE</label>
                  <input
                    type="text"
                    name="userNameHandle"
                    value={
                      userInfo.userNameHandle
                        ? userInfo.userNameHandle
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.userNameHandle
                          : userInfo.userNameHandle
                        : userInfo.userNameHandle
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("name") === "star" ? "" : "none",
                  }}>
                  <label>BAND NAME</label>
                  <input
                    type="text"
                    name="bandName"
                    value={
                      userInfo.bandName
                        ? userInfo.bandName
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.bandName
                          : userInfo.bandName
                        : userInfo.bandName
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("name") === "advertiser"
                        ? ""
                        : "none",
                  }}>
                  <label>CONTACT NUMBER</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={
                      userInfo.contactNumber
                        ? userInfo.contactNumber
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.contactNumber
                          : userInfo.contactNumber
                        : userInfo.contactNumber
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("name") === "advertiser" ||
                      localStorage.getItem("name") === "star"
                        ? "none"
                        : "",
                  }}>
                  <label>ADDRESS</label>
                  <input
                    type="text"
                    name="startAddress"
                    value={
                      userInfo.startAddress
                        ? userInfo.startAddress
                        : stateData
                        ? stateData.userDetail.data
                          ? stateData.userDetail.data.startAddress
                          : userInfo.startAddress
                        : userInfo.startAddress
                    }
                    onChange={e => handleChange(e)}
                  />
                </div>

                <div
                  className="form_detail"
                  style={{
                    display:
                      localStorage.getItem("name") === "advertiser" ||
                      localStorage.getItem("name") === "star"
                        ? "none"
                        : "",
                  }}>
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

                <div className="form_detail" style={{ display: "none" }}>
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

                <div className="form_detail" style={{ display: "none" }}>
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
                <div className="form_detail" style={{ display: "none" }}>
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
          By clicking the button, you agree to our <span>Terms</span>,{" "}
          <span>Privacy</span> and <span>Security Policy</span>.
        </div>
      </div>
    </div>
  )
}

export default UserProfile

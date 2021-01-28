import React, { useState } from "react"
import "../assets/css/profile.css"
import Header from "./header/Header"
import { storeContactUs } from "../actions/userActions"
import { useDispatch } from "react-redux"
import swal from "sweetalert"

function CustomerService() {
  const dispatch = useDispatch()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setphoneNumber] = useState("")
  const [numberError, setNumberError] = useState("")
  const [message, setMessage] = useState("")

  const submitContactUs = async e => {
    e.preventDefault()

    if (
      firstName != "" &&
      lastName != "" &&
      email != "" &&
      phoneNumber != "" &&
      message != ""
    ) {
      const dataToPass = {
        firstName,
        lastName,
        email,
        phoneNumber,
        message,
      }
      await dispatch(storeContactUs(dataToPass))
    } else {
      swal("Error", "All fields are required!", "error")
    }
  }

  const numberCheck = value => {
    if (value.match(/^[0-9]+$/)) {
      setphoneNumber(value)
      setNumberError("")
    } else {
      setNumberError("Only Numbers are allowed")
    }
  }

  return (
    <div className="container">
      <Header />
      <form method="post" onSubmit={e => submitContactUs(e)}>
        <div>
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="form_detail"></div>

              <div className="form_detail">
                <label>FIRST NAME</label>
                <input
                  type="text"
                  name="firstName"
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
              <div className="form_detail">
                <label>EMAIL</label>
                <input
                  type="email"
                  name="email"
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form_detail">
                <label>PHONE NUMBER</label>
                <input
                  type="text"
                  name="phoneNumber"
                  onChange={e => numberCheck(e.target.value)}
                />
              </div>
              <small style={{ color: "red" }}>{numberError}</small>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="form_detail"></div>
              <div className="form_detail">
                <label>LAST NAME</label>
                <input
                  type="text"
                  name="lastName"
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
              <div className="form_detail">
                <label>MESSAGE</label>
                <textarea
                  rows={4}
                  onChange={e => setMessage(e.target.value)}
                  style={{ height: "115px" }}></textarea>
              </div>
            </div>
          </div>
        </div>
        <div className="create_ac_container d-flex justify-content-center mt-5">
          <button className="create_ac">SUBMIT</button>
        </div>
      </form>
    </div>
  )
}

export default CustomerService

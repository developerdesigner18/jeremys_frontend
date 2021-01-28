import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import Header from "./header/Header"
import "../assets/css/forgotPassword.css"
import { forgotPassword } from "../actions/userActions"
import { useDispatch } from "react-redux"

function ForgotPassword() {
  const history = useHistory()
  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const goToLogin = () => {
    history.push("/login")
  }

  const callForgot = async e => {
    e.preventDefault()

    if (email == "") {
      setEmailError("Please enter email address")
    } else {
      const dataToPass = {
        email: email,
      }
      await dispatch(forgotPassword(dataToPass))
      setEmail("")
    }
  }

  const emailValidation = event => {
    console.log(
      "dddss ",
      /^[a-zA-Z0-9._\-]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(event.target.value)
    )
    if (/^[a-zA-Z0-9._\-]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(event.target.value)) {
      console.log("true")
      setEmailError("")
      setEmail(event.target.value)
    } else {
      setEmailError("Please enter proper email address")
    }
  }

  return (
    <div>
      <Header />
      <div className="container">
        <form method="post" onSubmit={e => callForgot(e)}>
          <div className="forgot_form_container p-3 p-md-5 ">
            <div className="form_detail">
              <h3>Forgot Password</h3>
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                onChange={e => emailValidation(e)}
              />
              <small style={{ color: "red" }}>{emailError}</small>
            </div>
            <div className="row mt-3">
              <div className="col-6 forgot_button">
                <button className="btn btn-default btn_submit" type="submit">
                  Submit
                </button>
              </div>
              <div className="col-6">
                <a
                  onClick={goToLogin}
                  style={{
                    cursor: "pointer",
                    float: "right",
                  }}>
                  Go Back To Login
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPassword

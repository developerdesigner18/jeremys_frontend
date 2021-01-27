import React, { useState, useEffect } from "react"
import "../../assets/css/signup.css"
import { useHistory } from "react-router-dom"
import { registration } from "../../actions/userActions"
import { useSelector, useDispatch } from "react-redux"
import Header from "../header/Header"
import swal from "sweetalert"

function Register(props) {
  const history = useHistory()
  const stateData = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [type, setType] = useState("Fan")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confpass, setConfpass] = useState("")
  const [image, setImage] = useState("")
  const [showImage, setShowImage] = useState("")

  const onImageChange = e => {
    console.log("image... ", e.target.files[0])
    setImage(e.target.files[0])
    setShowImage(URL.createObjectURL(e.target.files[0]))
  }

  const goToTerms = () => {
    history.push("/termsCondition")
  }

  const callRegister = async e => {
    e.preventDefault()

    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === "" ||
      confpass === "" ||
      type === ""
    ) {
      swal("!Oops", "Field cannot be blank", "error")
      return
    } else if (password !== confpass) {
      swal("!Oops", "Password and confirm password must be same", "error")
    } else {
      let fd = new FormData()
      fd.append("firstName", firstName)
      fd.append("lastName", lastName)
      fd.append("email", email)
      fd.append("password", password)
      fd.append("type", type)
      if (image) fd.append("image", image)

      await dispatch(registration(fd, props))
    }
  }

  const changeType = (e, type) => {
    console.log("typre ", type)
    e.preventDefault()
    setType(type)
  }

  const imageChange = event => {
    let reader = new FileReader()
    reader.onload = e => {
      setImage(event.target.files[0])
      setShowImage(e.target.result)
    }
    reader.readAsDataURL(event.target.files[0])
  }

  return (
    <div style={{ background: "black" }}>
      <Header />
      <div className="container p-5 main mt-5">
        <form method="post" onSubmit={e => callRegister(e)}>
          <div className="tab">
            <button
              className="tablinks"
              type="button"
              style={{ border: type == "Fan" ? "2px solid #363636" : "none" }}
              onClick={e => changeType(e, "Fan")}>
              FAN
            </button>
            <button
              className="tablinks"
              type="button"
              style={{ border: type == "Star" ? "2px solid #363636" : "none" }}
              onClick={e => changeType(e, "Star")}>
              STAR
            </button>
            <button
              className="tablinks"
              type="button"
              style={{ border: type == "Chef" ? "2px solid #363636" : "none" }}
              onClick={e => changeType(e, "Chef")}>
              CHEF
            </button>
            <button
              type="button"
              className="tablinks"
              style={{
                border: type == "Stylist" ? "2px solid #363636" : "none",
              }}
              onClick={e => changeType(e, "Stylist")}>
              STYLIST
            </button>
            <button
              className="tablinks"
              type="button"
              style={{
                border: type == "Trainer" ? "2px solid #363636" : "none",
              }}
              onClick={e => changeType(e, "Trainer")}>
              TRAINER
            </button>
            <button
              className="tablinks"
              type="button"
              style={{
                border: type == "Advertiser" ? "2px solid #363636" : "none",
              }}
              onClick={e => changeType(e, "Advertiser")}>
              ADVERTISER
            </button>
          </div>

          <div id="fan" className="tabcontent active">
            <div className="form_container d-flex">
              <div className="form_left_container">
                <div className="form_detail">
                  <label>firstname</label>
                  <input
                    type="text"
                    name="firstName"
                    onChange={e => setFirstName(e.target.value)}
                  />
                </div>
                <div className="form_detail">
                  <label>lastname</label>
                  <input
                    type="text"
                    name="lastName"
                    onChange={e => setLastName(e.target.value)}
                  />
                </div>
                <div className="form_detail">
                  <label>e-mail</label>
                  <input
                    type="email"
                    name="email"
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div className="form_detail">
                  <label>password</label>
                  <input
                    type="password"
                    name="password"
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="form_right_container">
                <div
                  style={
                    showImage
                      ? {
                          width: "100%",
                          background: `url("${showImage}") no-repeat center `,
                          color: "white",
                          backgroundSize: "cover",
                        }
                      : { background: "#ffff", width: "100%" }
                  }
                  className="upload"
                  method="POST">
                  <input type="file" onChange={e => imageChange(e)} />
                  {showImage ? null : <p>ADD PROFILE PHOTO</p>}
                </div>
                <div className="form_detail">
                  <label>confirm password</label>
                  <input
                    type="password"
                    name="confpass"
                    onChange={e => setConfpass(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="create_ac_container d-flex justify-content-center mt-5">
              <button className="create_ac" type="submit">
                Create My Account
              </button>
            </div>
            <div className="privacy">
              By clicking the button, you agree to our{" "}
              <span style={{ cursor: "pointer" }} onClick={goToTerms}>
                Terms
              </span>
              , <span>Privacy</span> and <span>Security Policy</span>.
            </div>
          </div>
        </form>

        <div id="star" className="tabcontent">
          <h3>Paris</h3>
          <p>Paris is the capital of France.</p>
        </div>
        <div id="chef" className="tabcontent">
          <h3>Tokyo</h3>
          <p>Tokyo is the capital of Japan.</p>
        </div>
        <div id="stylist" className="tabcontent">
          <h3>London</h3>
          <p>London is the capital city of England.</p>
        </div>

        <div id="trainer" className="tabcontent">
          <h3>Paris</h3>
          <p>Paris is the capital of France.</p>
        </div>

        <div id="advertiser" className="tabcontent">
          <h3>Tokyo</h3>
          <p>Tokyo is the capital of Japan.</p>
        </div>
      </div>
    </div>
  )
}

export default Register

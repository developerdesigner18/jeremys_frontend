import React from "react"
import "../assets/css/profile.css"
import Header from "./header/Header"

function CustomerService() {
  return (
    <>
      <Header />
      <div className="container">
        <form method="post">
          <div>
            <div className="row">
              <div className="col-md-6 col-sm-12">
                <div className="form_detail"></div>

                <div className="form_detail">
                  <label>FIRST NAME</label>
                  <input type="text" name="firstName" />
                </div>
                <div className="form_detail">
                  <label>EMAIL</label>
                  <input type="email" name="email" />
                </div>
                <div className="form_detail">
                  <label>PHONE NUMBER</label>
                  <input type="text" name="phoneNumber" />
                </div>
              </div>
              <div className="col-md-6 col-sm-12">
                <div className="form_detail">
                  <label>LAST NAME</label>
                  <input type="text" name="lastName" />
                </div>
                <div className="form_detail">
                  <label>MESSAGE</label>
                  <textarea rows={4}></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="create_ac_container d-flex justify-content-center mt-5">
            <button className="create_ac">SUBMIT</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CustomerService

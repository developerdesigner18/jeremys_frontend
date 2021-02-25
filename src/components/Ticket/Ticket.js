import React from "react";
import "../../assets/css/ticket.css";

function Ticket() {
  return (
    <div class="MainwrapperTicket">
      <div class="main_reciept_container position-relative mt-5">
        <div class="background_image">
          <img src="../assets/images/JL_RECEIPT_PAID.jpg" />
        </div>
        <div class="main_container d-flex flex-column align-items-center">
          <div class="text-center">
            <img src="../assets/images/silver_logo.png" />
          </div>
          <div class="contact_mail d-flex align-items-center mb-4 mt-3">
            <div class="contact mr-2">Contact: +1547889</div>
            <div class="mail ml-2">Email: mail@jeremys.com</div>
          </div>
          <button class="reciept_button mb-3">RECEIPT</button>
          <p class="mb-1">RECEIVED FROM:</p>
          <p>Steve Smith</p>
          <p class="date">Date: 19 Oct, 2020</p>
          <p>Payment Method</p>
          <p class="mb-0">Account No: XXXXX2456</p>
          <p>Account Name: Steve Smith</p>
          <div class="table_down mt-4 d-flex align-items-center">
            <div>NO.</div>
            <div>DESCRIPTION</div>
            <div>PRICE</div>
            <div>QUANTITY</div>
            <div>TOTAL</div>
          </div>
          <div class="table_down table_middle mt-3 d-flex align-items-center">
            <div>1</div>
            <div>Spagetti</div>
            <div>$10.</div>
            <div>3</div>
            <div>$30</div>
          </div>
          <div class="table_down table_middle mt-1 d-flex align-items-center">
            <div>2</div>
            <div>Pizza</div>
            <div>$100</div>
            <div>1</div>
            <div>$100</div>
          </div>
          <div class="tax_container mt-5 d-flex align-items-center">
            <div class="tax mr-3">Tax:</div>
            <div class="">$13</div>
          </div>
          <div class="tax_container d-flex align-items-center">
            <div class="tax mr-3">TOTAL</div>
            <div class="">$130</div>
          </div>
          <div class="paid_image my-3">
            <img src="../assets/images/paid_button.png" />
          </div>
          <p class="thanks">Thank you from Jeremy’s Live!</p>
        </div>
      </div>
    </div>
  );
}

export default Ticket;

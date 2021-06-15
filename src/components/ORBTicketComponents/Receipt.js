import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/css/ticket.css";

import {
  getPaymentDetails,
  getTicketDetail,
  makeTicketEmpty,
  makeOrderEmpty,
} from "../../actions/paymentActions";
import { removeFan3MinuteCount } from "../../actions/orbActions";
import moment from "moment";
import socketIOClient from "socket.io-client";

function Ticket(props) {
  const dispatch = useDispatch();
  const stateData = useSelector((state) => state.payment);

  const [paidDetail, setPaidDetail] = useState({});
  const [loading, setloading] = useState(false);
  let socket;

  useEffect(async () => {
    console.log("props.... ", props);
    if (props.text === "chef/stylist") {
      await dispatch(getPaymentDetails(props.streamId));
      await dispatch(makeOrderEmpty());
    } else {
      await dispatch(getTicketDetail(props.streamId));
      await dispatch(makeTicketEmpty());
    }
  }, []);

  useEffect(async () => {
    if (stateData) {
      console.log(
        "(stateData.ticketInfo",
        stateData.ticketInfo,
        "\nstateData.paymentDetail",
        stateData.paymentDetail
      );
      if (stateData.ticketInfo) {
        console.log("inside if of tip/total amount");
        if (stateData.ticketInfo["total"]) {
          // } else {
          setPaidDetail(stateData.ticketInfo);
          setloading(true);
          const sessionTime = moment(props.streamObj.createdAt);
          const currentTime = moment();
          const diffTime = currentTime.diff(sessionTime, "seconds");
          const timeToDisplay = props.streamObj.timer - diffTime;
          props.setTime(timeToDisplay);
          props.setFreeSessionCompleted(false);

          socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);

          socket.emit("getIdForTipAmdTicket", props.streamId);
          const dataToPass = {
            fanId: localStorage.getItem("id"),
            userId: props.userId,
          };
          await dispatch(removeFan3MinuteCount(dataToPass));
          // props.setShow(false);
        }
      }
      if (stateData.paymentDetail != null) {
        console.log("payment of total order.......");
        setPaidDetail(stateData.paymentDetail);
        setloading(true);
        socket = socketIOClient(process.env.REACT_APP_SOCKET_URL);

        socket.emit("getIdForTipAmdTicket", props.streamId);
        // props.setShow(false);
        if (
          localStorage.getItem("type") === "fan" ||
          localStorage.getItem("type") === "Fan"
        ) {
          props.setFreeSessionCompleted(false);
        }
        const dataToPass = {
          fanId: localStorage.getItem("id"),
          userId: props.userId,
        };
        await dispatch(removeFan3MinuteCount(dataToPass));
      }
    }
  }, [stateData]);

  return (
    <div class="MainwrapperTicket">
      <div class="main_reciept_container position-relative ">
        <div class="background_image">
          <img src="../assets/images/JL_RECEIPT_PAID.jpg" />
        </div>
        <div class="d-flex justify-content-end text-muted">
          <i
            class="fas fa-times "
            role="button"
            onClick={() => {
              // props.setShow(false);
              props.handleClose();
            }}
            style={{ zIndex: "1", padding: "5px" }}
          />
        </div>
        {loading ? (
          <div class="main_container d-flex flex-column align-items-center">
            <div class="text-center">
              <img src="../assets/images/silver_logo.png" />
            </div>
            <div class="contact_mail d-flex align-items-center mb-4 mt-3">
              <div class="contact mr-2">
                Contact: {paidDetail.userId.contactNumber}
              </div>
              <div class="mail ml-2">Email: {paidDetail.userId.emailId}</div>
            </div>
            <button class="reciept_button mb-3">RECEIPT</button>
            <p class="mb-1">RECEIVED FROM:</p>
            <p>
              {paidDetail.userId.firstName + " " + paidDetail.userId.lastName}
            </p>
            <p>{paidDetail.fanId.startAddress}</p>
            <p class="date">
              Date: {moment(paidDetail.dateTime).format("DD MMM, YYYY")}
            </p>
            <p>Payment Method</p>
            <p class="mb-0">Account No: XXXXX2456</p>
            <p>
              Account Name:{" "}
              {paidDetail.fanId.firstName + " " + paidDetail.fanId.lastName}
            </p>
            {paidDetail.itemsData.length ? (
              <div class="table_down mt-4 d-flex align-items-center">
                <div>NO.</div>
                <div>DESCRIPTION</div>
                <div>PRICE</div>
                <div>QUANTITY</div>
                <div>TOTAL</div>
              </div>
            ) : null}
            {paidDetail.itemsData.length ? (
              paidDetail.itemsData.map((data, i) => {
                return (
                  <div class="table_down table_middle mt-3 d-flex align-items-center">
                    <div>{i + 1}</div>
                    <div>{data.name}</div>
                    <div>${data.price}</div>
                    <div>{data.quantity}</div>
                    <div>${data.price}</div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
            {/* <div class="tax_container mt-5 d-flex align-items-center">
            <div class="tax mr-3">Tax:</div>
            <div class="">$13</div>
          </div> */}
            <div class="tax_container d-flex align-items-center">
              <div class="tax mr-3">TOTAL</div>
              <div class="">${paidDetail.total}</div>
            </div>
            <div class="paid_image my-3">
              <img src="../assets/images/paid_button.png" />
            </div>
            <p class="thanks">Thank you from Jeremy’s Live!</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Ticket;

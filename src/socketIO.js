import socketIOClient from "socket.io-client";

export const socket = socketIOClient("http://54.236.46.101:8000", {
  jsonp: false,
  transports: ["websocket"], // you need to explicitly tell it to use websockets
});

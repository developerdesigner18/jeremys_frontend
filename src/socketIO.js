import socketIOClient from "socket.io-client";

export const socket = socketIOClient("http://localhost:8000", {
  jsonp: false,
  transports: ["websocket"], // you need to explicitly tell it to use websockets
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: Infinity,
});

socket.on("connect", () => console.log("socket connection establish"));

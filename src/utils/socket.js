// 📂 src/utils/socket.js
import { io } from "socket.io-client";

// Pick token dynamically (finance > sag > user)
const userToken = localStorage.getItem("token");
const sagToken = localStorage.getItem("sag_token");
const financeToken = localStorage.getItem("finance_token");

const token = financeToken || sagToken || userToken;

const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  autoConnect: true,
  auth: { token }, // backend socket middleware can read this
});

export default socket;

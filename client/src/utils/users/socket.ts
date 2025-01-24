import { io } from "socket.io-client";
import config from "../../config";

// const socket = io("http://localhost:3001", {
const socket = io(config.backendUrl, {
  query: { userId: "USER_ID" }, // Replace "USER_ID" dynamically
  transports: ["websocket"], 
});

export default socket;

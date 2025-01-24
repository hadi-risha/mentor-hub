// import { Server, Socket } from "socket.io";
// import http from "http";
// import express from "express";
// import config from "../config/config";

// const app = express();

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: [`${config.frontendUrl}`],
//     methods: ["GET", "POST"],
//   },
// });

// // Define a type for the user-socket map
// type UserSocketMap = { [key: string]: string };

// const userSocketMap: UserSocketMap = {}; // { userId: socketId }

// // Function to get receiver's socket ID with type annotations
// export const getReceiverSocketId = (receiverId: string): string | undefined => {
//   return userSocketMap[receiverId];
// };

// io.on("connection", (socket: Socket) => {
//   console.log("a user connected", socket.id);

//   const userId = socket.handshake.query.userId as string | undefined;
//   if (userId && userId !== "undefined") {
//     userSocketMap[userId] = socket.id;
//   }

//   // Emit the list of online users
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   // Handle user disconnection
//   socket.on("disconnect", () => {
//     console.log("user disconnected", socket.id);
//     if (userId) {
//       delete userSocketMap[userId];
//       io.emit("getOnlineUsers", Object.keys(userSocketMap));
//     }
//   });
// });

// export { app, io, server };

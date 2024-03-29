const socketIo = require("socket.io"); // Require the Socket.io module
const User = require("../models/UserModel");
const Event = require("../models/EventModel");

function intializeSocket(server) {
  const io = socketIo(server, {
    pingTimeout: 60000,
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    socket.on("setup", (Data) => {
      // Data  -      userId
      socket.join(Data);
      socket.emit("connected");
      console.log("user connected",Data);
    });

    socket.on("join", (room) => {
      socket.join(room);
    });

    socket.on("chatMessage", async (message) => {
      if (message.userId === message.senderId) {
        console.log("sending ...to event " + message.userId);
        socket.in(message.eventId).emit("message recieved", message);

        const user = await User.findById(message?.userId);
        io.to(message.eventId).emit("eventNotification", {
          message: `New message from ${user?.username}`,
        });
      } else {
        console.log("sending ...to user  " + message.userId);
        socket.in(message.userId).emit("message recieved", message);

        const event = await Event.findById(message?.eventId);
        io.to(message?.userId).emit("userNotification", {
          message: `New message from ${event?.title}`,
        });
      }
    });

    socket.on("videoCallInvite", (data) => {
      console.log("videoCallInvite", data);
      if (data?.sender?.role === "user") {
        // Broadcast the invitation to the specific event room
        io.to(data.eventId).emit("videoCallInvite", {
          sender: data.sender,
          eventId: data.eventId,
          meetlink: data.meetlink,
        });
      } else {
        io.to(data.userId).emit("videoCallInvite", {
          sender: data.sender,
          userId: data.userId,
          meetlink: data.meetlink,
        });
      }
    });

    socket.on("videoCallResponse", (data) => {
      if (data.userId) {
        // Broadcast the response to the specific event room
        io.to(data.userId).emit("videoCallResponse", {
          userId: data.userId,
          accepted: data.accepted,
        });
      } else {
        io.to(data.eventId).emit("videoCallResponse", {
          userId: data.eventId,
          accepted: data.accepted,
        });
      }
    });

    socket.on("disconnect", () => {
      // console.log('A user disconnected');
    });
  });
}
module.exports = intializeSocket;

const User = require("../models/UserModel");
const Event = require("../models/EventModel");
const ChatConnection = require("../models/ChatConnection");
const Chats = require("../models/ChatsModel");
const CatchAsync = require("../util/CatchAsync");

exports.getContactsList = CatchAsync(async (req, res) => {
  const user = await User.findById(req?.userId).populate("following");
  // console.log(user.following);

  const events = user?.following;
  const EventsAndUnseenCount = await Promise.all(
    events.map(async (event) => {
      const unseenMessagesCount = await Chats.countDocuments({
        eventId: event._id,
        isUserSeen: false,
      });

      return {
        ...event.toObject(),
        unseenMessagesCount,
      };
    })
  );
  console.log("unseen", EventsAndUnseenCount);
  return res
    .status(200)
    .json({ success: "ok", followingContacts: EventsAndUnseenCount });
});

exports.sendNewMessage = CatchAsync(async (req, res) => {
  console.log(req.body);
  const roomId = req.body?.roomId;
  const senderId = req?.userId;

  const Data = {
    roomId,
    senderId,
    userId: req.userId,
    eventId: req.body?.eventPartner,
    message: req.body?.newMessage,
    time: req.body?.time,
  };

  const newData = new Chats(Data);
  const savedData = await newData.save();
  console.log("new message,saved data", savedData);
  res.status(200).send({ success: true, savedChat: savedData });
});

exports.getMessages = CatchAsync(async (req, res) => {
  console.log(req.body);

  const eventId = req.body?.eventId;
  const userId = req.userId;
  const chatConnection = await ChatConnection.find({ userId, eventId });
  console.log("chatConnection length", chatConnection.length);

  if (chatConnection.length > 0) {
    const chatConnectionData = await ChatConnection.findOne({
      userId,
      eventId,
    }).populate('userId eventId');
    console.log("chatConnection data", chatConnectionData);
    const roomId = chatConnectionData._id;
    const Messages = await Chats.find({ roomId }).sort({ time: 1 })
    // console.log(Messages);

    await Chats.updateMany(
      { roomId, isUserSeen: false },
      { $set: { isUserSeen: true } }
    );
    if (Messages.length > 0) {
      res.status(200).send({
        Data: chatConnectionData,
        mes: Messages,
        success: true,
        roomId,
        userId,
      });
    } else {
      // Handle the case where there are no messages
      res
        .status(200)
        .send({ Data: chatConnectionData, success: true, roomId, userId });
    }
  } else {
    const Data = {
      userId,
      eventId
    };

    const newChatConnection = new ChatConnection(Data);
    const savedChatConnection = await newChatConnection.save();
    const connection = await ChatConnection.findById(savedChatConnection._id).populate('userId eventId')
    console.log("savedChatConnection", connection);
    res.status(200).send({ Data: connection, success: true });
  }
});



// event chats
exports.getEventContacts = CatchAsync(async (req, res) => {

  const connectedUsers = await ChatConnection.find({
    eventId: req?.eventId,
  }).populate('userId eventId');

  const UsersAndUnseenCount = await Promise.all(
    connectedUsers.map(async (user) => {
      const unseenMessagesCount = await Chats.countDocuments({
        userId: user?.userId?._id,
        isEventSeen: false,
      });

      return {
        ...user.toObject(),
        unseenMessagesCount,
      };
    })
  );

  console.log("unseen", UsersAndUnseenCount);
  return res
    .status(200)
    .send({ success: true, eventContacts: UsersAndUnseenCount });
});


exports.getEventMessages = CatchAsync(async (req, res) => {
  console.log(req.body);
  const eventId = req?.eventId;
  const userId = req?.body?.userId;

  const chatConnection = await ChatConnection.findOne({
    userId,
    eventId,
  }).populate('userId eventId');
  const roomId = chatConnection._id;
  console.log("roomId", roomId);

  const messages = await Chats.find({ roomId }).sort({ time: 1 });
  // console.log("messages", messages);

  await Chats.updateMany(
    { roomId, isEventSeen: false },
    { $set: { isEventSeen: true } }
  );

  const msg = await Chats.find({ roomId });
  console.log("msg", msg);

  if (messages.length > 0) {
    return res
      .status(200)
      .send({ success: true, chatConnection, messages, roomId, eventId });
  } else {
    return res
      .status(200)
      .send({ success: true, chatConnection, roomId, eventId });
  }
});

exports.sendMessage = CatchAsync(async (req, res) => {
  console.log(req.body);
  const roomId = req.body?.roomId;
  const eventId = req.body?.eventId;
  const senderId = req?.eventId;

  const Data = {
    roomId,
    senderId,
    userId: req?.body?.partnerId,
    eventId: eventId,
    message: req.body?.newMessage,
    time: req.body?.time,
  };

  const newData = new Chats(Data);
  const savedData = await newData.save();
  console.log("new message from event,saved data", savedData);
  res.status(200).send({ success: true, savedChat: savedData });
});

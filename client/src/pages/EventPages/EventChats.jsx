import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageIcon from "../../components/icons/MessageIcon";
import toast from "react-hot-toast";
import { useRef } from "react";
import socket from "../../components/User/SocketIo";
import { formatDistanceToNow } from "date-fns";
import { FaVideo } from "react-icons/fa";
import Avatar from "../../components/Avatar";
import { eventRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import EventSideBar from "../../components/EventSideBar";
import { ServerVariables } from "../../utils/ServerVariables";
import { useNavigate } from "react-router-dom";
import Search1 from "../../components/Search1";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { BsEmojiSmile } from "react-icons/bs";
import EventNavbar from "../../components/Event/EventNavbar";

function EventChats() {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [contactLists, setContactLists] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [chatPartner, setChatPartner] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [searched, setSearched] = useState("");
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // add emoji
  const [showEmoji, setShowEmoji] = useState(false);
  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = [];
    sym.forEach((el) => codeArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codeArray);
    setNewMessageText(newMessageText + emoji);
  };

  useEffect(() => {
    getContactsList();
  }, []);

  const getContactsList = () => {
    eventRequest({
      url: apiEndPoints.getEventContacts,
      method: "get",
    })
      .then((res) => {
        if (res.data?.success) {
          setContactLists(res.data.eventContacts);
        } else {
          toast.error("error in fetch chat list");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleClickContact = (userId) => {
    setSelectedUserId(userId);
    fetchChatMessages(userId);
    getContactsList();
    inputRef && inputRef.current.focus();
  };

  // send new message
  function sendMessage(roomId, partnerId, eventId) {
    console.log(roomId);
    const Data = {
      newMessage: newMessageText,
      roomId,
      partnerId,
      eventId,
      time: new Date(),
    };

    if (newMessageText.trim() === "") {
      return;
    } else {
      eventRequest({
        url: apiEndPoints.sendMessage,
        method: "post",
        data: Data,
      })
        .then((response) => {
          if (response.data.success) {
            setNewMessageText("");
            setShowEmoji(false);
            fetchChatMessages(partnerId);

            var obj = response.data.savedChat;
            if (!obj.senderId) {
              obj.senderId = response.data.savedChat.eventId;
            }

            socket.emit("chatMessage", obj);
            const datas = response.data.savedChat;
            setChatHistory([...chatHistory, datas]);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  const fetchChatMessages = async (userId) => {
    dispatch(showLoading());
    eventRequest({
      url: apiEndPoints.getEventMessages,
      method: "post",
      data: {
        userId,
      },
    })
      .then((response) => {
        dispatch(hideLoading());
        if (response.data.success) {
          setNewMessageText("");
          socket.emit("setup", response.data.eventId);

          socket.emit("join", response.data.roomId);
          setChatPartner(response.data?.chatConnection);
          setChatHistory(response.data?.messages);
          getContactsList();
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const updateChatHistory = (message) => {
    setChatHistory((prevChatHistory) => [...(prevChatHistory || []), message]);
  };

  useEffect(() => {
    socket.on("message recieved", (message) => {
      if (message.userId === selectedUserId) {
        updateChatHistory(message);
        fetchChatMessages(selectedUserId);
      } else {
        getContactsList();
      }
    });
    return () => {
      // Clean up the socket listener on component unmount
      socket.off("message recieved");
    };
  }, [selectedUserId]);

  const chatContainerRef = useRef(null);
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  const divUnderMessages = useRef();
  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatHistory]);

  const handleVideoClick = useCallback(
    (roomId, userId) => {
      navigate(`${ServerVariables.EventVideoCallRoom}/${roomId}/${userId}`);
    },
    [navigate]
  );

  return (
    <>
      <EventNavbar />
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen ml-4">
          <div className="flex h-screen">
            {/* contacts */}
            <div className="myDivBg w-1/3">
              <div className="myTextColor font-bold flex gap-4 p-4 my-2 border-b-2 myBorder">
                <MessageIcon />
                <Search1
                  search={"search chats..."}
                  value={searched}
                  onChange={(e) => setSearched(e.target.value)}
                />
              </div>
              {contactLists.length ? (
                contactLists
                  .filter((item) => {
                    return searched?.toLowerCase() === ""
                      ? item
                      : item?.userId?.username
                          ?.toLowerCase()
                          .includes(searched);
                  })
                  .map((contact) => (
                    <div
                      key={contact?.userId?._id}
                      onClick={() => handleClickContact(contact?.userId?._id)}
                      className={
                        "py-2 pl-4 border-0 border-gray-100 flex-col items-center gap-2 cursor-pointer " +
                        (contact?.userId?._id === selectedUserId
                          ? "activeBg"
                          : "")
                      }
                    >
                      <div className="flex gap-4 pl-4 items-center">
                        {contact?.userId?._id === selectedUserId && (
                          <div className="bg-blue-500 w-1 h-12 rounded-r-md"></div>
                        )}
                        <Avatar profile={contact?.userId?.profile} />
                        <span className="myTextColor">
                          {contact?.userId?.username}
                        </span>
                        {contact?.unseenMessagesCount > 0 && (
                          <span className="bg-green-500 text-white w-5 h-5 flex items-center justify-center rounded-full">
                            {contact?.unseenMessagesCount}
                          </span>
                        )}
                      </div>
                      {contact?.latestMessage ? (
                        <div className="flex gap-4  pl-20 items-center myPara text-xs">
                          <span>
                            {contact?.latestMessageSenderId !== contact?._id
                              ? `You: ${contact?.latestMessage}`
                              : `${contact?.title}: ${contact?.latestMessage}`}
                          </span>
                          <small>
                            {formatDistanceToNow(new Date(contact?.time), {
                              addSuffix: true,
                            })}
                          </small>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  ))
              ) : (
                <p className="myTextColor p-2">no connected users to chat</p>
              )}
            </div>

            {/* chat header */}
            <div className="flex flex-col  w-2/3 p-2">
              <div className="flex-grow">
                {selectedUserId ? (
                  <div className="myDivBg py-4 pl-4  flex items-center gap-4 cursor-pointer justify-between">
                    <Avatar profile={chatPartner?.userId?.profile} />
                    <div className="myTextColor font-bold">
                      {chatPartner?.userId?.username}
                    </div>
                    <FaVideo
                      className="myTextColor w-8 h-8 mr-2"
                      onClick={() =>
                        handleVideoClick(
                          chatPartner?.eventId?._id,
                          chatPartner?.userId?._id
                        )
                      }
                    />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="myTextColor">
                      &larr; select a person from sidebar
                    </div>
                  </div>
                )}
              </div>

              {/* chats */}

              <div className="relative h-full">
                <div
                  className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2"
                  ref={chatContainerRef}
                >
                  {chatHistory?.map((message) => {
                    const isEventChat = message.senderId === message.eventId;
                    const timeAgo = formatDistanceToNow(
                      new Date(message.time),
                      {
                        addSuffix: true,
                      }
                    );
                    return (
                      <div
                        key={message._id}
                        className={
                          isEventChat ? "text-right mx-8" : "text-left mx-8"
                        }
                      >
                        <div
                          className={
                            "text-left inline-block p-2 my-2 rounded-md text-sm " +
                            (isEventChat
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-500")
                          }
                        >
                          {message.message}
                        </div>

                        <div className="text-xs text-gray-500 self-end">
                          {timeAgo}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={divUnderMessages}></div>
                </div>
              </div>

              {!!selectedUserId && (
                <div className="flex gap-2 mx-2 p-2">
                  <input
                    type="text"
                    ref={inputRef}
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="message..."
                    className="myDivBg border p-2 flex-grow rounded-sm text-[#5A91E2]"
                  />

                  {/* emoji */}
                  <span
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="myTextColor cursor-pointer hover:text-slate-300"
                  >
                    <BsEmojiSmile />
                  </span>

                  {showEmoji && (
                    <div className="absolute bottom-12">
                      <Picker
                        data={data}
                        emojiSize={20}
                        emojiButtonSize={28}
                        onEmojiSelect={addEmoji}
                        maxFrequentRows={0}
                      />
                    </div>
                  )}

                  <button
                    onClick={() =>
                      sendMessage(
                        chatPartner._id,
                        selectedUserId,
                        chatPartner.eventId?._id
                      )
                    }
                    className="bg-blue-700  p-2 text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EventChats;

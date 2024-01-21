import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageIcon from "./icons/MessageIcon";
import Avatar from "./Avatar";
import { userRequest } from "../Helper/instance";
import { apiEndPoints } from "../utils/api";
import toast from "react-hot-toast";
import { useRef } from "react";
import socket from "./User/SocketIo";
import { formatDistanceToNow } from "date-fns";
import { FaVideo } from "react-icons/fa";
import { hideLoading, showLoading } from "../Redux/slices/LoadingSlice";
import UserSidebar from "./User/UserSidebar";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";
import Search1 from "../components/Search1";

function Chat() {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [contactLists, setContactLists] = useState([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [chatPartner, setChatPartner] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [searched, setSearched] = useState("");
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getContactsList();
  }, []);

  const getContactsList = () => {
    userRequest({
      url: apiEndPoints.getContactsList,
      method: "get",
    })
      .then((res) => {
        if (res.data?.success) {
          setContactLists(res.data.followingContacts);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleClickContact = (eventId) => {
    setSelectedEventId(eventId);
    fetchChatMessages(eventId);
    getContactsList();
    inputRef && inputRef.current.focus();
  };

  // send new message
  function sendMessage(roomId, partnerId) {
    const Data = {
      newMessage: newMessageText,
      roomId,
      eventPartner: partnerId,
      time: new Date(),
    };

    if (newMessageText.trim() === "") {
      return;
    } else {
      userRequest({
        url: apiEndPoints.sendNewMessage,
        method: "post",
        data: Data,
      })
        .then((response) => {
          if (response.data.success) {
            setNewMessageText("");
            fetchChatMessages(partnerId);

            var obj = response.data.savedChat;
            if (!obj.senderId) {
              obj.senderId = response.data.savedChat.userId;
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

  const fetchChatMessages = async (eventId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getMessages,
      method: "post",
      data: {
        eventId,
      },
    })
      .then((response) => {
        dispatch(hideLoading());
        if (response.data.success) {
          setNewMessageText("");
          socket.emit("setup", response.data?.userId);

          socket.emit("join", response.data?.roomId);
          setChatPartner(response.data?.Data);
          setChatHistory(response.data?.mes);
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
      if (message.eventId === selectedEventId) {
        updateChatHistory(message);
        fetchChatMessages(selectedEventId);
      } else {
        getContactsList();
      }
    });
    return () => {
      // Clean up the socket listener on component unmount
      socket.off("message recieved");
    };
  }, [selectedEventId]);

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
    (roomId, eventId) => {
      navigate(`${ServerVariables.userVideoCallRoom}/${roomId}/${eventId}`);
    },
    [navigate]
  );

  return (
    <div className="flex">
      <UserSidebar />
      <div className="flex-grow flex-shrink min-h-screen ml-4">
        <div className="flex h-screen">
          {/* contacts */}
          <div className="myDivBg w-1/3 border-r myBorder">
            <div className="myTextColor font-bold flex gap-4 p-4 my-2">
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
                    : item?.title?.toLowerCase().includes(searched);
                })
                .map((contact) => (
                  <div
                    key={contact._id}
                    onClick={() => handleClickContact(contact._id)}
                    className={
                      "py-2 pl-4 border-0 border-gray-100 flex items-center gap-2 cursor-pointer " +
                      (contact._id === selectedEventId ? "activeBg" : "")
                    }
                  >
                    {contact._id === selectedEventId && (
                      <div className="bg-blue-500 w-1 h-12 rounded-r-md"></div>
                    )}

                    <div className="flex gap-4 py-2 pl-4 items-center">
                      <Avatar profile={contact?.profile} />
                      <span className="myTextColor">
                        {contact.title}
                      </span>
                      {contact?.unseenMessagesCount > 0 && (
                        <span className="bg-green-500 text-white w-5 h-5 flex items-center justify-center rounded-full">
                          {contact?.unseenMessagesCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))
            ) : (
              <p className="myTextColor p-2">no following events to chat</p>
            )}
          </div>

          {/*  chat header */}

          <div className="flex flex-col  w-2/3 px-2">
            <div className="flex-grow">
              {selectedEventId ? (
                <div className="myDivBg border-b myBorder py-4 pl-4 flex items-center gap-4 cursor-pointer justify-between">
                  <Avatar profile={chatPartner?.eventId?.profile} />
                  <div className="myTextColor font-bold text-lg">
                    {chatPartner?.eventId?.title}
                  </div>
                  <FaVideo
                    onClick={() =>
                      handleVideoClick(
                        chatPartner?.userId?._id,
                        chatPartner?.eventId?._id
                      )
                    }
                    className="myTextColor w-8 h-8 mr-2"
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



            {/* chats  */}
            <div className="relative h-full">
              <div
                className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2"
                ref={chatContainerRef}
              >
                {chatHistory?.map((message) => {
                  const isUserChat = message.senderId === message.userId;
                  const timeAgo = formatDistanceToNow(new Date(message.time), {
                    addSuffix: true,
                  });
                  return (
                    <div
                      key={message._id}
                      className={
                        isUserChat ? "text-right mx-8" : "text-left mx-8"
                      }
                    >
                      <div
                        className={
                          "text-left inline-block p-2 my-2 rounded-md text-sm " +
                          (isUserChat
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

            {!!selectedEventId && (
              <div className="flex gap-2 mx-2 p-2">
                <input
                  type="text"
                  ref={inputRef}
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="message..."
                  className="myDivBg border p-2 flex-grow rounded-sm text-[#5A91E2]"
                />
                <button
                  onClick={() => sendMessage(chatPartner._id, selectedEventId)}
                  className="bg-blue-700 p-2 text-white"
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
  );
}

export default Chat;

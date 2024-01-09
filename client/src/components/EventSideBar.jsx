import React, { useEffect, useState } from "react";
import { ServerVariables } from "../utils/ServerVariables";
import HomeIcon from "./icons/HomeIcon";
import SidebarItem from "./SidebarItem";
import MessageIcon from "./icons/MessageIcon";
import NotificationIcon from "./icons/NotificationIcon";
import ProfileIcon from "./icons/ProfileIcon";
import LogoutIcon from "./icons/LogoutIcon";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/slices/EventAuthSlice";
import SubscribePlanIcon from "./icons/SubscribePlanIcon";
import { eventRequest } from "../Helper/instance";
import { apiEndPoints } from "../utils/api";
import socket from "../components/User/SocketIo";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import CallRequest from "./CallRequest";
import Modal from "react-modal";

function EventSideBar() {
  const { event } = useSelector((state) => state.EventAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("Home");
  const [CallModalOpen, setCallModalOpen] = useState(false);
  const [sender, setSender] = useState({});
  const [meetlink, setMeetlink] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { clicked } = location.state;
      setActiveItem(clicked);
    }
  }, []);

  useEffect(() => {
    socket.on("eventNotification", (notification) => {
      toast.success(notification.message, { duration: 5000 });
    });

    socket.on("videoCallInvite", (data) => {
      setSender(data?.sender);
      setMeetlink(data?.meetlink);
      setCallModalOpen(true);
    });

    return () => {
      socket.off("eventNotification");
      socket.off("videoCallInvite");
    };
  }, []);

  useEffect(() => {
    eventRequest({
      url: apiEndPoints.getNotificationsCount,
      method: "get",
    })
      .then((res) => {
        setNotificationsCount(res.data.count);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [notificationsCount]);

  const sideBarItems = [
    {
      label: "Home",
      icon: <HomeIcon />,
      onclick: () => {
        navigate(ServerVariables.eventHome, { state: { clicked: "Home" } });
      },
    },
    {
      label: "Messages",
      icon: <MessageIcon />,
      onclick: () => {
        navigate(ServerVariables.eventChats, {
          state: { clicked: "Messages" },
        });
      },
    },
    {
      label: "Notifications",
      icon: <NotificationIcon />,
      onclick: () => {
        navigate(ServerVariables.eventNotifications, {
          state: { clicked: "Notifications" },
        });
      },
    },
    {
      label: "Jobs Requests",
      icon: <ProfileIcon />,
      onclick: () => {
        navigate(ServerVariables.eventProfile, {
          state: { clicked: "Job Requests" },
        });
      },
    },
    {
      label: "Subscriptions",
      icon: <SubscribePlanIcon />,
      onclick: () => {
        navigate(ServerVariables.PlansAvailable, {
          state: { clicked: "Subscriptions" },
        });
      },
    },
    {
      label: "Logout",
      icon: <LogoutIcon />,
      href: ServerVariables.eventHome,
      onclick: () => {
        dispatch(logout());
      },
    },
  ];

  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "30%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const closeModal = () => {
    socket.emit("videoCallResponse", {
      userId: sender._id,
      accepted: false,
    });
    setCallModalOpen(false);
  };

  return (
    <>
      <div className="flex-col w-[300px] hidden md:flex min-h-screen flex-shrink-0 border-r-2 border-[#E0CDB6]">
        <div className="flex gap-2 mt-2">
          <img
            className="w-8 h-8 rounded-full"
            src={`http://localhost:5000/profiles/${event?.profile}`}
            alt=""
          />
          <h1 className="uppercase text-3xl font-thin text-[#FFB992] mx-2">
            EventSphere
          </h1>
        </div>
        <div className="mt-8">
          {sideBarItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              onClick={item?.onclick}
              NotfCount={notificationsCount}
              clickedOn={activeItem}
            />
          ))}
        </div>
      </div>
      <Modal
        isOpen={CallModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={customStyles}
      >
        {/* Use the CommentModal component */}
        <CallRequest
          isOpen={CallModalOpen}
          closeModal={closeModal}
          sender={sender}
          link={meetlink}
        />
      </Modal>
    </>
  );
}

export default EventSideBar;

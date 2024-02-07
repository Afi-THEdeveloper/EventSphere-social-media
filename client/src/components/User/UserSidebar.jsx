import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/slices/AuthSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { ServerVariables } from "../../utils/ServerVariables";
import socket from "../../components/User/SocketIo";
import HomeIcon from "../icons/HomeIcon";
import MessageIcon from "../icons/MessageIcon";
import SearchIcons from "../icons/SearchIcons";
import ExploreIcon from "../icons/ExploreIcon";
import LogoutIcon from "../icons/LogoutIcon";
import ProfileIcon from "../icons/ProfileIcon";
import NotificationIcon from "../icons/NotificationIcon";
import SidebarItem from "../SidebarItem";
import toast from "react-hot-toast";
import Modal from "react-modal";
import CallRequest from "../CallRequest";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import UserCard from "../UserCard";

function UserSidebar() {
  const { user } = useSelector((state) => state.Auth);
  const [activeItem, setActiveItem] = useState(null);
  const [sender, setSender] = useState({});
  const [meetlink, setMeetlink] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const [CallModalOpen, setCallModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  let ExtraPagePaths = [
    ServerVariables.editUser,
    ServerVariables.editJobProfile,
  ];

  useEffect(() => {
    if (location.state) {
      const { clicked } = location.state;
      setActiveItem(clicked);
    } else if (ExtraPagePaths.includes(location?.pathname)) {
      setActiveItem("Profile");
    }
  }, []);

  useEffect(() => {
    console.log("socket", socket);
    socket.on("userNotification", (notification) => {
      toast.success(notification.message, { duration: 5000 });
    });

    socket.on("videoCallInvite", (data) => {
      setSender(data?.sender);
      setMeetlink(data?.meetlink);
      setCallModalOpen(true);
    });

    return () => {
      socket.off("userNotification");
      socket.off("videoCallInvite");
    };
  }, []);

  useEffect(() => {
    userRequest({
      url: apiEndPoints.getUserNotificationsCount,
      method: "get",
    })
      .then((res) => {
        setNotificationsCount(res.data.count);
        if (location.pathname !== ServerVariables.chatPage) {
          setMsgCount(res.data?.MsgCount);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [notificationsCount, msgCount]);

  const sideBarItems = [
    {
      label: "Home",
      icon: <HomeIcon />,
      onclick: () => {
        navigate(ServerVariables.UserHome, { state: { clicked: "Home" } });
      },
    },
    {
      label: "Explore",
      icon: <ExploreIcon />,
      onclick: () => {
        navigate(ServerVariables.explore, { state: { clicked: "Explore" } });
      },
    },
    {
      label: "Search",
      icon: <SearchIcons />,
      onclick: () => {
        navigate(ServerVariables.searchEvent, { state: { clicked: "Search" } });
      },
    },
    {
      label: "Messages",
      icon: <MessageIcon />,
      href: ServerVariables.chatPage,
      onclick: () => {
        navigate(ServerVariables.chatPage, { state: { clicked: "Messages" } });
      },
    },
    {
      label: "Notifications",
      icon: <NotificationIcon />,
      onclick: () => {
        navigate(ServerVariables.userNotifications, {
          state: { clicked: "Notifications" },
        });
      },
    },
    {
      label: "Jobs",
      icon: <ProfileIcon />,
      onclick: () => {
        navigate(ServerVariables.showJobs, {
          state: { clicked: "Jobs" },
        });
      },
    },
    {
      label: "Profile",
      icon: <ProfileIcon />,
      onclick: () => {
        navigate(ServerVariables.userProfile, {
          state: { clicked: "Profile" },
        });
      },
    },
    {
      label: "Logout",
      icon: <LogoutIcon />,
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
      eventId: sender?._id,
      accepted: false,
    });
    setCallModalOpen(false);
  };

  return (
    <>
      <div className="border-r myBorder flex-col w-[300px] hidden md:flex min-h-screen flex-shrink-0">
        <div className="flex gap-2 mt-2">
          <h1 className="myTextColor uppercase text-2xl font-serif mx-6 cursor-pointer" onClick={()=> navigate(ServerVariables.UserHome)}>
            EventSphere
          </h1>
        </div>
        <div className="flex gap-2 mt-2">
          <UserCard
            profile={user?.profile}
            username={user?.username}
            email={user?.email}
            role={'user'}
          />
        </div>
        <div className="mt-8">
          {sideBarItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              href={item.href}
              label={item.label}
              onClick={item?.onclick}
              NotfCount={notificationsCount}
              MsgCount={msgCount}
              clickedOn={activeItem}
            />
          ))}
        </div>
      </div>
      {/* for small screens */}
      {/* <div className="relative myDivBg h-screen sm:block md:hidden lg:hidden mr-[14vh] ml-0">
        <nav className="myDivBg z-20 flex shrink-0 grow-0 justify-around gap-4 border-t  p-2.5 shadow-lg backdrop-blur-lg border-slate-600/60 fixed top-2/4 -translate-y-2/4 left-6 min-h-[auto] min-w-[64px] flex-col rounded-lg border">
          {sideBarItems.map((item) => (
            <div
              key={item.label}
              className={`myTextColor myHover cursor-pointer  flex aspect-square min-h-[32px] w-16 flex-col items-center justify-center gap-1 rounded-md p-1.5 ${
                activeItem === item.label && "activeBg"
              }`}
              onClick={() => {
                setActiveItem(item.label);
                item.onclick();
              }}
            >
              {item.label === "Notifications" && notificationsCount > 0 && (
                <div className="text-xs absolute left-0 mb-8 ml-4 bg-red-500 myTextColor w-4 h-4 flex items-center justify-center rounded-full">
                  {notificationsCount}
                </div>
              )}
              {item.label === "Messages" && msgCount > 0 && (
                <div className="text-xs absolute left-0 mb-8 ml-4 bg-red-500 myTextColor w-4 h-4 flex items-center justify-center rounded-full">
                  {msgCount}
                </div>
              )}
              {item.icon}
              <small className="text-center text-xs font-medium">
                {item.label}
              </small>
              <hr className="dark:border-gray-700/60" />
            </div>
          ))}
        </nav>
      </div> */}
      
      <Modal
        isOpen={CallModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={customStyles}
      >
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

export default UserSidebar;

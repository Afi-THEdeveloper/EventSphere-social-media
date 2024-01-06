import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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

function UserSidebar() {
  const [activeItem, setActiveItem] = useState("Home");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let ExtraPagePaths = [
    ServerVariables.editUser,
    ServerVariables.editJobProfile,
  ];

  useEffect(() => {
    // Handle the notification event
    socket.on("userNotification", (notification) => {
      toast.success(notification.message, { duration: 5000 });
    });

    return () => {
      socket.off("userNotification");
    };
  }, []);

  useEffect(() => {
    if (location.state) {
      const { clicked } = location.state;
      setActiveItem(clicked);
    } else if (ExtraPagePaths.includes(location?.pathname)) {
      setActiveItem("Profile");
    }
  }, []);



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
        navigate(ServerVariables.UserHome, { state: { clicked: "Explore" } });
      },
    },
    {
      label: "Search",
      icon: <SearchIcons />,
      onclick: () => {
        navigate(ServerVariables.UserHome, { state: { clicked: "Search" } });
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
        navigate(ServerVariables.UserHome, {
          state: { clicked: "Notifications" },
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

  return (
    <div className="flex-col w-[300px] hidden md:flex min-h-screen flex-shrink-0 border-r-[0.5px] border-[#E0CDB6]">
      <h1 className="uppercase text-3xl font-thin text-[#FFB992] mt-2 mx-2">
        EventSphere
      </h1>
      <div className="mt-8">
        {sideBarItems.map((item) => (
          <SidebarItem
            key={item.label}
            icon={item.icon}
            href={item.href}
            label={item.label}
            onClick={item?.onclick}
            clickedOn={activeItem}
          />
        ))}
      </div>
    </div>
  );
}

export default UserSidebar;

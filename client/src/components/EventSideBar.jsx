import React from "react";
import { ServerVariables } from "../utils/ServerVariables";
import HomeIcon from "./icons/HomeIcon";
import SidebarItem from "./SidebarItem";
import MessageIcon from "./icons/MessageIcon";
import NotificationIcon from "./icons/NotificationIcon";
import ProfileIcon from "./icons/ProfileIcon";
import LogoutIcon from "./icons/LogoutIcon";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/slices/EventAuthSlice";
import SubscribePlanIcon from "./icons/SubscribePlanIcon";
import { useNavigate } from "react-router-dom";

function EventSideBar() {
  const dispatch = useDispatch() 
  const sideBarItems = [
    {
      label: "Home",
      icon: <HomeIcon />,
      href: ServerVariables.eventHome,
    },
    {
      label: "Messages",
      icon: <MessageIcon />,
      href: ServerVariables.eventChats,
    },
    {
      label: "Notifications",
      icon: <NotificationIcon />,
      href: ServerVariables.eventHome,
    },
    {
      label: "Jobs Requests",
      icon: <ProfileIcon />,
      href: ServerVariables.eventProfile,
    },
    {
      label: "Subscriptions",
      icon: <SubscribePlanIcon />,
      href: ServerVariables.PlansAvailable,
    },
    {
      label: "Logout",
      icon: <LogoutIcon />,
      href: ServerVariables.eventHome,
      onclick:()=>{
        dispatch(logout())
      },
    },
    
  ];

  return (
    <div className="flex-col w-[300px] hidden md:flex min-h-screen flex-shrink-0 border-r-2 border-[#E0CDB6]">
      <h1 className="uppercase text-3xl font-thin text-[#FFB992] mt-2 mx-2">EventSphere</h1>
      <div className="mt-8">
        {sideBarItems.map((item) => (
          <SidebarItem key={item.label} icon={item.icon} href={item.href} label={item.label} onClick={item?.onclick} />
        ))}
      </div>
    </div>
  );
}

export default EventSideBar;

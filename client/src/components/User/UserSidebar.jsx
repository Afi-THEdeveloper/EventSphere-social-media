import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../utils/ServerVariables";
import HomeIcon from "../icons/HomeIcon";
import MessageIcon from "../icons/MessageIcon";
import SearchIcons from "../icons/SearchIcons";
import ExploreIcon from "../icons/ExploreIcon";
import LogoutIcon from "../icons/LogoutIcon";
import ProfileIcon from "../icons/ProfileIcon";
import NotificationIcon from "../icons/NotificationIcon";
import SidebarItem from "../SidebarItem";

function UserSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sideBarItems = [
    {
      label: "Home",
      icon: <HomeIcon />,
      href: ServerVariables.UserHome,
    },
    {
      label: "Explore",
      icon: <ExploreIcon />,
      href: ServerVariables.UserHome,
    },
    {
      label: "Search",
      icon: <SearchIcons />,
      href: ServerVariables.UserHome,
    },
    {
      label: "Messages",
      icon: <MessageIcon />,
      href: ServerVariables.UserHome,
    },
    {
      label: "Notifications",
      icon: <NotificationIcon />,
      href: ServerVariables.UserHome,
    },
    {
      label: "Profile",
      icon: <ProfileIcon />,
      href: ServerVariables.UserHome,
    },
    {
      label: "Logout",
      icon: <LogoutIcon />,
      href: ServerVariables.UserHome,
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
          />
        ))}
      </div>
    </div>
  );
}

export default UserSidebar;

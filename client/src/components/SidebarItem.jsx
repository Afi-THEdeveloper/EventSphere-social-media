import React from "react";
import { Link } from "react-router-dom";

function SidebarItem({ icon, href, label,...props }) {
  return (
    <Link
      {...props}
      className="h-12 flex w-full px-4 py-8 hover:bg-[#474440] items-center text-[#E0CDB6]"
      to={href}
    >
      {icon}
      <span className="text-sm font-semibold ml-2">{label}</span>
    </Link>
  );
}

export default SidebarItem;

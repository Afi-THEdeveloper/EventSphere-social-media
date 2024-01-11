import React from "react";


function SidebarItem({
  icon,
  href,
  label,
  NotfCount,
  MsgCount,
  clickedOn,
  ...props
}) {
  let background = "";
  if (clickedOn === label) {
    background = "activeBg";
  }
  return (
    <>
      <button
        {...props}
        className={
          "h-12 flex w-full px-4 py-8 hover:bg-[#0F1015] items-center myTextColor " +
          background
        }
      >
        {label === "Notifications" && NotfCount > 0 && (
          <div className="absolute left-0 ml-2 mt-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full">
            {NotfCount}
          </div>
        )}
        {label === "Messages" && MsgCount > 0 && (
          <div className="absolute left-0 ml-2 mt-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full">
            {MsgCount}
          </div>
        )}
        {icon}
        <span className="text-sm font-semibold ml-2">{label}</span>
      </button>
    </>
  );
}

export default SidebarItem;

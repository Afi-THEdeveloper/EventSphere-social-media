import React from "react";
import { API_BASE_URL } from "../config/api";

function Avatar({ profile }) {

  return (
    <div className={"w-10 h-10 relative rounded-full flex items-center"}>
      <div className="w-full rounded-full ">
        <img
          src={`${API_BASE_URL}/profiles/${profile}`}
          className="h-10 w-10 rounded-full object-cover border-2 myBorder"
          alt="profile"
        />
      </div>
    </div>
  );
}

export default Avatar;

import React from "react";

function Avatar({ profile }) {

  return (
    <div className={"w-10 h-10 relative rounded-full flex items-center"}>
      <div className="w-full rounded-full ">
        <img
          src={`http://localhost:5000/profiles/${profile}`}
          className="h-10 w-10 rounded-full object-cover border-2 myBorder"
          alt="profile"
        />
      </div>
    </div>
  );
}

export default Avatar;

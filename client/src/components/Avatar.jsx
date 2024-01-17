import React from "react";

function Avatar({ profile }) {
  // const colors = [
  //   "bg-red-200",
  //   "bg-green-200",
  //   "bg-purple-200",
  //   "bg-pink-200",
  //   "bg-blue-200",
  //   "bg-yellow-200",
  //   "bg-teal-200",
  // ];

  // const userIdBaseId = parseInt(userId, 16);
  // const colorIndex = userIdBaseId % colors.length;
  // const color = colors[colorIndex];
  // console.log(color);
  return (
    <div className={"w-10 h-10 relative rounded-full flex items-center"}>
      <div className="w-full rounded-full ">
        <img
          src={`http://localhost:5000/profiles/${profile}`}
          className="h-10 w-10 rounded-full object-cover border-2 myBorder"
          alt="profile"
        />
      </div>
      {/* {online && (
        <div className="absolute w-3 h-3 bg-green-400 bottom-0 right-0 rounded-full border border-white"></div>
      )}
      {!online && (
        <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
      )} */}
    </div>
  );
}

export default Avatar;

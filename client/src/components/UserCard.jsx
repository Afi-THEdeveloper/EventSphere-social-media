import React from "react";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";

const UserCard = ({ profile, username, email, role }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (role === "user") {
      navigate(ServerVariables.userProfile);
    } else if (role === "event") {
      navigate(ServerVariables.eventHome);
    }
  };
  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between px-6 py-5"
    >
      <div className="flex items-center mr-5">
        <div className="mr-5">
          <div className="inline-block relative shrink-0 cursor-pointer rounded-[.95rem]">
            <img
              className="w-[40px] h-[40px] shrink-0 inline-block rounded-[.95rem]"
              src={`http://localhost:5000/profiles/${profile}`}
              alt="avatar image"
            />
          </div>
        </div>
        <div className="mr-2">
          <a
            href="javascript:void(0)"
            className="myTextColor transition-colors duration-200 ease-in-out text-[1.075rem] font-medium  text-secondary-inverse"
          >
            {username}
          </a>
          <span className="myPara font-medium block text-[0.85rem]">
            {email}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

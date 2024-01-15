import React from "react";
import { Link } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";

function ProfileCard2({
  item,
  currentUser,
  follow,
  unfollow,
  viewProfile,
  role,
  bgColor,
  textColor,
}) {
  return (
    <>
      <li
        className={`${bgColor} col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg  text-center shadow`}
      >
        <div className="flex flex-1 flex-col p-8">
          <img
            className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
            src={`http://localhost:5000/profiles/${item?.profile}`}
            alt="http://localhost:5000/profiles/avatar.png"
            onClick={viewProfile}
          />
          <h2 onClick={viewProfile} className="myTextColor mt-6 text-lg font-medium cursor-pointer">{item?.title}</h2>
          <dl className="mt-1 flex flex-grow flex-col justify-between">

            {role === "user" ? (
              <dd className="mt-3">
                {currentUser?.following?.includes(item._id) ? (
                  <div
                    onClick={unfollow}
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-[#6c718f] cursor-pointer`}
                  >
                    <small className={`${textColor}`}>Unfollow</small>
                  </div>
                ) : (
                  <div
                    onClick={follow}
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-[#6c718f] cursor-pointer`}
                  >
                    <small className={`${textColor}`}>Follow</small>
                  </div>
                )}
              </dd>
            ) : (
              <dd className="mt-3">
                <span
                  className={`inline-flex items-center rounded-full bg-${textColor} px-2 py-1 text-xs font-medium text-${
                    textColor === "green" ? "700" : "white"
                  } ring-1 ring-inset ring-green-600/20 cursor-pointer`}
                >
                  following
                </span>
              </dd>
            )}
          </dl>
        </div>
      </li>
    </>
  );
}

export default ProfileCard2;

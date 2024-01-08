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
        className={`col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-${bgColor} text-center shadow`}
      >
        <div className="flex flex-1 flex-col p-8">
          <img
            className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
            src={`http://localhost:5000/profiles/${item?.profile}`}
            alt="http://localhost:5000/profiles/avatar.png"
          />
          <h3 className="mt-6 text-lg font-medium text-white">{item?.title}</h3>
          <dl className="mt-1 flex flex-grow flex-col justify-between">
            {/* <dt className="sr-only">Title</dt> */}
            {/* <dd className="text-sm text-gray-500">{title}</dd> */}
            {role === "user" ? (
              <dd className="mt-3">
                {currentUser?.following?.includes(item._id) ? (
                  <span
                    onClick={unfollow}
                    className={`inline-flex items-center rounded-full bg-${textColor} px-2 py-1 text-xs font-medium text-${
                      textColor === "green" ? "700" : "white"
                    } ring-1 ring-inset ring-green-600/20 cursor-pointer`}
                  >
                    Unfollow
                  </span>
                ) : (
                  <span
                    onClick={follow}
                    className={`inline-flex items-center rounded-full bg-${textColor} px-2 py-1 text-xs font-medium text-${
                      textColor === "green" ? "700" : "white"
                    } ring-1 ring-inset ring-green-600/20 cursor-pointer`}
                  >
                    Follow
                  </span>
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
        <div>
          <div className="-mt-px flex">
            <div className="flex w-0 flex-1">
              <button
                onClick={viewProfile}
                className={`relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-white`}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </li>
    </>
  );
}

export default ProfileCard2;

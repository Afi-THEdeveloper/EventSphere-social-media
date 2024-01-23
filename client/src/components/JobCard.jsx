import React from "react";
import Button2 from "./Button2";
import { formatDistanceToNow } from "date-fns";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";
import ErrorStyle from "./ErrorStyle";
import EditIcon from "./icons/EditIcon";
import { TrashIcon } from "@heroicons/react/24/outline";

const JobCard = ({
  jobPost,
  handleApply,
  role,
  userId,
  onDelete,
  onBlock,
  showStats,
  handleAccept,
}) => {
  const navigate = useNavigate();
  const formatTime = (dateString) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
    });
  };
  const handleEditClick = () => {
    navigate(ServerVariables.editJobPost, { state: { jobPost } });
  };

  return (
    <>
      <div className="myDivBg border myBorder p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
        <div className="flex justify-between">
          <h2 className="text-xl myTextColor font-semibold mb-4">
            {jobPost?.title}
            {role === 'user' && <p className="text-sm myPara">{jobPost?.eventId?.title}</p>}
          </h2>
          <small className="myPara mb-4 max-w-10">
            Posted on: {formatTime(jobPost?.createdAt)}
          </small>
        </div>
        <span className="myTextColor flex justify-between">
          <p className="flex">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
            {jobPost?.experience} years
          </p>
          <p className="flex">
            <LiaRupeeSignSolid className="w-5 h-5 " />
            {jobPost?.salary}
          </p>
          <p className="flex">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>

            {jobPost?.location}
          </p>
        </span>
        <span className="myTextColor flex justify-between">
          {jobPost?.vaccancies > 0 ? (
            <p>{jobPost?.vaccancies} vaccancies</p>
          ) : (
            <ErrorStyle error={"no vaccancies"} />
          )}
          <p>{jobPost?.jobType}</p>
        </span>
        <p className="myTextColor">skills : {jobPost?.skills}</p>
        <small className="myPara mb-2 max-w-10">
          {jobPost?.JobDescription}
        </small>

        {/* event side */}
        {role === "event" && (
          <span className="flex justify-between m-2">
            <EditIcon className="myTextColor" onClick={handleEditClick} />
            {!jobPost?.isBlocked ? (
              <Button2 text={"block"} onClick={onBlock} />
            ) : (
              <button
                onClick={onBlock}
                type="button"
                className="border border-red-900 rounded-md bg-[#1F2937] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0f1015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Unblock
              </button>
            )}
            <Button2 text={"stats"} onClick={showStats} />
            <TrashIcon className="myTextColor h-6 w-6" onClick={onDelete} />
          </span>
        )}

        {/* user side  */}
        {role === "user" && !jobPost?.appliedUsers.includes(userId) && !jobPost?.acceptedUsers.includes(userId) &&(
          <span className="flex justify-end m-2">
            <Button2 text={"Apply"} onClick={handleApply} />
          </span>
        )}
        {role === "user" && jobPost?.appliedUsers.includes(userId) && (
          <span className="myTextColor flex justify-end m-2">Applied</span>
        )}
        

        {/*reviewUser by event */}
        {role === "reviewUser" && !jobPost?.acceptedUsers.includes(userId) && (
          <span className="flex justify-end m-2">
            <Button2 text={"Accept request"} onClick={handleAccept} />
          </span>
        )}
      </div>
    </>
  );
};

export default JobCard;

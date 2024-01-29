import React from "react";
import { LiaRupeeSignSolid } from "react-icons/lia";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";
import { API_BASE_URL } from "../config/api";

const JobCard2 = ({ job }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() =>
        navigate(ServerVariables.jobDetails, { state: { jobDetails: job } })
      }
      className="w-full px-4 py-2 myHover"
    >
      <div className="activeBg relative flex flex-col min-w-0 break-words rounded-lg mb-6 xl:mb-0 shadow-lg">
        <div className="flex-auto p-4">
          <div className="flex flex-wrap">
            <div className="relative w-full pr-4 max-w-full flex-grow flex-1">
              <span className="myTextColor text-lg">{job?.title}</span>
              <p className="myPara text-sm">{job?.eventId?.title}</p>
            </div>
            <div className="relative w-auto pl-4 flex-initial">
              <div className="text-center inline-flex items-center justify-center w-8 h-8 shadow-lg rounded-full">
                <img
                  src={`${API_BASE_URL}/profiles/${job?.eventId?.profile}`}
                  alt=""
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-blueGray-500 mt-4">
            <span className="myTextColor mr-2 flex justify-between">
              <span className="myTextColor whitespace-nowrap">
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
                  {job?.experience} years
                </p>
              </span>
              <div className="flex">
                <LiaRupeeSignSolid className="w-4 h-4" />
                {job?.salary}
              </div>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobCard2;

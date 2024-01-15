import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import UserRightbar from "../../components/User/UserRightbar";
import { useLocation, useNavigate } from "react-router-dom";
import JobCard from "../../components/JobCard";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { ServerVariables } from "../../utils/ServerVariables";
import { useSelector } from "react-redux";

function JobDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const job = location?.state ? location.state.jobDetails : {};
  const { user } = useSelector((state) => state.Auth);
  const applyJob = (jobId) => {
    userRequest({
      url: apiEndPoints.applyJob,
      method: "post",
      data: { jobId },
    })
      .then((res) => {
        toast.success(res.data.success);
        navigate(ServerVariables.UserHome);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      <div className="flex">
        <UserSidebar />

        <div className="flex-grow flex-shrink min-h-screen mx-4 mt-[30vh]">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mx-16">
            <JobCard
              role="user"
              userId={user?._id}
              jobPost={job}
              handleApply={() => {
                applyJob(job?._id);
              }}
            />
          </div>
        </div>

        <UserRightbar />
      </div>
    </>
  );
}

export default JobDetails;

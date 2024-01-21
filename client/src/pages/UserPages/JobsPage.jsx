import React, { useEffect, useState } from "react";
import UserSideBar from "../../components/User/UserSidebar";
import JobCard from "../../components/JobCard";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button2 from "../../components/Button2";
import { ServerVariables } from "../../utils/ServerVariables";

function JobsPage() {
  const [jobPosts, setJobPosts] = useState([]);
  const { user } = useSelector((state) => state.Auth);
  const navigate = useNavigate();

  useEffect(() => {
    getJobPosts();
  }, []);
  const getJobPosts = () => {
    userRequest({
      url: apiEndPoints.getJobs,
      method: "get",
    })
      .then((res) => {
        setJobPosts(res.data.posts);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const applyJob = (jobId) => {
    userRequest({
      url: apiEndPoints.applyJob,
      method: "post",
      data: { jobId },
    })
      .then((res) => {
        toast.success(res.data.success);
        navigate(ServerVariables.jobStats);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  
  const showStats = () => {
    navigate(ServerVariables.jobStats);
  };

  return (
    <>
      <div className="flex">
        <UserSideBar />
        <div className="flex-grow flex-shrink min-h-screen">
          {/* hiring page header */}
          <div className="myDivBg flex justify-around text-center mx-16 p-2">
            <div className="m-4">
              <h2 className="myTextColor uppercase font-bold"> jobs</h2>
            </div>
            <div>
              <Button2 text={"stats"} onClick={showStats} />
            </div>
          </div>

          {/* job cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mx-16 my-4">
            {jobPosts.length ? (
              jobPosts.map((jobPost) => {
                return (
                  <JobCard
                    role="user"
                    jobPost={jobPost}
                    userId={user?._id}
                    handleApply={() => {
                      applyJob(jobPost?._id);
                    }}
                  />
                );
              })
            ) : (
              <div className="text-center myPara">
                <p>No jobs found</p>
                <small className="myPara">
                  (follow more events to explore more jobs)
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default JobsPage;

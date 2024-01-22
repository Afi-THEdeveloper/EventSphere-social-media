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
import Search1 from "../../components/Search1";
import Button1 from "../../components/Button1";

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
          <div className="myDivBg border-b myBorder flex justify-around text-center mx-16 p-2">
            <div className="m-4">
              <h2 className="myTextColor uppercase font-bold"> jobs</h2>
            </div>
            <div className="m-4">
              <Search1 search={"search jobs"} />
            </div>
            <div className="m-2">
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
              <div className="myPara text-center my-[40vh] ml-[10vh]">
                <p>No jobs found</p>
                <p className="myPara text-xs">
                  (follow more events to explore more jobs)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default JobsPage;

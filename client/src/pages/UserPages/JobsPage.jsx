import React, { useEffect, useState } from "react";
import UserSideBar from "../../components/User/UserSidebar";
import JobCard from "../../components/JobCard";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button2 from "../../components/Button2";
import { ServerVariables } from "../../utils/ServerVariables";
import Search1 from "../../components/Search1";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { MdAssignmentAdd } from "react-icons/md";

function JobsPage() {
  const [jobPosts, setJobPosts] = useState([]);
  const [searched, setSearched] = useState([]);
  const { user } = useSelector((state) => state.Auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getJobPosts();
  }, []);
  const getJobPosts = () => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getJobs,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        setJobPosts(res.data.posts);
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const applyJob = (jobId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.applyJob,
      method: "post",
      data: { jobId },
    })
      .then((res) => {
        dispatch(hideLoading());
        toast.success(res.data.success);
        navigate(ServerVariables.jobStats);
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const showStats = () => {
    navigate(ServerVariables.jobStats);
  };

  const handleSearch = () => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.UserSearchJob,
      method: "post",
      data: { searched },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setJobPosts(res.data.results);
          setSearched("");
        } else {
          dispatch(hideLoading());
          toast.error(res.data.error);
          setSearched("");
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      <div className="flex">
        <UserSideBar />
        {user?.isJobSeeker ? (
          <div className="flex-grow flex-shrink min-h-screen">
            {/* hiring page header */}
            <div className="myDivBg border-b myBorder flex justify-around text-center mx-16 p-2">
              <div className="m-4">
                <h2 className="myTextColor uppercase font-bold"> jobs</h2>
              </div>
              <div className="m-4">
                <Search1
                  search={"search jobs"}
                  value={searched}
                  onChange={(e) => setSearched(e.target.value)}
                />
                <span
                  onClick={handleSearch}
                  className="myTextColor cursor-pointer border myBorder p-[6px] rounded-lg"
                >
                  Search
                </span>
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
        ) : (
          <div className="myPara text-center my-[40vh] ml-[10vh]">
            <p>Job profile required</p>
            <p className="myPara text-xs">
              (Add job profile and can apply for jobs)
            </p>
            <a className="font-normal text-[#E0CDB6] text-xs">
              <Button2
                text={<MdAssignmentAdd />}
                onClick={() => navigate(ServerVariables.addJobProfile)}
              />
              <br />
              Add 
            </a>
          </div>
        )}
      </div>
    </>
  );
}

export default JobsPage;

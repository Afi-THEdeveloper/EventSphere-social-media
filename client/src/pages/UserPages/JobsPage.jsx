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
import UserNavbar from "../../components/User/UserNavbar";

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
      <UserNavbar />
      <div className="flex sm:max-w-full">
        <UserSideBar />
        {user?.isJobSeeker ? (
          <div className="flex-grow flex-shrink min-h-screen">
            {/* hiring page header */}
            <div className="myDivBg border-b myBorder text-center">
              <div className="m-4">
                <h2 className="myTextColor uppercase font-bold text-[0.5rem] sm:text-xs">
                  {" "}
                  jobs
                </h2>
              </div>

              <div className="m-2 flex justify-center">
                <div className="relative mb-4 flex  w-full sm:w-[50%] md:w-[60%] flex-wrap items-stretch">
                  <input
                    type="search"
                    className="myPara px-2 py-[0.25rem] relative m-0 -mr-0.5 block min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding  text-base font-normal leading-[1.6]  outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral dark:placeholder:text-dark-100 dark:focus:border-primary dark:focus:text-slate-300 dark:focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)]"
                    placeholder="Search jobs"
                    aria-label="Search"
                    aria-describedby="button-addon1"
                    value={searched}
                    onChange={(e) => setSearched(e.target.value)}
                  />

                  <button
                    className="relative z-[2] flex items-center rounded-r bg-primary px-2 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                    onClick={handleSearch}
                    type="button"
                    id="button-addon1"
                    data-te-ripple-init
                    data-te-ripple-color="light"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                <div className="my-2 sm:m-0">
                  <Button2 text={"stats"} onClick={showStats} />
                </div>
              </div>
            </div>

            {/* job cards */}
            <div className="grid grid-cols-1 md:grid-cols-1 2xl:grid-cols-2 gap-6 mx-2 md:mx-10 my-4">
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
                <div className="myPara text-center w-full  my-[30vh] ml-[-4vh] 2xl:ml-[50vh]">
                  <p>No jobs found</p>
                  <p className="myPara text-xs">
                    (follow more events to explore more jobs)
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="myPara text-center w-full  my-[30vh] ml-[-4vh] 2xl:ml-[50vh]">
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

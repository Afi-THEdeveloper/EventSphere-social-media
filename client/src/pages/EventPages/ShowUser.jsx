import React, { useEffect, useState } from "react";
import EventSideBar from "../../components/EventSideBar";
import { useLocation, useNavigate } from "react-router-dom";
import { ServerVariables } from "../../utils/ServerVariables";
import { FaFilePdf } from "react-icons/fa";
import Myh1 from "../../components/Myh1";
import { eventRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import JobCard from "../../components/JobCard";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { API_BASE_URL } from "../../config/api";

function ShowUser() {
  const [user, setUser] = useState({});
  const [userJobs, setUserJobs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const User = location?.state ? location.state.user : {};

  useEffect(() => {
    if (User) {
      setUser(User);
      userAppliedjobs(User._id);
    }
  }, [User]);

  const userAppliedjobs = (userId) => {
    eventRequest({
      url: apiEndPoints.userAppliedjobs,
      method: "post",
      data: { userId },
    })
      .then((res) => {
        if (res?.data?.jobs) {
          setUserJobs(res.data.jobs);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const AcceptJobRequest = async (jobId, userId) => {
    const result = await Swal.fire({
      title: "Accept Job Request",
      text: "Are you sure to accept user job request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1F2937",
      cancelButtonColor: "#d33",
      confirmButtonText: "Accept",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      dispatch(showLoading());
      eventRequest({
        url: apiEndPoints.acceptJobRequest,
        method: "patch",
        data: { jobId, userId },
      })
        .then((res) => {
          dispatch(hideLoading());
          toast.success(res.data.success);
          userAppliedjobs(userId);
        })
        .catch((err) => {
          dispatch(hideLoading());
          toast.error(err.message);
        });
    }
  };

  return (
    <>
      <div className="flex">
        <EventSideBar />

        <div className="flex-grow flex-shrink min-h-screen">
          <div className="myDivBg relative max-w-md mx-auto md:max-w-2xl min-w-0 break-words w-full mb-6 shadow-lg rounded-xl mt-20">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full flex justify-center">
                  <div className="relative">
                    <img
                      src={`${API_BASE_URL}/profiles/${user?.profile}`}
                      className="shadow-xl rounded-full align-middle absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]  border-2 border-[#E0CDB6]"
                      alt=""
                    />
                  </div>
                </div>
                <div className="w-full text-center mt-20">
                  <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                    <div className="p-3 text-center cursor-pointer">
                      <span className="text-xl font-bold block uppercase tracking-wide myTextColor hover:text-slate-200">
                        {user?.following?.length}
                      </span>
                      <span className="myTextColor text-sm  hover:text-slate-200">
                        Following
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2">
                <h3 className="text-2xl myTextColor font-bold leading-normal mb-1">
                  {user?.username}
                </h3>
                <div className="text-xs mt-0 mb-2 myTextColor font-bold uppercase">
                  <i className=" text-slate-400 opacity-75"></i>
                  {user?.phone}
                </div>
              </div>

              {user.isJobSeeker && (
                <div className="myBorder mt-6 py-6 border-t text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full px-4">
                      <h2 className="myTextColor font-medium">
                        Job profile and CV
                      </h2>
                      <p className="font-light leading-relaxed myPara mb-4">
                        <FaFilePdf
                          onClick={() =>
                            (window.location.href = `${API_BASE_URL}/files/${user?.jobProfile?.CV}`)
                          }
                          className="fill-slate-200 mx-[50%] h-8 w-8 mb-2"
                        />
                        {`Full name: ${user?.jobProfile?.fullName}, phone: ${user?.jobProfile?.phone}, skills: ${user?.jobProfile?.skills}`}{" "}
                        <br />
                        {`Job Role looking for : ${user?.jobProfile?.jobRole},year of Experience: ${user?.jobProfile?.yearOfExperience}`}{" "}
                        <br />
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* applied jobs */}
          <div className="text-center">
            {userJobs.length ? <h1 className="myTextColor">Applied for jobs posted by you</h1>:<p className="myPara">Not applied for any jobs</p>}
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mx-16 my-8">
              {userJobs.length &&
                userJobs.map((jobPost) => {
                  return (
                    <JobCard
                      role="reviewUser"
                      jobPost={jobPost}
                      userId={user?._id}
                      handleAccept={() =>
                        AcceptJobRequest(jobPost?._id, user?._id)
                      }
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowUser;

import React, { useEffect, useState } from "react";
import EventSideBar from "../../components/EventSideBar";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button2 from "../../components/Button2";
import Button1 from "../../components/Button1";
import { ServerVariables } from "../../utils/ServerVariables";
import { useNavigate } from "react-router-dom";
import Myh1 from "../../components/Myh1";
import JobCard from "../../components/JobCard";
import { eventRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import FollowerCard from "../../components/FollowerCard";

function HiringsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [jobPosts, setJobPosts] = useState([]);

  useEffect(() => {
    getJobPosts();
  }, []);

  const getJobPosts = () => {
    eventRequest({
      url: apiEndPoints.getJobPosts,
      method: "get",
    })
      .then((res) => {
        setJobPosts(res.data.posts);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const deleteJobPost = async (PostId) => {
    const result = await Swal.fire({
      title: "Delete post",
      text: "Are you sure to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1F2937",
      cancelButtonColor: "#d33",
      confirmButtonText: "delete",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      dispatch(showLoading());
      eventRequest({
        url: apiEndPoints.deleteJobPost,
        method: "delete",
        data: { id: PostId },
      })
        .then((res) => {
          dispatch(hideLoading());
          toast.success(res.data.success);
          getJobPosts();
        })
        .catch((err) => {
          dispatch(hideLoading());
          toast.error(err.message);
        });
    }
  };

  const blockJobPost = async (postId) => {
    const isBlocked = jobPosts.find((post) => post._id === postId)?.isBlocked;
    const result = await Swal.fire({
      title: isBlocked ? "Unblock Confirmation" : "Block Confirmation",
      text: isBlocked
        ? "Are you sure you want to Unblock this post?"
        : "Are you sure you want to Block this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isBlocked ? "Unblock" : "Block",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      dispatch(showLoading());

      eventRequest({
        url: apiEndPoints.blockJobPost,
        method: "patch",
        data: { id: postId },
      }).then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data.success);
          getJobPosts();
        } else {
          toast.error(res.data.error);
        }
      });
    }
  };

  const handleGetStatsClick = (jobId) => {
    navigate(`${ServerVariables.eventJobStats}/${jobId}`);
  };

  return (
    <>
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen">
          {/* hiring page header */}
          <div className="myDivBg flex justify-around text-center mx-16 p-2">
            <div className="m-4">
              <h2 className="myTextColor uppercase font-bold"> job posts</h2>
            </div>
            <div>
              <span className="font-bold block uppercase tracking-wide">
                <button
                  className="border p-3 rounded-full myHover"
                  onClick={() => navigate(ServerVariables.postJob)}
                >
                  <PlusIcon className="myPara h-4 w-4" />
                </button>
              </span>
              <span className="text-xs myTextColor uppercase">post job</span>
            </div>
          </div>

          {/* job cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mx-16 my-4">
            {jobPosts.length ? (
              jobPosts.map((jobPost) => {
                return (
                  <JobCard
                    role="event"
                    jobPost={jobPost}
                    onDelete={() => deleteJobPost(jobPost?._id)}
                    onBlock={() => blockJobPost(jobPost?._id)}
                    showStats={() => handleGetStatsClick(jobPost?._id)}
                  />
                );
              })
            ) : (
              <p className="myPara text-center py-8">No jobs posted by you</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default HiringsPage;

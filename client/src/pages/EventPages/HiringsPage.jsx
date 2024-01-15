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
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";

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

  return (
    <>
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen">
          <div className="text-center my-2">
            <Myh1 title={"Job posts"} />
          </div>

          {/* job cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mx-16">
            {jobPosts.map((jobPost) => {
              return (
                <JobCard
                  role="event"
                  jobPost={jobPost}
                  onDelete={() => deleteJobPost(jobPost?._id)}
                  onBlock={() => blockJobPost(jobPost?._id)}
                />
              );
            })}
          </div>
        </div>
        <div className="myDivBg w-[360px] hidden xl:block  min-h-screen flex-shrink">
          {/* add job post */}
          <div className="flex justify-between">
            <div className="p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide">
                <button
                  className="border p-4 rounded-full myHover"
                  onClick={() => navigate(ServerVariables.postJob)}
                >
                  <PlusIcon className="myPara h-4 w-4" />
                </button>
              </span>
              <span className="myTextColor">post job</span>
            </div>
            <span className="text-sm myTextColor m-4">
              <Button1 text={"Stats"} />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default HiringsPage;
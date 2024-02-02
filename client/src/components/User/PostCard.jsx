import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { BsBookmark } from "react-icons/bs";
import { BookmarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { SlUserFollow } from "react-icons/sl";
import { SlUserUnfollow } from "react-icons/sl";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { ServerVariables } from "../../utils/ServerVariables";
import { updateUser } from "../../Redux/slices/AuthSlice";
import { updateEvent } from "../../Redux/slices/EventAuthSlice";
import { motion } from "framer-motion";
import { API_BASE_URL } from "../../config/api";
import ReactPaginate from "react-paginate";
import { formatDistanceToNow } from "date-fns";

function PostCard() {
  const [EventPosts, setEventPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.Auth);
  const getFollowingPosts = () => {
    dispatch(showLoading());
    userRequest({
      url: `${apiEndPoints.getFollowingposts}?page=${currentPage + 1}`,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data?.success) {
          console.log(res?.data);
          setEventPosts(res.data.posts);
          setTotalPosts(res?.data?.totalPosts);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const getPosts = () => {
    dispatch(showLoading());
    userRequest({
      url: `${apiEndPoints.getEPosts}?page=${currentPage + 1}`,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data?.success) {
          console.log(res?.data);
          setEventPosts(res.data.posts);
          setTotalPosts(res?.data?.totalPosts);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (location.pathname === "/UserHome") {
      getFollowingPosts();
    } else {
      getPosts();
    }
  }, [currentPage]);

  const handleNextSetClick = () => {
    const newPageCount = pageCount + 1;
    setCurrentPage(newPageCount);
    setPageCount(newPageCount);
  };

  const handleLike = (postId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.likePost,
      method: "post",
      data: { postId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          if (location.pathname === "/UserHome") {
            getFollowingPosts();
          } else {
            getPosts();
          }
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const handleUnLike = (postId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.UnlikePost,
      method: "post",
      data: { postId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          if (location.pathname === "/UserHome") {
            getFollowingPosts();
          } else {
            getPosts();
          }
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const handleFollow = (eventId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.followEvent,
      method: "post",
      data: { eventId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          dispatch(updateUser(res.data.user));
          dispatch(updateEvent(res.data.event));
          if (location.pathname === "/UserHome") {
            getFollowingPosts();
          } else {
            getPosts();
          }
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const handleUnFollow = (eventId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.unfollowEvent,
      method: "post",
      data: { eventId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          dispatch(updateUser(res.data.user));
          dispatch(updateEvent(res.data.event));
          if (location.pathname === "/UserHome") {
            getFollowingPosts();
          } else {
            getPosts();
          }
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  return (
    <>
      {EventPosts &&
        EventPosts.map((post) => {
          return (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.012 }}
              className="myDivBg rounded-md shadow-md"
            >
              <div
                className="myDivBg border myBorder flex flex-col gap-2  mt-2 mx-4 rounded-xl p-[5px]"
                key={post._id}
              >
                {/* top div */}
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-row items-center gap-4">
                    <img
                      src={`${API_BASE_URL}/profiles/${post?.postedBy?.profile}`}
                      className="h-10 w-10 rounded-full object-cover border-2 myBorder"
                      alt="profile"
                    />
                    <span>
                      <h4
                        className="myTextColor font-bold cursor-pointer"
                        onClick={() =>
                          navigate(ServerVariables.showEvent, {
                            state: { event: post?.postedBy },
                          })
                        }
                      >
                        {post?.postedBy?.title}
                      </h4>
                      <small className="myPara">{post?.location}</small>
                    </span>
                  </div>
                  {user?.following?.includes(post?.postedBy?._id) ? (
                    <div>
                      <SlUserUnfollow
                        className="myTextColor w-6 h-6 mx-2 cursor-pointer"
                        onClick={() => handleUnFollow(post?.postedBy?._id)}
                      />
                      <small
                        className="myTextColor font-bold mr-2 cursor-pointer"
                        onClick={() => handleUnFollow(post?.postedBy?._id)}
                      >
                        Following
                      </small>
                    </div>
                  ) : (
                    <div>
                      <SlUserFollow
                        className="myTextColor w-6 h-6 mx-2 cursor-pointer"
                        onClick={() => handleFollow(post?.postedBy?._id)}
                      />
                      <small
                        className="myTextColor font-bold mr-2 cursor-pointer"
                        onClick={() => handleFollow(post?.postedBy?._id)}
                      >
                        Follow
                      </small>
                    </div>
                  )}
                </div>
                {/* post */}
                <div>
                  {post?.image && (
                    <img
                      src={`${API_BASE_URL}/Event/posts/${post?.image}`}
                      alt="image"
                    />
                  )}
                </div>
                {/* icons */}
                <div className="my-2 mx-4 mb-2 flex flow-row justify-between">
                  <div className="flex flex-row gap-4 items-center">
                    {post?.likes?.includes(user?._id) ? (
                      <FaHeart
                        className="w-7 h-7 fill-red-700"
                        onClick={() => handleUnLike(post._id)}
                      />
                    ) : (
                      <FaRegHeart
                        className="myTextColor w-7 h-7"
                        onClick={() => handleLike(post._id)}
                      />
                    )}
                    <FaRegComment
                      className="myTextColor w-7 h-7"
                      onClick={() =>
                        navigate(ServerVariables.postDetails, {
                          state: { postDetails: post },
                        })
                      }
                    />
                    {/* <FiSend className="w-7 h-7" /> */}
                  </div>
                  {/* <BookmarkIcon className="w-6 h-6" /> */}
                </div>
                <p
                  className="myTextColor font-bold mx-2 cursor-pointer"
                  onClick={() =>
                    navigate(ServerVariables.postDetails, {
                      state: { postDetails: post },
                    })
                  }
                >{`${post?.likes.length} likes   ${post?.commentsCount} comments`}</p>
                <div>
                  <p className="myPara">{post?.description}</p>
                  <small className="myPara text-xs">
                    {formatDistanceToNow(new Date(post?.createdAt), {
                      addSuffix: true,
                    })}
                  </small>
                </div>
              </div>
            </motion.div>
          );
        })}
      <ReactPaginate
        nextLabel={
          (currentPage + 1) * 3 < totalPosts ? (
            <div className="p-3 text-center">
              <span className="text-xl font-bold block uppercase tracking-wide">
                <button
                  className="border p-2 rounded-full hover:bg-[#0F1015]"
                  onClick={handleNextSetClick}
                >
                  <PlusIcon className="myPara h-3 w-3" />
                </button>
              </span>
            </div>
          ) : (
            <p className="myPara">No more posts</p>
          )
        }
        pageCount={pageCount}
        containerClassName="flex justify-center mt-4"
      />
    </>
  );
}

export default PostCard;

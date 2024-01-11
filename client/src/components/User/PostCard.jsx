import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { BsBookmark } from "react-icons/bs";
import { BookmarkIcon } from "@heroicons/react/24/outline";
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

function PostCard() {
  const [EventPosts, setEventPosts] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.Auth);
  const getFollowingPosts = () => {
    userRequest({
      url: apiEndPoints.getFollowingposts,
      method: "get",
    })
      .then((res) => {
        if (res.data?.success) {
          console.log(res?.data);
          setEventPosts(res.data.posts);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const getPosts = () => {
    userRequest({
      url: apiEndPoints.getEPosts,
      method: "get",
    })
      .then((res) => {
        if (res.data?.success) {
          console.log(res?.data);
          setEventPosts(res.data.posts);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    if (location.pathname === "/UserHome") {
      getFollowingPosts();
    } else {
      getPosts();
    }
  }, []);

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
            <div
              className="myDivBg flex flex-col gap-2  mt-2 mx-4 rounded-xl p-2"
              key={post._id}
            >
              {/* top div */}
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-center gap-4">
                  <img
                    src={`http://localhost:5000/profiles/${post?.postedBy?.profile}`}
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
                    src={`http://localhost:5000/Event/posts/${post?.image}`}
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
              </div>
            </div>
          );
        })}
    </>
  );
}

export default PostCard;

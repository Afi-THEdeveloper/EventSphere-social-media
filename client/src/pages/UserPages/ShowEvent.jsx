import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { ServerVariables } from "../../utils/ServerVariables";
import {  userRequest } from "../../Helper/instance";
import { SlUserFollow, SlUserUnfollow } from "react-icons/sl";
import { updateUser } from "../../Redux/slices/AuthSlice";
import { updateEvent } from "../../Redux/slices/EventAuthSlice";
import Myh1 from "../../components/Myh1";
import { API_BASE_URL } from "../../config/api";

function ShowEvent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [story, setStory] = useState([]);
  const [posts, setPosts] = useState([]);
  const [event, setEvent] = useState({});
  const location = useLocation();
  const { user } = useSelector((state) => state.Auth);
  const Event = location.state ? location?.state?.event : {};

  useEffect(() => {
    if (Event !== undefined) {
      setEvent(Event);
      getPostsinUser(Event._id);
      getEventStoryinUser(Event._id);
    } else {
      navigate(ServerVariables.UserHome);
    }
  }, []);


  const getPostsinUser = async (eventId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getEventPostsinUser,
      method: "post",
      data: { eventId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data?.success) {
          setPosts(res.data.posts);
        } else {
          toast.error(res.data?.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const getEventStoryinUser = (eventId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getEventStoryinUser,
      method: "post",
      data: { eventId },
    })
      .then((res) => {
        dispatch(hideLoading());
        setStory(res.data?.stories);
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const ProfileClickHandler = () => {
    if (story.length) {
      navigate(ServerVariables.storyCourosel, { state: { stories: story } });
    } else {
      toast.error("no stories exists");
    }
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
          getEventStoryinUser(eventId);
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
          getPostsinUser(eventId);
          getEventStoryinUser(eventId);
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
      <div className="flex">
        <UserSidebar />

        <div className="flex-grow flex-shrink min-h-screen">
          {/* profile card */}

          <div className="myDivBg relative max-w-md mx-auto md:max-w-2xl min-w-0 break-words  w-full mb-6 shadow-lg rounded-xl mt-20">
            <div className=" px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full flex justify-center">
                  <div className="relative">
                    <img
                      src={`${API_BASE_URL}/profiles/${event.profile}`}
                      className="shadow-xl rounded-full align-middle absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]  border-2 myBorder"
                      alt=""
                      onClick={ProfileClickHandler}
                    />
                  </div>
                </div>
                <div className="w-full text-center mt-20">
                  <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                    <div className="p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide myTextColor">
                        {posts?.length}
                      </span>
                      <span className="text-sm myTextColor">Posts</span>
                    </div>
                    <div className="p-3 text-center">
                      <span className="text-xl font-bold block uppercase tracking-wide myTextColor">
                        {event?.followers?.length}
                      </span>
                      <span className="text-sm myTextColor">Followers</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2">
                <h3 className="text-2xl myTextColor font-bold leading-normal mb-1">
                  {event?.title}
                </h3>
                <div className="text-xs mt-0 mb-2 myPara font-bold uppercase">
                  <i className="fas fa-map-marker-alt mr-2 opacity-75"></i>
                  {event?.place}
                </div>
              </div>
              <div className="mt-6 py-6 border-t myBorder text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full px-4">
                    <p className="font-light leading-relaxed myPara mb-4">
                      {`Owner:${event?.ownerName},services:${
                        event?.services
                      },phone:${event?.phone},${
                        event?.altPhone && event?.altPhone
                      },`}{" "}
                      <br />
                      {`officeAddress:${event?.officeAddress}`}
                    </p>

                    {user?.following?.includes(event?._id) ? (
                      <div>
                        <SlUserUnfollow
                          className="myTextColor w-6 h-6 cursor-pointer mx-[48%]"
                          onClick={() => handleUnFollow(event?._id)}
                        />
                        <small
                          className="myTextColor font-bold  cursor-pointer"
                          onClick={() => handleUnFollow(event?._id)}
                        >
                          Following
                        </small>
                      </div>
                    ) : (
                      <div>
                        <SlUserFollow
                          className="w-6 h-6  cursor-pointer fill-[#FFB992] mx-[48%]"
                          onClick={() => handleFollow(event._id)}
                        />
                        <small
                          className="text-[#FFB992] font-bold  cursor-pointer"
                          onClick={() => handleFollow(event._id)}
                        >
                          Follow
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* profile card end*/}

          {/* event posts */}
          <div className="text-center">
            <Myh1 title="posts" />
          </div>
          {posts.length ? (
            <div className="min-h-screen p-8">
              <div className="flex flex-wrap justify-center">
                {posts.map((post) => (
                  <div className="myDivBg shadow-lg rounded-lg overflow-hidden m-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
                    {post?.image && (
                      <img
                        className="w-full h-42 object-cover"
                        src={`${API_BASE_URL}/Event/posts/${post?.image}`}
                        alt={post.description}
                      />
                    )}

                    <div className="p-4">
                      <h2 className="myTextColor text-xl font-semibold mb-2">
                        {post.likes.length} likes
                      </h2>

                      <p
                        className="myPara hover:font-bold mb-2 cursor-pointer"
                        onClick={() =>
                          navigate(ServerVariables.postDetails, {
                            state: { postDetails: post },
                          })
                        }
                      >
                        {post?.commentsCount} comments
                      </p>
                      <p
                        className="myPara hover:font-bold  cursor-pointer"
                        onClick={() =>
                          navigate(ServerVariables.postDetails, {
                            state: { postDetails: post },
                          })
                        }
                      >
                        View
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-white mt-10">No posts yet..</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ShowEvent;

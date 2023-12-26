import React, { useEffect, useState } from "react";
import EventSideBar from "../../components/EventSideBar";
import PostsPage from "../../components/PostsPage";
import ProfileCard from "../../components/ProfileCard";
import Myh1 from "../../components/Myh1";
import { useDispatch, useSelector } from "react-redux";
import { ServerVariables } from "../../utils/ServerVariables";
import { eventRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";

function EventHome() {
  const [posts, setPosts] = useState([]);
  const [story,setStory] = useState([]);
  const dispatch = useDispatch();
  const {event} = useSelector(state => state.EventAuth)
  console.log('eventProfile',event)  

  useEffect(() => {
    getPosts(event._id);
    getEventStory(event._id);
  }, []);
  
  const getPosts = async (eventId) => {
    dispatch(showLoading());
    eventRequest({
      url: apiEndPoints.getEventPosts,
      method: "post",
      data:{eventId}
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

  const getEventStory = (eventId) => {
    dispatch(showLoading());
    eventRequest({
      url: apiEndPoints.getEventStory,
      method: "post",
      data: { eventId },
    })
      .then((res) => {
        dispatch(hideLoading());
        setStory(res.data.stories);
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  return (
    <>
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen">
            <ProfileCard event={event} postCount={posts.length} story={story}/>
            <div className="text-center"><Myh1 title='posts'/></div>
            <PostsPage AllPosts={posts}/>
        </div>
      </div>
    </>
  );
}

export default EventHome;

import React, { useEffect, useState } from "react";
import EventSideBar from "../../components/EventSideBar";
import PostsPage from "../../components/PostsPage";
import ProfileCard from "../../components/ProfileCard";
import Myh1 from "../../components/Myh1";
import { useSelector } from "react-redux";
import { ServerVariables } from "../../utils/ServerVariables";
import { eventRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";

function EventProfile() {
  const [posts, setPosts] = useState([]);
  const {event} = useSelector(state => state.EventAuth)
  console.log('eventProfile',event)  

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    eventRequest({
      url: apiEndPoints.getEventPosts,
      method: "get",
    })
      .then((res) => {
        if (res.data?.success) {
          setPosts(res.data.posts);
        } else {
          toast.error(res.data?.error);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen">
            <ProfileCard event={event} postCount={posts.length}/>
            <div className="text-center"><Myh1 title='posts'/></div>
            <PostsPage AllPosts={posts}/>
        </div>
      </div>
    </>
  );
}

export default EventProfile;

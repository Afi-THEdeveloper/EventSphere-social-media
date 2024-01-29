import React, { useState } from "react";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { eventRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { API_BASE_URL } from "../../config/api";

const EventReply = ({ Reply, Post, comment }) => {
  const dispatch = useDispatch();
  const {event} = useSelector(state=> state.EventAuth)
  const [reply, setReply] = useState(Reply);
  const [isReply, setIsReply] = useState(true);
  const [post, setPost] = useState(Post);


  const deleteReplyhandler = (replyId, commentId) => {
    dispatch(showLoading());
    setIsReply(false);
    eventRequest({
      url: apiEndPoints.deleteReply,
      method: "post",
      data: { replyId, commentId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setReply({});
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        console.log(err.message);
        toast.error("something went wrong!");
      });
  };

  return (
    <footer className="flex justify-between items-center mb-2 ml-8">
      {isReply && (
        <div className="flex items-center mx-2 px-2 rounded-md my-1 py-0.5">
          <p className="inline-flex items-center mr-3 text-sm text-gray-950 ">
            <img
              className="mr-2 w-6 h-6 rounded-full"
              src={`${API_BASE_URL}/profiles/${reply?.repliedUser?.profile}`}
              alt="Michael Gough"
            />
            {reply?.username}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-500">
            <time pubdate datetime="2022-02-08" title="February 8th, 2022">
              {reply?.reply}
            </time>
          </p>
          {reply.repliedUser.id === event._id && <MdOutlineDeleteForever 
            className="fill-red-800 mx-2"
            onClick={() =>
              deleteReplyhandler(reply?._id, comment._id)
            }
          />}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <time
              pubdate
              datetime="2022-02-08"
              title="February 8th, 2022"
            ></time>
          </p>
        </div>
      )}
    </footer>
  );
};

export default EventReply;
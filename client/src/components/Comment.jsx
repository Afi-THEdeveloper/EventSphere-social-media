import React, { useState } from "react";
import { API_BASE_URL } from "../config/api";
import { userRequest } from "../Helper/instance";
import { apiEndPoints } from "../utils/api";
import toast from "react-hot-toast";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../Redux/slices/LoadingSlice";

const Comment = ({ comment, user, fetchComments }) => {
  const dispatch = useDispatch();
  const [reply, setReply] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!reply.length) {
      return;
    }
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.addReply,
      method: "put",
      data: {
        commentId: comment?._id,
        username: user?.username,
        reply,
      },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res?.data?.success) {
          fetchComments();
          setReply("");
          setShowReplyBox(false);
        } else {
          toast.error(res?.data?.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const deleteReplyhandler = (Reply) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.deleteUserReply,
      method: "delete",
      data: {
        commentId: Reply?.commentId,
        replyId: Reply?._id,
      },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data?.success) {
          fetchComments();
        } else {
          toast.error(res.data?.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const replyButtonClicked = () => {
    setShowReplyBox((prev) => !prev);
  };

  return (
    <article className="p-6 mb-6 text-base activeBg rounded-lg">
      <footer className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <p className="inline-flex items-center mr-3 text-sm myTextColor">
            <img
              className="mr-2 w-6 h-6 rounded-full"
              src={`${API_BASE_URL}/profiles/${comment?.userId?.profile}`}
              alt="Michael Gough"
            />
            {comment?.userId?.username}
          </p>
          <p className="text-sm myPara">
            <time pubdate datetime="2022-02-08" title="February 8th, 2022">
              {comment?.createdAt}
            </time>
          </p>
        </div>
      </footer>
      <p className="myPara">{comment?.comment}</p>
      <div className="flex items-center mt-4 space-x-4">
        <button
          onClick={replyButtonClicked}
          type="button"
          className="flex items-center text-sm hover:underline myTextColor"
        >
          <svg
            aria-hidden="true"
            class="mr-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
          Reply
        </button>
        {showReplyBox && (
          <form onSubmit={submitHandler}>
            <input
              className="text-center font-serif mt-2 mb-2 rounded-md border-2"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              type="text"
              placeholder="add reply..."
            />

            <button className="myBorder myTextColor border rounded-md px-2 mx-2 mt-2 mb-2">
              Reply
            </button>
          </form>
        )}
      </div>

      {comment?.replies?.length >= 0 &&
        comment?.replies?.map((reply) => {
          return (
            <footer class="flex justify-between items-center mb-2 ml-8">
              <div class="flex items-center mx-2 px-2 rounded-md my-1 py-0.5">
                <p class="inline-flex items-center mr-3 text-sm myTextColor">
                  <img
                    class="mr-2 w-6 h-6 rounded-full"
                    src={`${API_BASE_URL}/profiles/${reply?.repliedUser?.profile}`}
                    alt="Michael Gough"
                  />
                  {reply?.username}
                </p>
                <p class="text-sm myPara">
                  <time
                    pubdate
                    datetime="2022-02-08"
                    title="February 8th, 2022"
                  >
                    {reply?.reply}
                  </time>
                </p>
                {reply.repliedUser.id === user._id && (
                  <MdOutlineDeleteForever
                    className="fill-red-800 mx-2"
                    onClick={() => deleteReplyhandler(reply)}
                  />
                )}
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  <time
                    pubdate
                    datetime="2022-02-08"
                    title="February 8th, 2022"
                  ></time>
                </p>
              </div>
            </footer>
          );
        })}
    </article>
  );
};

export default Comment;

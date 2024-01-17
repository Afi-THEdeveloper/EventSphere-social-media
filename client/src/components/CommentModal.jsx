import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { eventRequest } from "../Helper/instance";
import { apiEndPoints } from "../utils/api";
import { hideLoading, showLoading } from "../Redux/slices/LoadingSlice";
import { FaReply } from "react-icons/fa";
import EventReply from "./Event/EventReply";
import toast from "react-hot-toast";

function CommentModal({ isOpen, closeModal, Comments, post }) {
  const [reply, setReply] = useState("");
  const [ReplyActive, setReplyActive] = useState(null);
  const [comments, setComments] = useState(Comments);
  const dispatch = useDispatch();

  const handleReplyClick = (commentId) => {
    if (ReplyActive === commentId) {
      // Close the reply input if it's already open
      setReplyActive(null);
    } else {
      // Open the reply input for the clicked comment
      setReplyActive(commentId);
      setReply("");
    }
  };

  const handleReply = async (postId, commentId, reply) => {
    if (!reply.length) {
      return;
    }
    dispatch(showLoading());
    eventRequest({
      url: apiEndPoints.EventReply,
      method: "post",
      data: { postId, commentId, reply },
    })
      .then((response) => {
        dispatch(hideLoading());
        if (response.data.success) {
          setComments(response.data.comments);
        } else {
          toast.error(response.data.error);
        }
      })
      .catch((error) => {
        dispatch(hideLoading());
        console.error(error);
        toast.error(error.message);
      })
      .finally(() => {
        setReplyActive(null);
        setReply("");
      });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "500px",
            maxHeight: "500px",
            overflowY: "auto",
          },
        }}
      >
        <div className="mt-4 mb-2">
          <img src="" alt="" />
          <img
            className="w-full h-42 object-cover"
            src={`http://localhost:5000/Event/posts/${post?.image}`}
            alt={post?.description}
          />
          <h2 className="text-slate-600 mb-4">{post?.likes?.length} likes</h2>
          <h2 className="text-slate-400 mb-4">Comments</h2>
          <div className="comments-container">
            {comments?.length ? (
              comments.map((comment) => (
                <div key={comment._id} className="mb-4">
                  <div className="flex items-center">
                    <img
                      className="h-8 w-8 rounded-full mr-2"
                      src={`http://localhost:5000/profiles/${comment?.userId?.profile}`}
                      alt=""
                    />
                    <div className="flex-grow">
                      <small className="text-black font-semibold">
                        {comment?.userId?.username}
                      </small>{" "}
                      <small>{comment?.comment}</small>
                      <button
                        className="ml-6"
                        onClick={() => handleReplyClick(comment._id)}
                      >
                        <FaReply fill="green" />
                      </button>
                    </div>
                    <small className="text-gray-500 ml-4">
                      {new Date(comment?.createdAt).toLocaleString()}
                    </small>
                  </div>
                  {ReplyActive === comment._id && (
                    <div className="mt-2 flex items-center">
                      <input
                        type="text"
                        className="border p-2 rounded mr-2 w-full"
                        placeholder="Enter your reply..."
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                      />
                      <button
                        className="bg-green-500 text-white p-1 rounded"
                        onClick={() =>
                          handleReply(post._id, comment._id, reply)
                        }
                      >
                        Reply
                      </button>
                    </div>
                  )}
                  {comment.replies?.length ? (
                    <p class="inline-flex items-center mx-11 text-sm text-gray-500">
                      Replies
                    </p>
                  ) : (
                    <p class="inline-flex items-center mx-11 text-sm text-gray-500">
                      No Replies
                    </p>
                  )}
                  {comment?.replies?.length >= 0 &&
                    comment?.replies?.map((reply, i) => (
                      <EventReply
                        key={reply?._id}
                        Reply={reply}
                        Post={post}
                        comment={comment}
                      />
                    ))}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No comments</p>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CommentModal;

import React, { useState } from "react";
import { useAddReplyMutation } from "../Redux/Comments/CommentApi";
import Reply from "./Reply";

const Comment = ({ comment, user }) => {
  const [reply, setReply] = useState("");
  const [showReplyBox, setShowReplyBox] = useState(false);

  const [addReply, { isLoading, isSuccess }] = useAddReplyMutation() || {};

  const submitHandler = (e) => {
    e.preventDefault();
    if (!reply.length) {
      return;
    }
    addReply({
      commentId: comment?._id,
      data: {
        commentId: comment?._id,
        username: user?.username,
        reply: reply,
      },
    });

    setReply("");
    setShowReplyBox(false);
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
              src={`http://localhost:5000/profiles/${comment?.userId?.profile}`}
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
          return <Reply key={reply?._id} reply={reply} user={user} />;
        })}
    </article>
  );
};

export default Comment;

// < div class="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4" >
//         <p class="text-center md:text-left md:w-1/2">author: {comment?.username} commented {comment?.comment}</p>
//         <div class="w-full md:w-1/2">
//             <div class="space-y-4">
//                 <div>
//                     <h2 class="text-center md:text-left">---Replies---</h2>
//                     <div class="space-y-2">
//                         {comment?.replies?.length >= 0 && comment?.replies?.map((r, index) => {
//                             return <p class="ml-4 bg-blue-600 px-2 text-white" key={r?._id}>{r?.reply}</p>
//                         })}
//                     </div>
//                 </div>
//                 <div class="flex flex-col space-y-2 md:flex-row md:justify-end md:space-y-0">
//                     <form onSubmit={submitHandler} class="flex space-x-2">
//                         <input type="text" value={reply} onChange={(e) => setReply(e.target.value)} placeholder="reply" class="flex-1 border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
//                         <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Reply</button>
//                     </form>
//                 </div>
//             </div>
//             <hr class="my-4" />
//         </div>
//     </ >

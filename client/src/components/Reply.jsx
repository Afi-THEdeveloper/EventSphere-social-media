import React from "react";
import { useDeleteReplyMutation } from "../Redux/Comments/CommentApi";
import { MdOutlineDeleteForever } from "react-icons/md";

const Reply = ({ reply, user }) => {
  const [deleteReply, { isLoading, isSuccess }] =
    useDeleteReplyMutation() || {};

  const deleteReplyhandler = () => {
    deleteReply({
      commentId: reply?.commentId,
      replyId: reply?._id,
    });
  };

  return (
    <footer class="flex justify-between items-center mb-2 ml-8">
      <div class="flex items-center mx-2 px-2 rounded-md my-1 py-0.5">
        <p class="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
          <img
            class="mr-2 w-6 h-6 rounded-full"
            src={`http://localhost:5000/Event/${user?.profile}`}
            alt="Michael Gough"
          />
          {reply?.username}
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <time pubdate datetime="2022-02-08" title="February 8th, 2022">
            {reply?.reply}
          </time>
        </p>
        <MdOutlineDeleteForever
          className="fill-red-800 mx-2"
          onClick={deleteReplyhandler}
        />
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <time pubdate datetime="2022-02-08" title="February 8th, 2022"></time>
        </p>
      </div>
    </footer>
  );
};

export default Reply;

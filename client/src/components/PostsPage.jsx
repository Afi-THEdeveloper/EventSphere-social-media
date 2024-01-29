import React, { useEffect, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";
import { useDispatch, useSelector } from "react-redux";
import { eventRequest } from "../Helper/instance";
import { apiEndPoints } from "../utils/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import CommentModal from "./CommentModal";
import Modal from "react-modal";
import { hideLoading, showLoading } from "../Redux/slices/LoadingSlice";
import { API_BASE_URL } from "../config/api";

const PostCard = ({ post, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);

  const openModal = (id) => {
    eventRequest({
      url: apiEndPoints.getPostComments,
      method: "post",
      data: { postId: id },
    })
      .then((res) => {
        if (res.data.success) {
          setComments(res.data?.comments);
          setIsModalOpen(true);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "30%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  return (
    <div className="myDivBg shadow-lg rounded-lg overflow-hidden m-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
      {post?.image && (
        <img
          className="w-full h-42 object-cover"
          src={`${API_BASE_URL}/Event/posts/${post?.image}`}
          alt={post?.description}
        />
      )}

      <div className="p-4">
        <h3 className="myTextColor text-xl font-semibold">
          {post?.likes?.length} likes
        </h3>

        <p
          className="myPara hover:font-bold mb-2 cursor-pointer"
          onClick={() => openModal(post?._id)}
        >
          {post?.commentsCount} comments
        </p>
        <button
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-700"
          onClick={() => onDelete(post?._id)}
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={customStyles}
      >
        {/* Use the CommentModal component */}
        <CommentModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          Comments={comments}
          post={post}
        />
      </Modal>
    </div>
  );
};

const PostList = ({ posts, onDelete }) => {
  return (
    <div className="flex flex-wrap justify-center">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onDelete={onDelete} />
      ))}
    </div>
  );
};

const NewPostButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="fixed bottom-4 right-4 myDivBg myTextColor p-4 rounded-full myHover border myBorder"
      onClick={() => navigate(ServerVariables.addPost)}
    >
      <PlusIcon className="h-6 w-6 font-bold" />
    </button>
  );
};

const PostsPage = ({eventId}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);

  const getPosts = async (eventId) => {
    eventRequest({
      url: apiEndPoints.getEventPosts,
      method: "post",
      data : {eventId}
    })
      .then((res) => {
        if (res.data?.success) {
          setPosts(res.data?.posts);
        } else {
          toast.error(res.data?.error);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleDelete = async (PostId) => {
    const result = await Swal.fire({
      title: "Delete post",
      text: "Are you sure to delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1F2937",
      cancelButtonColor: "#d33",
      confirmButtonText: "delete",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      dispatch(showLoading())
      eventRequest({
        url: apiEndPoints.deleteEventPost,
        method: "post",
        data: { id: PostId },
      })
        .then((res) => {
          dispatch(hideLoading())
          getPosts(eventId);
          toast.success(res.data.success);
        })
        .catch((err) => {
          dispatch(hideLoading())
          toast.error(err.message);
        });
    }
  };

  useEffect(() => {
    getPosts(eventId);
  }, []);

  return (
    <>
      {posts.length ? (
        <div className="min-h-screen p-8">
          <PostList posts={posts} onDelete={handleDelete} />
          <NewPostButton onClick={() => navigate(ServerVariables.addPost)} />
        </div>
      ) : (
        <div className="text-center">
          <p className="myPara mt-10">No posts yet..</p>
          <button
            className="myDivBg text-white p-2 rounded-full myHover border myBorder"
            onClick={() => navigate(ServerVariables.addPost)}
          >
            <PlusIcon className="h-6 w-6 font-bold" />
          </button>
        </div>
      )}
    </>
  );
};

export default PostsPage;

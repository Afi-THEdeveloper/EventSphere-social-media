import React, { useEffect, useState } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";
import { useDispatch, useSelector } from "react-redux";
import { eventRequest } from "../Helper/instance";
import { apiEndPoints } from "../utils/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const PostCard = ({ post, onDelete }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden m-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5">
      {post?.image && (
        <img
          className="w-full h-42 object-cover"
          src={`http://localhost:5000/Event/posts/${post?.image}`}
          alt={post.description}
        />
      )}

      {post?.video && (
        <video width="320" height="400" controls>
          <source
            src={`http://localhost:5000/Event/posts/${post?.video}`}
            type="video/mp4"
          />
        </video>
      )}

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">
          {post.likes.length} likes
        </h2>
        <p className="text-gray-600 mb-2">{post?.description}</p>
        <button
          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-700"
          onClick={() => onDelete(post._id)}
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
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
      className="fixed bottom-4 right-4 bg-[#FFB992] text-white p-4 rounded-full hover:bg-[#e0b887]"
      onClick={() => navigate(ServerVariables.addPost)}
    >
      <PlusIcon className="h-6 w-6 font-bold" />
    </button>
  );
};

const PostsPage = ({ AllPosts }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setPosts(AllPosts);
  },[AllPosts]);

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
      eventRequest({
        url: apiEndPoints.deleteEventPost,
        method: "post",
        data: { id: PostId },
      })
        .then((res) => {
          if (res.data.success) {
            getPosts();
            toast.success(res.data.success);
          } else {
            toast.error(res.data.error);
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    }
  };

  return (
    <>
      {posts.length ? (
        <div className="min-h-screen p-8">
          <PostList posts={posts} onDelete={handleDelete} />
          <NewPostButton onClick={() => navigate(ServerVariables.addPost)} />
        </div>
      ) : (
        <div className="text-center">
          <p className="text-white mt-10">No posts yet..</p>
          <button
            className="bg-[#FFB992] text-white p-2 rounded-full hover:bg-[#e0b887]"
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

import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import Comment from "../../components/Comment";
import { useDispatch, useSelector } from "react-redux";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { ServerVariables } from "../../utils/ServerVariables";
import { API_BASE_URL } from "../../config/api";
import UserNavbar from "../../components/User/UserNavbar";

function PostDetail() {
  const [post, setPost] = useState({});
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.Auth);

  const location = useLocation();
  const Post = location.state ? location.state.postDetails : null;

  useEffect(() => {
    if (Post) {
      setPost(Post);
      getComments();
    } else {
      navigate(ServerVariables.UserHome);
    }
  }, []);

  const getComments = () => {
    userRequest({
      url: `${apiEndPoints.getAllComments}/${Post?._id}`,
      method: "get",
    })
      .then((res) => {
        if (res.data?.success) {
          setComments(res.data?.comments);
        } else {
          toast.error(res.data?.error);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    userRequest({
      url: apiEndPoints.createComment,
      method: "post",
      data: {
        id: post._id,
        comment,
        username: user?.username,
      },
    })
      .then((res) => {
        if (res.data?.success) {
          getComments();
          setComment("");
        } else {
          toast.error(res.data?.error);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  let totals = comments?.map((item) => item?.replies?.length);
  let ultimateTotal = totals?.reduce((acc, item) => acc + item, 0);
  ultimateTotal = ultimateTotal + comments?.length;

  const handleLike = (postId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.likePost,
      method: "post",
      data: { postId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setPost(res.data.post);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const handleUnLike = (postId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.UnlikePost,
      method: "post",
      data: { postId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setPost(res.data.post);
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
      <UserNavbar />
      <div className="flex">
        <UserSidebar />

        <div className="flex-grow flex-shrink min-h-screen">
          <div className="mx-auto flex flex-col justify-center max-w-lg mt-4">
            {/* postDetail  */}
            <div className="container shadow-sm items-center mx-auto my-5 py-5 px-5 myDivBg">
              {/* <h2 className="text-center text-3xl mb-2 mt-2">Post Comments</h2> */}
              <IoArrowBackCircleOutline
                className="myTextColor h-10 w-10"
                onClick={() => window.history.back()}
              />
              <div className="">
                <img
                  className="mx-auto"
                  src={`${API_BASE_URL}/Event/posts/${post?.image}`}
                  alt="title"
                />
                {post?.likes?.includes(user?._id) ? (
                  <FaHeart
                    className="w-7 h-7 fill-red-700"
                    onClick={() => handleUnLike(post._id)}
                  />
                ) : (
                  <FaRegHeart
                    className="myTextColor w-7 h-7"
                    onClick={() => handleLike(post._id)}
                  />
                )}
                <p className="myTextColor font-bold">
                  {post?.likes?.length} likes
                </p>
                <div className="myPara flex items-center mt-2 py-2 px-2">
                  <p className="font-serif mt-2 pt-3 font-medium text-xl px-2">
                    {post?.description && post?.description}
                  </p>
                </div>
              </div>
            </div>
            <section className="myDivBg mt-4 mb-2 py-8 lg:py-16">
              <div className="max-w-2xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg lg:text-2xl font-bold myTextColor">
                    Discussion ({ultimateTotal})
                  </h4>
                </div>
                <form onSubmit={submitHandler} class="mb-6">
                  <div className="py-2 px-4 mb-4 rounded-lg rounded-t-lg">
                    <label for="comment" className="sr-only">
                      Your comment
                    </label>
                    <textarea
                      id="comment"
                      rows="6"
                      onChange={(e) => setComment(e.target.value)}
                      className="myTextColor p-2 w-full text-sm activeBg border-0 focus:ring-0 focus:outline-none  dark:placeholder-gray-400 "
                      placeholder="Write a comment..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-md activeBg ml-4 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0f1015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Post comment
                  </button>
                </form>

                {comments?.length >= 0 &&
                  comments?.map((comment) => {
                    return (
                      <Comment
                        key={comment?._id}
                        comment={comment}
                        user={user}
                        fetchComments={getComments}
                      />
                    );
                  })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostDetail;

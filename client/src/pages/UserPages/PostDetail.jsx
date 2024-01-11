import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useAddCommentMutation,
  useFetchCommentsQuery,
} from "../../Redux/Comments/CommentApi";
import Comment from "../../components/Comment";
import { useDispatch, useSelector } from "react-redux";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { ServerVariables } from "../../utils/ServerVariables";

function PostDetail() {
  const [post,setPost]= useState({})
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [comment, setComment] = useState("");
  const { user } = useSelector((state) => state.Auth);

  const location = useLocation();
  const Post = location.state ? location.state.postDetails : null;

  useEffect(()=>{
    if(Post){
      setPost(Post);
    }else{
      navigate(ServerVariables.UserHome)
    }
  },[])

  const [addComment] = useAddCommentMutation() || {};
  const { data: comments } = useFetchCommentsQuery(Post?._id) || {};

  let totals = comments?.map((item) => item?.replies?.length);
  let ultimateTotal = totals?.reduce((acc, item) => acc + item, 0);
  ultimateTotal = ultimateTotal + comments?.length;

  const submitHandler = (e) => {
    e.preventDefault();

    addComment({
      postId: post._id,
      data: {
        postId: post._id,
        comment: comment,
        username: user.username,
      },
    });

    setComment("");
  };

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
                  src={`http://localhost:5000/Event/posts/${post?.image}`}
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
                <p className="myTextColor font-bold">{post?.likes?.length} likes</p>
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
                      className="p-2 w-full text-sm activeBg border-0 focus:ring-0 focus:outline-none  dark:placeholder-gray-400"
                      placeholder="Write a comment..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-gray-800 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
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

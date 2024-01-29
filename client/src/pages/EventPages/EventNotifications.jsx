import React, { useEffect, useState } from "react";
import EventSideBar from "../../components/EventSideBar";
import Myh1 from "../../components/Myh1";
import Button1 from "../../components/Button1";
import { CiCircleRemove } from "react-icons/ci";
import { eventRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ServerVariables } from "../../utils/ServerVariables";
import CommentModal from "../../components/CommentModal";
import { API_BASE_URL } from "../../config/api";

function EventNotifications() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState({});
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clearMessge = (NotId) => {
    eventRequest({
      url: apiEndPoints.clearNotification,
      method: "delete",
      data: { NotId },
    })
      .then((res) => {
        getNotifications();
      })
      .catch((err) => {
        toast.error(err.messsage);
      });
  };

  const clearAllNotifications = () => {
    eventRequest({
      url: apiEndPoints.clearAllNotifications,
      method: "delete",
    })
      .then((res) => {
        getNotifications();
        toast.success(res.data?.success);
      })
      .catch((err) => {
        toast.error(err.messsage);
      });
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    dispatch(showLoading());
    eventRequest({
      url: apiEndPoints.getNotifications,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        setNotifications(res.data.notifications);
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.messsage);
      });
  };

  const formatTime = (dateString) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
    });
  };

  const handleNotificationClick = (notificationOn) => {
    if (notificationOn?.model === "user") {
      navigate(ServerVariables.showUser, {
        state: { user: notificationOn?.objectId },
      });
    } else if (notificationOn?.model === "jobPost") {
      navigate(
        `${ServerVariables.eventJobStats}/${notificationOn?.objectId?._id}`
      );
    } else if (notificationOn?.model === "eventPosts") {
      openModal(notificationOn?.objectId?._id);
      setPost(notificationOn?.objectId);
    }
  };

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
    <>
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen">
          <div className="container mx-auto p-4">
            <div className="flex justify-between items-center my-8">
              <Myh1 title="Notifications" />
              <div className="clear-all-button">
                {notifications.length > 1 && (
                  <Button1 text="clear All" onClick={clearAllNotifications} />
                )}
              </div>
            </div>
            <div className="space-y-4 ">
              {notifications?.length > 0 ? (
                notifications?.map((item) => (
                  <div
                    key={item?._id}
                    className="myBorder border-y-[0.1px] p-2 w-full rounded-lg shadow-md flex items-center justify-between space-x-4"
                  >
                    <div className="flex-grow"  onClick={() => handleNotificationClick(item?.actionOn)}>
                      <small className="myTextColor font-extrabold cursor-pointer">
                        {item?.notificationMessage}
                        {item?.actionOn?.model === "eventPosts" && (
                          <img
                            className="w-10 h-10"
                            src={`${API_BASE_URL}/Event/posts/${item?.actionOn?.objectId.image}`}
                            alt="post-image"
                          />
                        )}
                      </small>
                    </div>
                    <div className="flex items-center">
                      <small className="myPara mr-4 font-bold">
                        {formatTime(item?.date)}
                      </small>

                      <CiCircleRemove
                        className="fill-red-900 w-8 h-8 cursor-pointer"
                        onClick={() => clearMessge(item?._id)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center myTextColor font-extrabold">
                  No notifications
                </div>
              )}
            </div>
          </div>
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
    </>
  );
}

export default EventNotifications;

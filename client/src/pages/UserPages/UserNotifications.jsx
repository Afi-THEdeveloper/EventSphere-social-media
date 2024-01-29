import React, { useEffect, useState } from "react";
import { CiCircleRemove } from "react-icons/ci";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import UserSidebar from "../../components/User/UserSidebar";
import Myh1 from "../../components/Myh1";
import Button1 from "../../components/Button1";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { ServerVariables } from "../../utils/ServerVariables";
import { API_BASE_URL } from "../../config/api";

function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clearMessge = (NotId) => {
    userRequest({
      url: apiEndPoints.clearUserNotification,
      method: "delete",
      data: { NotId },
    })
      .then((res) => {
        getUserNotifications();
      })
      .catch((err) => {
        toast.error(err.messsage);
      });
  };

  const clearAllNotifications = () => {
    userRequest({
      url: apiEndPoints.clearAllUserNotifications,
      method: "delete",
    })
      .then((res) => {
        getUserNotifications();
        toast.success(res.data?.success);
      })
      .catch((err) => {
        toast.error(err.messsage);
      });
  };

  useEffect(() => {
    getUserNotifications();
  }, []);

  const getUserNotifications = () => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getUserNotifications,
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
    if (notificationOn?.model === "eventPosts") {
      navigate(ServerVariables.postDetails, {
        state: { postDetails: notificationOn?.objectId },
      });
    } else if (notificationOn?.model === "jobPost") {
      navigate(ServerVariables.jobStats);
    }
  };

  return (
    <>
      <div className="flex">
        <UserSidebar />
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
                    onClick={() => handleNotificationClick(item?.actionOn)}
                  >
                    <div className="flex-grow">
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
                <div className="text-center text-slate-300 font-extrabold">
                  No notifications
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserNotifications;

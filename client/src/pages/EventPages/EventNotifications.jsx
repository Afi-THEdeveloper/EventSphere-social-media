import React, { useEffect, useState } from "react";
import EventSideBar from "../../components/EventSideBar";
import Myh1 from "../../components/Myh1";
import Button1 from "../../components/Button1";
import { CiCircleRemove } from "react-icons/ci";
import { eventRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { useDispatch } from "react-redux";
import {  useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ServerVariables } from "../../utils/ServerVariables";

function EventNotifications() {
  const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const clearMessge = (NotId) => {
    eventRequest({
      url: apiEndPoints.clearNotification,
      method: "delete",
      data: { NotId },
    }).then((res) => {
        getNotifications()
    }).catch((err) => {
        toast.error(err.messsage)
    });
  };

  const clearAllNotifications = () => {
    eventRequest({
        url: apiEndPoints.clearAllNotifications,
        method:'delete',
    }).then((res) => {
        getNotifications()
        toast.success(res.data?.success)
    }).catch((err) => {
        toast.error(err.messsage)
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
                    className="border-y-[0.1px] p-2 w-full rounded-lg shadow-md flex items-center justify-between space-x-4"
                  >
                    <div className="flex-grow">
                      <small className="text-slate-200 font-extrabold cursor-pointer">
                        {item?.notificationMessage}
                        {item?.actionOn && (
                          <img
                            className="w-10 h-10"
                            src={`http://localhost:5000/Event/posts/${item?.actionOn?.image}`}
                            alt="post-image"
                            onClick={()=> navigate(ServerVariables.eventHome)}
                          />
                          )}
                      </small>
                    </div>
                    <div className="flex items-center">
                      <small className="text-slate-200 mr-4 font-bold">
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

export default EventNotifications;

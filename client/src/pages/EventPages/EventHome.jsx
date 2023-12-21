import React from "react";
import Myh1 from "../../components/Myh1";
import { useDispatch, useSelector } from "react-redux";
import Button1 from "../../components/Button1";
import { logout } from "../../Redux/slices/EventAuthSlice";
import EventSideBar from "../../components/EventSideBar";
import EventRightBar from "../../components/EventRightBar";

function EventHome() {
  const dispatch = useDispatch();
  const { event } = useSelector((state) => state.EventAuth);

  const HandleLogout = () => {
    dispatch(logout());
  };

  return (

    <>
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen"> 

        </div>
         <EventRightBar />
      </div>
    </>
  );
}

export default EventHome;

import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import UserRightbar from "../../components/User/UserRightbar";
import SectionTabs from "../../components/SectionTabs";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import UserNavbar from "../../components/User/UserNavbar";

function jobStats() {
  const [jobStats, setJobStats] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getJobStats();
  }, []);

  const getJobStats = () => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getJobStats,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data?.success) {
          setJobStats(res.data?.stats);
        } else {
          toast.error(res.data?.error);
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

        <div className="flex-grow flex-shrink min-h-screen text-center">
          <SectionTabs sections={jobStats} />
        </div>

        <UserRightbar />
      </div>
    </>
  );
}

export default jobStats;

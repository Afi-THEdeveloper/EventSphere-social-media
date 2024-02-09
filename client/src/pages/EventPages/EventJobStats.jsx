import React, { useEffect, useState } from "react";
import EventSideBar from "../../components/EventSideBar";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { eventRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { ServerVariables } from "../../utils/ServerVariables";
import JobCard from "../../components/JobCard";
import SectionTabs from "../../components/SectionTabs";
import EventNavbar from "../../components/Event/EventNavbar";

function EventJobStats() {
  const [jobStats, setJobStats] = useState([]);
  const [jobDetails, setJobDetails] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobId } = useParams();
  useEffect(() => {
    if (jobId) {
      getJobStats(jobId);
    } else {
      navigate(ServerVariables.hirings);
    }
  }, []);

  const getJobStats = (jobId) => {
    dispatch(showLoading());
    eventRequest({
      url: apiEndPoints.getEventJobStats,
      method: "post",
      data: { jobId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data?.success) {
          setJobDetails(res.data?.jobDetails);
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
      <EventNavbar />
      <div className="flex">
        <EventSideBar />

        <div className="flex-grow flex-shrink min-h-screen my-8 text-center">
          <div className="grid grid-cols-1  gap-6 mx-2 md:mx-10 my-2">
            {jobStats.length && <JobCard jobPost={jobDetails} />}
          </div>
          <div>
            {jobStats.length && (
              <SectionTabs sections={jobStats} role={"event"} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EventJobStats;

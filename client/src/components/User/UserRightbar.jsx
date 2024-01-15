import React, { useEffect, useState } from "react";
import JobCard2 from "../JobCard2";
import Button2 from "../../components/Button2";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { ServerVariables } from "../../utils/ServerVariables";

function UserRightbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [jobPosts, setJobPosts] = useState([]);
  useEffect(() => {
    getJobPosts();
  }, []);
  const getJobPosts = () => {
    userRequest({
      url: apiEndPoints.getJobs,
      method: "get",
    })
      .then((res) => {
        setJobPosts(res.data.posts);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="myDivBg w-[360px] hidden xl:block  min-h-screen flex-shrink">
      <div className="text-end m-2">
        <Button2 text={"Job stats"} onClick={()=>{navigate(ServerVariables.jobStats)}} />
      </div>

      <div className="mt-6">
        {jobPosts.length && <h3 className="myTextColor my-2 font-bold text-center">JOBS</h3>}

        {jobPosts.length ? (
          jobPosts.map((post) => {
            return <JobCard2 job={post} />;
          })
        ) : (
          <div className="text-center myPara">
            <p>No jobs found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserRightbar;

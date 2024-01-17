import React, { useEffect, useState } from "react";
import JobCard2 from "../JobCard2";
import Button2 from "../../components/Button2";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ServerVariables } from "../../utils/ServerVariables";

function UserRightbar() {
  const navigate = useNavigate();
  const [jobPosts, setJobPosts] = useState([]);
  const { user } = useSelector((state) => state.Auth);
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
    <>
      {user?.isJobSeeker ? (
        <div className="myDivBg w-[360px] hidden xl:block  min-h-screen flex-shrink">
          <div className="text-end m-2">
            <Button2
              text={"Job stats"}
              onClick={() => {
                navigate(ServerVariables.jobStats);
              }}
            />
          </div>

          <div className="mt-6">
            {jobPosts.length && (
              <div className="text-center my-2">
                <h3 className="myTextColor font-bold">JOBS</h3>
                <small className="myPara">
                  (follow more events to explore more jobs)
                </small>
              </div>
            )}

            {jobPosts.length ? (
              jobPosts.map((post) => {
                return <JobCard2 job={post} />;
              })
            ) : (
              <div className="text-center myPara">
                <p>No jobs found</p>
                <small className="myPara">
                  (follow more events to explore more jobs)
                </small>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="myDivBg text-center p-4">
          <p className="myTextColor my-2">
            Add job profile <br />
            <small className="myPara">
              (so that you can apply for jobs in events)
            </small>
          </p>{" "}
          <Button2
            text={"update profile"}
            onClick={() => navigate(ServerVariables.userProfile)}
          />
        </div>
      )}
    </>
  );
}

export default UserRightbar;

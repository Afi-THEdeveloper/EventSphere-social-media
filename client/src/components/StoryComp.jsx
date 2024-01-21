import React, { useEffect, useState } from "react";
import { userRequest } from "../Helper/instance";
import { apiEndPoints } from "../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";

const StoryComp = () => {
  const [stories, setStories] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    getStories();
  }, []);

  const getStories = () => {
    userRequest({
      url: apiEndPoints.getStories,
      method: "get",
    })
      .then((res) => {
        if (res.data?.success) {
          setStories(res.data.stories);
        } else {
          toast.error(res.data?.error);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleStoryClick = (storiesOfEvent) => {
    console.log(storiesOfEvent);
    navigate(ServerVariables.storyCourosel, {
      state: { stories: storiesOfEvent },
    });
  };

  return (
    <ul className="flex space-x-6 font-serif">
      {stories.length ? (
        stories.map((story, index) => {
          return (
            <li
              key={index}
              className="flex flex-col items-center space-y-1 relative"
            >
              <div className="bg-gradient-to-tr from-yellow-500 to-fuchsia-600 p-1 rounded-full">
                <p
                  className="bg-white block rounded-full p-1 hover:-rotate-6 transform transition"
                  onClick={() => handleStoryClick(story?.stories)}
                >
                  <img
                    className="h-16 w-16 rounded-full"
                    src={`http://localhost:5000/profiles/${story?.stories[0]?.postedByDetails.profile}`}
                    alt="cute kitty"
                  />
                </p>
              </div>
              <p className="myTextColor">
                {story?.stories[0]?.postedByDetails.title}
              </p>
            </li>
          );
        })
      ) : (
        <div className="">
          {/* <p className="myPara">No stories posted Today</p> */}
        </div>
      )}
    </ul>
  );
};

export default StoryComp;

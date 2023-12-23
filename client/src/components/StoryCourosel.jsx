import React, { useEffect, useState } from "react";
import Courosel from "./Courosel";
import { useLocation } from "react-router-dom";

function StoryCourosel() {
  const [stories, setStories] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const location = useLocation();
  const eventStories = location.state ? location.state.stories : [];
  useEffect(() => {
    if (eventStories.length) {
      setStories(eventStories);
      let desc = [];
      for (let i = 0; i < eventStories.length; i++) {
        eventStories[i].description
          ? desc.push(eventStories[i].description)
          : desc.push("");
      }
      console.log(desc);
      setDescriptions(desc);
    }
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center  h-screen">
        <div className="max-w-lg">
          <Courosel
            autoSlide={false}
            autoSlideInterval={2000}
            descriptions={descriptions}
          >
            {stories.map((s) => (
              <img src={`http://localhost:5000/Event/posts/${s.image}`} />
            ))}
          </Courosel>
        </div>
      </div>
    </div>
  );
}

export default StoryCourosel;

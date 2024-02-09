import React from "react";
import EventSideBar from "../../components/EventSideBar";
import AddPostForm from "../../components/AddPostForm";
import EventNavbar from "../../components/Event/EventNavbar";

function AddPost() {
  return (
    <>
      <EventNavbar />
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen">
          <AddPostForm title="Add post" />
        </div>
      </div>
    </>
  );
}

export default AddPost;

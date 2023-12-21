import React from "react";
import EventSideBar from "../../components/EventSideBar";
import AddPostForm from "../../components/AddPostForm";

function AddPost() {
  return (
    <>
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen">
          <AddPostForm title='Add post'/>
        </div>  
      </div>
    </>
  );
}

export default AddPost;
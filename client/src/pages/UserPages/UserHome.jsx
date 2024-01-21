import React from "react";
import UserRightbar from "../../components/User/UserRightbar";
import UserSidebar from "../../components/User/UserSidebar";
import PostCard from "../../components/User/PostCard";
import StoryComp from "../../components/StoryComp";

function UserHome() {
  return (
    <>
      <div className="flex">
        <UserSidebar />

        <div className="flex-grow flex-shrink min-h-screen mx-4">
          <div className="max-w-full w-full h-30  mx-auto p-2 overflow-x-auto">
            <StoryComp />
          </div>
          <div className="mx-auto flex flex-col justify-center max-w-lg mt-4">
            <PostCard />
          </div>
        </div>

        <UserRightbar />
      </div>
    </>
  );
}

export default UserHome;

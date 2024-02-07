import React, { useState, useEffect } from "react";
import UserRightbar from "../../components/User/UserRightbar";
import PostCard from "../../components/User/PostCard";
import StoryComp from "../../components/StoryComp";
import UserSidebar from "../../components/User/UserSidebar";
import UserNavbar from "../../components/User/UserNavbar";

function UserHome() {
  return (
    <>
      <UserNavbar />  
      <div className="flex">
        <UserSidebar />
        <div className="flex-grow flex-shrink min-h-screen mx-2">
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

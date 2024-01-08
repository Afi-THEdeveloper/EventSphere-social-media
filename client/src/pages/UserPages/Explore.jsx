import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import UserRightbar from "../../components/User/UserRightbar";
import PostCard from "../../components/User/PostCard";


function Explore() {
  return (
    <>
      <div className="flex">
        <UserSidebar />

        <div className="flex-grow flex-shrink min-h-screen">
          <div className="mx-auto flex flex-col justify-center max-w-lg mt-4">
            <PostCard />
          </div>
        </div>

        <UserRightbar />
      </div>
    </>
  );
}

export default Explore;

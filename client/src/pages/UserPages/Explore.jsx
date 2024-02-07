import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import UserRightbar from "../../components/User/UserRightbar";
import PostCard from "../../components/User/PostCard";
import UserNavbar from "../../components/User/UserNavbar";


function Explore() {
  return (
    <>
      <UserNavbar/>
      <div className="flex">
        <UserSidebar />

        <div className="flex-grow flex-shrink min-h-screen mx-2">
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

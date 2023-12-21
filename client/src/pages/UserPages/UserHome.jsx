import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import UserRightbar from "../../components/User/UserRightbar";
import PostCard from "../../components/User/PostCard";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { userRequest } from "../../Helper/instance";

function UserHome() {
  


  return (
    <>
      <div className="flex">
        <UserSidebar />

        <div className="flex-grow flex-shrink min-h-screen">
          <div className="w-full h-24 border-b-[0.5px] border-[#E0CDB6]"></div>
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

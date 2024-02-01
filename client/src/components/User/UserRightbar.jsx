import React, { useEffect, useState } from "react";
import JobCard2 from "../JobCard2";
import Button2 from "../../components/Button2";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { ServerVariables } from "../../utils/ServerVariables";
import ContactCard from "../ContactCard";

function UserRightbar() {
  return (
    <>
      <div className="w-[300px]  hidden lg:block  min-h-screen flex-shrink">
        <ContactCard />
      </div>
    </>
  );
}

export default UserRightbar;

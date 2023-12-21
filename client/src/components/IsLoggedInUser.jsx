import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";

function IsLoggedInUser() {
  const { token } = useSelector((state) => state.Auth);
  return (
    token ? <Outlet/> : <Navigate to={ServerVariables.Login} />
  )
}

export default IsLoggedInUser;

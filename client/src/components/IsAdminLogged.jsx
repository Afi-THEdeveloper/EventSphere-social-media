import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";

function IsAdminLogged() {
  const { token } = useSelector((state) => state.AdminAuth);
  return (
    token ? <Outlet /> : <Navigate to={ServerVariables.AdminLogin} />
  )
}

export default IsAdminLogged;

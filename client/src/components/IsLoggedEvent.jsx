import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";

function IsLoggedEvent() {
  const { token } = useSelector((state) => state.EventAuth);
  return (
    token ? <Outlet /> : <Navigate to={ServerVariables.eventLogin} />
  )
}

export default IsLoggedEvent;
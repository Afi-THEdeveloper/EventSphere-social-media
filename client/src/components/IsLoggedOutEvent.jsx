import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";

function IsLoggedOutEvent() {
  const { token } = useSelector((state) => state.EventAuth);
  return (
    token === null ? <Outlet /> : <Navigate to={ServerVariables.eventHome} />
  )
}

export default IsLoggedOutEvent;
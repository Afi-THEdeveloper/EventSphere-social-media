import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";
import UseAuth from "../Hooks/UseAuth";

function IsLoggedInUser() {
  const { token } = useSelector((state) => state.Auth);
  // const {username} = UseAuth()
  // useEffect(()=>{
  //   console.log(username)
  // },[])
  return (
    token ? <Outlet/> : <Navigate to={ServerVariables.Login} />
  )
}

export default IsLoggedInUser;

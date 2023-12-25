import React from "react";
import { useSelector } from "react-redux";
import {jwtDecode} from "jwt-decode";

function UseAuth() {
  const {UserToken }= useSelector(state => state.Auth);
  let isEvent = false;
  let isAdmin = false;
  let status = "User";

  if (UserToken) {
    const decoded = jwtDecode(token);
    console.log(decoded)
    const { userId } = decoded.id;
    // isEvent = roles.includes("Event");
    // isAdmin = roles.includes("Admin");

    return { username:userId  };
    // roles, status, isAdmin, isEvent
  }

  return { username: "", roles: [], isAdmin, status };
}

export default UseAuth;

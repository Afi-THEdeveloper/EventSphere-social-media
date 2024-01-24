import URL from "../config/api";
import axios from "axios";
const user = axios.create({ baseURL: URL.BASE_URL });

export const userRequest = ({ ...options }) => {
  //the Authorization header
  user.defaults.headers.common.Authorization = JSON.parse(
    localStorage.getItem("UserToken")
  );
  axios.defaults.withCredentials = true;
  const onSuccess = (response) => response;
  const onError = (error) => {
    console.log("axios interceptor", error);
    return error;
  };
  return user(options).then(onSuccess).catch(onError);
};

export const eventRequest = ({ ...options }) => {
  user.defaults.headers.common.Authorization = JSON.parse(
    localStorage.getItem("eventToken")
  );
  axios.defaults.withCredentials = true;

  const onSuccess = (response) => response;
  const onError = (error) => {
    console.log("axios interceptor", error);
    return error;
  };
  return user(options).then(onSuccess).catch(onError);
};

export const adminRequest = ({ ...options }) => {
  user.defaults.headers.common.Authorization = JSON.parse(
    localStorage.getItem("adminToken")
  );
  axios.defaults.withCredentials = true;

  const onSuccess = (response) => response;
  const onError = (error) => {
    console.log("axios interceptor", error);
    return error;
  };
  return user(options).then(onSuccess).catch(onError);
};

import { createSlice } from "@reduxjs/toolkit";
import { apiEndPoints } from "../../utils/api";
import { adminRequest } from "../../Helper/instance";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "./LoadingSlice";


const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  errorMsg: "",
  message: "",
  admin: JSON.parse(localStorage.getItem("adminInfo")) || {},
  token: JSON.parse(localStorage.getItem("adminToken")) || null,
};

export const AdminAuthSlice = createSlice({
  name: "Admin Auth",
  initialState,
  reducers: {
    loginPending: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.isError = false;
      state.admin = action.payload.admin;
      localStorage.setItem("adminInfo", JSON.stringify(action.payload.admin));
      localStorage.setItem("adminToken", JSON.stringify(action.payload.token));
      state.token = action.payload.token;
      state.message = action.payload.success;
    },
    loginReject: (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.isSuccess = false;
      state.errorMsg = action.payload.error;
    },
    logout: (state) => {
      localStorage.removeItem("adminInfo");
      localStorage.removeItem("adminToken");
      state.token = null;
      state.user = {};
    },
  },
});

export const AdminLoginThunk = (data) => async (dispatch) => {
  try {
    dispatch(loginPending());
    dispatch(showLoading())
    const res = await adminRequest({
      url: apiEndPoints.postLoginAdmin,
      method: "post",
      data: data,
    });
    dispatch(hideLoading())
    if(res.data.success){
      toast.success(res.data.success)
      dispatch(loginSuccess(res.data));
    }else{
      toast.error(res.data.error)
      dispatch(loginReject(res.data))
    }
    
  } catch (error) {
     dispatch(hideLoading())
     toast.error('request failed')
     dispatch(loginReject({ error: 'No response received from the server.' }));
  }
};


export const { loginPending, loginSuccess, loginReject, logout } = AdminAuthSlice.actions;
export default AdminAuthSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { apiEndPoints } from "../../utils/api";
import { eventRequest } from "../../Helper/instance";
import toast from "react-hot-toast";
import { hideLoading, showLoading } from "./LoadingSlice";



const initialState = {
    isLoading: false,
    isError: false,
    isSuccess:false,
    errorMsg: "",
    message: "",
    event:JSON.parse(localStorage.getItem('eventInfo'))  || {},
    token:JSON.parse(localStorage.getItem('eventToken')) || null ,
};
  
  export const EventAuthSlice = createSlice({
    name: "EventAuth",
    initialState,
    reducers: {
      loginPending: (state) => {
        state.isLoading = true;
      },
      loginSuccess: (state, action) => {  
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.event = action.payload.event;
        localStorage.setItem('eventInfo', JSON.stringify(action.payload.event))
        localStorage.setItem('eventToken', JSON.stringify(action.payload.token))
        state.token = action.payload.token;
        state.message = action.payload.success;
      },
      loginReject: (state, action) => { 
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.errorMsg = action.payload.error;
      },
      updateEvent: (state,action)=>{
        state.event = action.payload;
        localStorage.setItem('eventInfo', JSON.stringify(action.payload))
      },
      logout: (state) =>{
        localStorage.removeItem('eventInfo')
        localStorage.removeItem('eventToken')
        state.token = null
        state.event = {}
      }
    },
  });
  
  
  export const EventLoginThunk = (data) => async (dispatch) => {
    try {
      dispatch(loginPending());
      dispatch(showLoading())
      const res =await eventRequest({url:apiEndPoints.postEventLogin,method:'post',data:data})
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
      dispatch(loginReject(error))
    }
  };
  export const { loginPending, loginSuccess, loginReject,updateEvent, logout } = EventAuthSlice.actions;
  export default EventAuthSlice.reducer;
  
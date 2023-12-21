import React, { useState, useEffect, useRef } from "react";
import Myh1 from "../../components/Myh1";
import Button1 from "../../components/Button1";
import { useFormik } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { ServerVariables } from "../../utils/ServerVariables";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";

function EventOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [timer, setTimer] = useState(30);
  const [email,setEmail] = useState(location.state.email)
  const dispatch = useDispatch()
  const timerIntervalRef = useRef(null)
  useEffect(() => {
    startTimer()
  }, []);
  
  const startTimer = () => {
    setTimer(30); 
    clearInterval(timerIntervalRef.current); // Clear any existing interval before starting a new one
    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    timerIntervalRef.current = countdown;// Save the interval reference to clear it later
    return () => clearInterval(countdown);
  };
  
  
 
  // Assuming you have a state for OTP digits
  const initialValues = {
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
  };

  const formik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const otp = `${values.digit1}${values.digit2}${values.digit3}${values.digit4}`;
      
      console.log("OTP submitted:", otp);
      console.log("Email submitted:", email);
      dispatch(showLoading())
      userRequest({
        url: apiEndPoints.postEventRegisterOtp,
        method: "post",
        data: { otp: otp, email: email},
      }).then((res) => {
        dispatch(hideLoading())
        if (res.data.success) {
          navigate(ServerVariables.eventLogin);
          toast.success(res.data.success)
        } else {
          toast.error(res.data.error)
        }
      }).catch(err=>{
        dispatch(hideLoading())
        toast.error(err.message)
      });
    },
  }); 

  const resendOtp = ()=>{
    dispatch(showLoading())
    userRequest({
      url:apiEndPoints.postEventResendOtp,
      method:'post',
      data:{ email: email }
    }).then(res=>{
      dispatch(hideLoading())
      if(res.data.success){
        toast.success(res.data.success)
        startTimer()
      }else{
        toast.error('failed to resend,try again')
      }
    })
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
      <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
        <Myh1 title="Otp Verification" />
        <p className="text-[#E0CDB6] font-medium">
          We have send an OTP to your email.
        </p>
        <p className="text-[#E0CDB6] font-medium" style={{ marginBottom: 40 }}>
          valid for 1 minute ({timer})
        </p>  
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="flex justify-between  mb-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-1/4 mr-2">
                <input
                  type="text"
                  name={`digit${index + 1}`}
                  className="text-white w-full p-6 border bg-[#071F48] rounded-lg"
                  maxLength="1"
                  value={formik.values[`digit${index + 1}`]}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            {timer ?<Myh1 title={timer} /> : <p className="text-[#E0CDB6] cursor-pointer font-semibold" onClick={resendOtp}>Resend Otp</p>}
          </div>
          <Button1 text="Verify" style={{ marginTop: 40 }} />
        </form>
      </div>
    </div>
  );
}

export default EventOtp;

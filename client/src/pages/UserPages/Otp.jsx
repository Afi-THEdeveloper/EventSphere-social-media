import React, { useState, useEffect, useRef } from "react";
import Myh1 from "../../components/Myh1";
import Button1 from "../../components/Button1";
import { useFormik } from "formik";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { ServerVariables } from "../../utils/ServerVariables";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";

function Otp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [timer, setTimer] = useState(60);
  const dispatch = useDispatch();
  const digitsRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const email = location?.state?.email ? location.state.email : "";
  const forgetPassword = location?.state?.forgetPassword
    ? location?.state?.forgetPassword
    : false;

  useEffect(() => {
    if (email.length) {
      startTimer();
    } else {
      navigate(ServerVariables.Login);
    }
  }, []);

  const handleDigitChange = (e, index) => {
    formik.handleChange(e);
    const val = e.target.value;
    if (val && index < 3) {
      digitsRef.current[index + 1].focus();
    } else if (!val && index > 0) {
      digitsRef.current[index - 1].focus();
    }
  };

  const startTimer = () => {
    setTimer(60);
    clearInterval(timerIntervalRef.current); // Clear any existing interval before starting a new one
    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);
    timerIntervalRef.current = countdown; // Save the interval reference to clear it later
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

      dispatch(showLoading());
      userRequest({
        url: apiEndPoints.postRegisterOtp,
        method: "post",
        data: { otp: otp, email: email },
      })
        .then((res) => {
          dispatch(hideLoading());
          if (res.data.success) {
            if (forgetPassword) {
              return navigate(`${ServerVariables.changePassword}/${email}`);
            }
            navigate(ServerVariables.Login);
            toast.success(res.data.success);
          } else {
            toast.error(res.data.error);
          }
        })
        .catch((err) => {
          dispatch(hideLoading());
          toast.error(err.message);
        });
    },
  });

  const resendOtp = () => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.postResendOtp,
      method: "post",
      data: { email: email },
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        toast.success(res.data.success);
        set;
        startTimer();
      } else {
        toast.error("failed to resend,try again");
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
      <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
        <Myh1 title="Otp Verification" />
        <p className="myPara font-medium">We have send an OTP to your email.</p>
        <p className="myPara font-medium" style={{ marginBottom: 40 }}>
          valid for 1 minute ({timer})
        </p>
        <form onSubmit={formik.handleSubmit} noValidate>
          <div className="flex justify-between  mb-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="w-1/4 mr-2">
                <input
                  ref={(e) => (digitsRef.current[index] = e)}
                  type="text"
                  name={`digit${index + 1}`}
                  className="myTextColor w-full p-6 border myDivBg rounded-lg"
                  maxLength="1"
                  value={formik.values[`digit${index + 1}`]}
                  onChange={(e) => handleDigitChange(e, index)}
                  onBlur={formik.handleBlur}
                />
              </div>
            ))}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            {timer ? (
              <Myh1 title={timer} />
            ) : (
              <p
                className="myTextColor cursor-pointer font-semibold"
                onClick={resendOtp}
              >
                Resend Otp
              </p>
            )}
          </div>
          <Button1 text="Verify" style={{ marginTop: 40 }} />
        </form>
      </div>
    </div>
  );
}

export default Otp;

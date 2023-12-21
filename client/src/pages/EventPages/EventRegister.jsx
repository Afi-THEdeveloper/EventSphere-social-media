import React, { useState } from "react";
import Myh1 from "../../components/Myh1";
import AuthInput from "../../components/AuthInput";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Button1 from "../../components/Button1";
import { ServerVariables } from "../../utils/ServerVariables";
import { eventRequest, userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";

function EventRegister() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const registerSchema = Yup.object().shape({
    eventName: Yup.string()
      .min(3, "Event name must be atleast 3 characters")
      .required("Event name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.number()
    .typeError('Invalid number') // Handles non-numeric input
    .positive('Phone number must be a positive number') // Handles negative numbers
    .integer('Phone number must be an integer') // Handles non-integer input
    .test('len', 'Phone number must be exactly 10 characters', (val) => val && val.toString().length === 10)
    .required('Phone number is required'),
     altPhone: Yup.number()
    .typeError('Invalid number') // Handles non-numeric input
    .positive('Phone number must be a positive number') // Handles negative numbers
    .integer('Phone number must be an integer') // Handles non-integer input
    .test('len', 'Phone number must be exactly 10 characters', (val) => val && val.toString().length === 10)
    .required('Phone number is required'),
    Ownername:Yup.string()
      .min(3,'Owner name must be atleast 3 characters')  
      .required('owner name is required'),
    place:Yup.string()
      .min(4,'place must be atleast 4 characters')  
      .required('place is required'),
    services:Yup.string()
      .min(10,'services must be atleast 10 characters')  
      .required('services is required'),
    officeAddress:Yup.string()
      .min(15,'office address must be atleast 15 characters')  
      .required('office address is required'),

    password: Yup.string()
      .min(6, "Password must be atleast 6 characters")
      .required("Password is required"),
   
  });

  const formik = useFormik({
    initialValues: {
      eventName: "",
      Ownername:"",
      email: "",
      place:'',
      services:"",
      officeAddress:"",
      phone: "",
      altPhone:'',
      password: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      console.log(values)  
      dispatch(showLoading())
      let registerData = values;
      console.log(registerData);
      eventRequest({
        url: apiEndPoints.postEventRegisterData,
        method: "post",
        data: registerData,
      })
        .then((res) => {
          dispatch(hideLoading())
          console.log(res.data);
          if (res.data.success) {
            navigate(ServerVariables.eventOtp, {state : {email:res.data.email}});    
          } else {
            toast.error(res.data.error)
          }
        })
        .catch((err) => {
          dispatch(hideLoading())
          toast.error(err.message)
        });
    },
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
      <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
        <Myh1 title="Register Event" />
        <div className="w-full mt-10">
          <form onSubmit={formik.handleSubmit} noValidate>
            <AuthInput
              name="eventName"
              type="text"
              placeholder="Event name"
              value={formik.values.eventName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.eventName && formik.touched.eventName && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.eventName}
              </p>
            )}
            <AuthInput
              name="Ownername"
              type="text"
              placeholder="Owner name"
              value={formik.values.Ownername}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.Ownername && formik.touched.Ownername && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.Ownername}
              </p>
            )}
            <AuthInput
              name="place"
              type="text"
              placeholder="place"
              value={formik.values.place}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.place && formik.touched.place && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.place}
              </p>
            )}
            <AuthInput
              name="email"
              type="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.email}
              </p>
            )}
            <AuthInput
              name="phone"
              type="number"
              placeholder="Phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.phone && formik.touched.phone && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.phone}
              </p>
            )}
            <AuthInput
              name="altPhone"
              type="number"
              placeholder="Alternate Phone"
              value={formik.values.altPhone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.altPhone && formik.touched.altPhone && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.altPhone}
              </p>
            )}


            <textarea
              className="text-[#85ACEF] block w-full rounded-xl p-3 bg-[#1E1E1E] border-2  border-blue-950 mt-1"
              name="services"
              type="text"
              placeholder="services"
              value={formik.values.services}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.services && formik.touched.services && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.services}
              </p>
            )}
            <textarea
              className="text-[#85ACEF] block w-full rounded-xl p-3 bg-[#1E1E1E] border-2  border-blue-950 mt-3"
              name="officeAddress"
              type="text"
              placeholder="office Address"
              value={formik.values.officeAddress}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.officeAddress && formik.touched.officeAddress && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.officeAddress}
              </p>
            )}

            <AuthInput
              name="password"
              type="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.password && formik.touched.password && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.password}
              </p>
            )}
            
           
            <Button1 text="Register" style={{ marginTop: 10 }} />
            <Link
              to={ServerVariables.eventLogin}
              className="mt-2 h-10 w-full rounded-full px-4 text-sm font-semibold text-[#E0CDB6] bg-[#071F48] flex items-center justify-center"
            >
              Back to login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventRegister;

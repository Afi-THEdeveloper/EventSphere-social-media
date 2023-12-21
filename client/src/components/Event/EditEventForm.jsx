import React, { useState } from "react";
import Button2 from "../../components/Button2";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import Myh1 from "../../components/Myh1";
import AuthInput from "../../components/AuthInput";
import Button1 from "../../components/Button1";
import { ServerVariables } from "../../utils/ServerVariables";
import { eventRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { updateEvent } from "../../Redux/slices/EventAuthSlice";


function EditEventForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {event} = useSelector(state=> state.EventAuth)

  const registerSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Event title must be atleast 3 characters")
      .required("Event title is required"),
    phone: Yup.number()
      .typeError("Invalid number") // Handles non-numeric input
      .positive("Phone number must be a positive number") // Handles negative numbers
      .integer("Phone number must be an integer") // Handles non-integer input
      .test(
        "len",
        "Phone number must be exactly 10 characters",
        (val) => val && val.toString().length === 10
      )
      .required("Phone number is required"),
    altPhone: Yup.number()
      .typeError("Invalid number") // Handles non-numeric input
      .positive("Phone number must be a positive number") // Handles negative numbers
      .integer("Phone number must be an integer") // Handles non-integer input
      .test(
        "len",
        "Phone number must be exactly 10 characters",
        (val) => val && val.toString().length === 10
      )
      .required("Phone number is required"),
    ownerName: Yup.string()
      .min(3, "Owner name must be atleast 3 characters")
      .required("owner name is required"),
    place: Yup.string()
      .min(4, "place must be atleast 4 characters")
      .required("place is required"),
    services: Yup.string()
      .min(10, "services must be atleast 10 characters")
      .required("services is required"),
    officeAddress: Yup.string()
      .min(15, "office address must be atleast 15 characters")
      .required("office address is required"),

  });

  const formik = useFormik({
    initialValues: {
      title: event.title,
      ownerName: event.ownerName,
      place: event.place,
      services: event.services,
      officeAddress: event.officeAddress,
      phone: event.phone,
      altPhone: event.altPhone,
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      console.log(values);
      dispatch(showLoading());
      eventRequest({
        url: apiEndPoints.updateEvent,
        method: "post",
        data: values,
      })
        .then((res) => {
          dispatch(hideLoading());
          console.log(res.data);
          if (res.data.success) {
            toast.success(res.data.success)
            dispatch(updateEvent(res.data.event))
            navigate(ServerVariables.eventProfile)
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

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
      <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
        <Myh1 title="Update Event"/>
        <div className="w-full mt-10">
          <form onSubmit={formik.handleSubmit} noValidate>
            <AuthInput
              name="title"
              type="text"
              placeholder="Event title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.title && formik.touched.title && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.title}
              </p>
            )}
            <AuthInput
              name="ownerName"
              type="text"
              placeholder="Owner name"
              value={formik.values.ownerName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.ownerName && formik.touched.ownerName && (
              <p className="text-sm font-bold text-red-500">
                {formik.errors.ownerName}
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

            <div className="text-center">
              <Button1 text="Update" style={{ marginTop: 10 }} />
              <Button2 text="Cancel" style={{ marginTop: 10 }} onClick={()=> window.history.back()}/>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditEventForm;

import React, { useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { ServerVariables } from "../../utils/ServerVariables";
import toast from "react-hot-toast";
import Myh1 from "../../components/Myh1";
import AuthInput from "../../components/AuthInput";
import Button1 from "../../components/Button1";
import { updateUser } from "../../Redux/slices/AuthSlice";
import Button2 from "../../components/Button2";
import ErrorStyle from "../../components/ErrorStyle";
import UserNavbar from "../../components/User/UserNavbar";

function AddJobProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [file, setFile] = useState("");
  const [error, setError] = useState("");
  const registerSchema = Yup.object().shape({
    fullName: Yup.string()
      .min(5, "full name must be 5 characters")
      .required("full name is required"),
    phone: Yup.number()
      .min(10, "invalid number")
      .required("Phone number is required"),
    skills: Yup.string()
      .min(6, "skills must be atleast 6 character")
      .required("skills is required"),
    jobRole: Yup.string()
      .min(3, "Job role must be atleast 3 characters")
      .required("job role is required"),
    yearOfExperience: Yup.number()
      .min(0, "invalid year of experience")
      .required("year of experience is required"),
  });

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phone: "",
      skills: "",
      jobRole: "",
      yearOfExperience: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      if (!file) {
        setError("pdf is required");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }
      const data = new FormData();
      data.append("fullName", values?.fullName);
      data.append("phone", values?.phone);
      data.append("skills", values?.skills);
      data.append("jobRole", values?.jobRole);
      data.append("yearOfExperience", values?.yearOfExperience);
      data.append("file", file);

      dispatch(showLoading());
      let registerData = values;
      console.log(registerData);
      userRequest({
        url: apiEndPoints.addJobProfile,
        method: "post",
        data: data,
      })
        .then((res) => {
          dispatch(hideLoading());
          console.log(res.data);
          if (res.data.success) {
            toast.success(res.data.success);
            dispatch(updateUser(res.data.user));
            navigate(ServerVariables.userProfile);
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
    <>
      <UserNavbar />
      <div className="flex">
        <UserSidebar />

        <div className="flex-grow flex-shrink min-h-screen">
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
            <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
              <Myh1 title="Add job profile" />
              <div className="w-[270px] sm:w-full mt-10">
                <form onSubmit={formik.handleSubmit} noValidate>
                  <AuthInput
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.fullName && formik.touched.fullName && (
                    <p className="text-sm font-bold text-red-500">
                      {formik.errors.fullName}
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
                    name="skills"
                    type="text"
                    placeholder="Your Skills"
                    value={formik.values.skills}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.skills && formik.touched.skills && (
                    <p className="text-sm font-bold text-red-500">
                      {formik.errors.skills}
                    </p>
                  )}
                  <AuthInput
                    name="jobRole"
                    type="text"
                    placeholder="Job role you looking for..."
                    value={formik.values.jobRole}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.jobRole && formik.touched.jobRole && (
                    <p className="text-sm font-bold text-red-500">
                      {formik.errors.jobRole}
                    </p>
                  )}
                  <AuthInput
                    name="yearOfExperience"
                    type="number"
                    placeholder="no.of years Experience"
                    value={formik.values.yearOfExperience}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.yearOfExperience &&
                    formik.touched.yearOfExperience && (
                      <p className="text-sm font-bold text-red-500">
                        {formik.errors.yearOfExperience}
                      </p>
                    )}

                  <AuthInput
                    name="file"
                    type="file"
                    accept="application/pdf"
                    placeholder="upload your cv pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <ErrorStyle error={error} />

                  <div className="text-center">
                    <Button1 text="Add" style={{ marginTop: 10 }} />
                    <Button2
                      text="Cancel"
                      style={{ marginTop: 10 }}
                      onClick={() => window.history.back()}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddJobProfile;

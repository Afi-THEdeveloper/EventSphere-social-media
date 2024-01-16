import React, { useState } from "react";
import EventSideBar from "../../components/EventSideBar";
import Button1 from "../../components/Button1";
import Button2 from "../../components/Button2";
import AuthInput from "../../components/AuthInput";
import Myh1 from "../../components/Myh1";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import ErrorStyle from "../../components/ErrorStyle";
import { eventRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { ServerVariables } from "../../utils/ServerVariables";

function AddJobPost() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const salaryRegex = /^(not disclosed|\d+(\.\d+)?\s*-\s*\d+(\.\d+)?\s*LPA)$/i;
  const registerSchema = Yup.object().shape({
    title: Yup.string()
      .min(5, "job title must be atleast 5 characters")
      .required("job title is required"),
    jobType: Yup.string()
      .min(3, "job type must be atleast 3 characters")
      .required("job type is required"),
    location: Yup.string()
      .min(4, "location must be atleast 4 characters")
      .required("location is required"),
    experience: Yup.number()
      .typeError("Invalid experience")
      .positive("experience must be a positive") // Handles negative numbers
      .integer("experience must be an integer") // Handles non-integer input
      .max(30, "experience cannot be above 30")
      .required("experience is required"),
    vaccancies: Yup.number()
      .typeError("Invalid vaccancy")
      .positive("vaccancy must be a positive") // Handles negative numbers
      .integer("vaccancy must be an integer") // Handles non-integer input
      .max(100, "vaccancy cannot be above 100")
      .required("vaccancy is required"),

    salary: Yup.string()
      .matches(salaryRegex, "Invalid salary format")
      .required("Salary is required"),

    skills: Yup.string()
      .min(6, "skills must be atleast 6 characters")
      .required("skills is required"),
    JobDescription: Yup.string()
      .min(15, "job description must be atleast 15 characters")
      .required("job description is required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      jobType: "",
      location: "",
      experience: "",
      JobDescription: "",
      salary: "",
      skills: "",
      vaccancies: "",
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      eventRequest({
        url: apiEndPoints.addJobPost,
        method: "post",
        data: values,
      })
        .then((res) => {
          if (res.data.success) {
            toast.success("job posted successfully");
            navigate(ServerVariables.hirings);
          } else {
            toast.error(res.data.error);
          }
        })
        .catch((err) => {
          toast.error(err.message);
        });
    },
  });

  return (
    <>
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen">
          {/* form */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
            <div className="flex w-full flex-col max-w-[400px] items-center space-y-3 my-4">
              <Myh1 title="Add job post" />
              <div className="w-full mt-10">
                <form onSubmit={formik.handleSubmit} noValidate>
                  <AuthInput
                    name="title"
                    type="text"
                    placeholder="Job title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.title && formik.touched.title && (
                    <ErrorStyle error={formik.errors.title} />
                  )}
                  <AuthInput
                    name="jobType"
                    type="text"
                    placeholder="Job Type"
                    value={formik.values.jobType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <small className="text myPara">
                    full time,permanent,part time etc...
                  </small>
                  {formik.errors.jobType && formik.touched.jobType && (
                    <ErrorStyle error={formik.errors.jobType} />
                  )}
                  <AuthInput
                    name="location"
                    type="text"
                    placeholder="Job location"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.location && formik.touched.location && (
                    <ErrorStyle error={formik.errors.location} />
                  )}
                  <AuthInput
                    name="experience"
                    type="number"
                    placeholder="Experience (in years)"
                    value={formik.values.experience}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.experience && formik.touched.experience && (
                    <ErrorStyle error={formik.errors.experience} />
                  )}
                  <AuthInput
                    name="JobDescription"
                    type="text"
                    placeholder="Job Description"
                    value={formik.values.JobDescription}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.JobDescription &&
                    formik.touched.JobDescription && (
                      <ErrorStyle error={formik.errors.JobDescription} />
                    )}
                  <AuthInput
                    name="salary"
                    type="text"
                    placeholder="salary budget"
                    value={formik.values.salary}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <small className="text myPara">
                    format : 2-5 LPA or 'not disclosed' (only this format
                    accepted)
                  </small>
                  {formik.errors.salary && formik.touched.salary && (
                    <ErrorStyle error={formik.errors.salary} />
                  )}
                  <AuthInput
                    name="skills"
                    type="text"
                    placeholder="Skills Required"
                    value={formik.values.skills}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.skills && formik.touched.skills && (
                    <ErrorStyle error={formik.errors.skills} />
                  )}
                  <AuthInput
                    name="vaccancies"
                    type="number"
                    placeholder="Vaccancies"
                    value={formik.values.vaccancies}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.vaccancies && formik.touched.vaccancies && (
                    <ErrorStyle error={formik.errors.vaccancies} />
                  )}
                  <div className="text-center">
                    <Button1 text="Add" style={{ marginTop: 10 }} />
                    <Link
                      onClick={() => window.history.back()}
                      className="myBorder mt-2 h-10 w-full rounded-full px-4 text-sm font-semibold myTextColor border-2  flex items-center justify-center"
                    >
                      Cancel
                    </Link>
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

export default AddJobPost;

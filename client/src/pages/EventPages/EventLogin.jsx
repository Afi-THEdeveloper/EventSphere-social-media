import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button1 from "../../components/Button1";
import Button2 from "../../components/Button2";
import Myh1 from "../../components/Myh1";
import AuthInput from "../../components/AuthInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ServerVariables } from "../../utils/ServerVariables";
import HomeIcon from "../../components/icons/HomeIcon";
import { useDispatch } from "react-redux";
import { EventLoginThunk } from "../../Redux/slices/EventAuthSlice";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be atleast 6 characters")
    .required("Password is required"),
});

function EventLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(EventLoginThunk(values));
    },
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
      <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
        <Myh1 title="Event Login" />
        <div className="w-full mt-8">
          <div className="mt-2">
            <form onSubmit={formik.handleSubmit} noValidate>
              <AuthInput
                name="email"
                type="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.email && formik.touched.email && (
                <p className="text-sm font-bold text-red-600">
                  {formik.errors.email}
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

              <Button1 text="Login" style={{ marginTop: 8 }} type="submit" />
              <Link
                to={ServerVariables.eventRegister}
                className="mt-2 h-10 w-full rounded-full px-4 text-sm font-semibold text-[#E0CDB6] bg-[#071F48] flex items-center justify-center"
              >
                Register Event
              </Link>
            </form>
            <Link
              className="h-12 w-full px-4 py-8 text-[#E0CDB6] flex items-center justify-center"
              to={ServerVariables.Landing}
            >
              <Button2 text={<HomeIcon />} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventLogin;

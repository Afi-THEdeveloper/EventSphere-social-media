import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button1 from "../../components/Button1";
import Myh1 from "../../components/Myh1";
import AuthInput from "../../components/AuthInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ServerVariables } from "../../utils/ServerVariables";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../../Redux/slices/AuthSlice";
import Button2 from "../../components/Button2";
import HomeIcon from "../../components/icons/HomeIcon";
import ErrorStyle from "../../components/ErrorStyle";
import { FiEye, FiEyeOff } from "react-icons/fi";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be atleast 6 characters")
    .required("Password is required"),
});

function UserLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPswd, setShowPswd] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      dispatch(loginThunk(values));
    },
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
      <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
        <Myh1 title="User Login" />
        <div className="w-[270px] sm:w-full mt-8">
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
                <p className="text-xs sm:text-sm font-bold text-red-600">
                  {formik.errors.email}
                </p>
              )}
              <div className="relative">
                <AuthInput
                  name="password"
                  type={showPswd === true ? "text" : "password"}
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 mx-2"
                  onClick={() => setShowPswd(!showPswd)}
                >
                  {showPswd ? (
                    <FiEye color="white" />
                  ) : (
                    <FiEyeOff color="white" />
                  )}
                </button>
                <p className="myPara flex justify-end text-xs cursor-pointer mr-2" onClick={()=> navigate(ServerVariables.VerifyEmail)}>Forget password ?</p>
              </div>
              {formik.errors.password && formik.touched.password && (
                <ErrorStyle error={formik.errors.password} />
              )}

              <Button1 text="Login" style={{ marginTop: 8 }} type="submit" />
              <Link
                to={ServerVariables.Register}
                className="myTextColor myBorder text-[10px] sm:text-sm h-8 md:h-10 border-2 mt-2 w-full rounded-full px-4 text-sm font-semibold flex items-center justify-center"
              >
                Signup
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

export default UserLogin;

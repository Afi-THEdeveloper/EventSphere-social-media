import React, { useState } from "react";
import Myh1 from "../../components/Myh1";
import AuthInput from "../../components/AuthInput";
import Button1 from "../../components/Button1";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { ServerVariables } from "../../utils/ServerVariables";
import ErrorStyle from "../../components/ErrorStyle";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";

function ChangePassword() {
  const [showPswd, setShowPswd] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [confirmpassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { email } = useParams();

  const handleUpdate = () => {
    if (password.length === 0 || confirmpassword.length === 0) {
      setError("password is required");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    if (password.length < 6 || confirmpassword.length < 6) {
      setError("password must be at least 6 characters");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    if (password !== confirmpassword) {
      setError("password and confirmpassword must be same");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    userRequest({
      url: apiEndPoints.resetPassword,
      method: "put",
      data: {
        email,
        password,
      },
    })
      .then((res) => {
        if (res?.data?.success) {
          toast.success(res.data?.success);
          navigate(ServerVariables.Login);
        } else {
          toast.error(res?.data?.error);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
      <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
        <Myh1 title="reset password" />
        <div className="w-[270px] sm:w-full mt-8">
          <div className="mt-2">
            <AuthInput
              name="password"
              type="password"
              placeholder="set new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="relative">
              <AuthInput
                name="password"
                type={showPswd === true ? "text" : "password"}
                placeholder="confirm password"
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            </div>
            <ErrorStyle error={error} />
            <div className="flex-col justify-center my-2 gap-2">
              <Button1 text={"update"} onClick={handleUpdate} />
            </div>
            <div className="flex-col justify-center my-2 gap-2">
              <Button1
                text={"Cancel"}
                onClick={() => navigate(ServerVariables.Login)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;

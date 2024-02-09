import React, { useState } from "react";
import Myh1 from "../../components/Myh1";
import AuthInput from "../../components/AuthInput";
import Button1 from "../../components/Button1";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { ServerVariables } from "../../utils/ServerVariables";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function VerifyEmail() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleProceed = () => {
    userRequest({
      url: apiEndPoints.verifyEmail,
      method: "post",
      data: {
        email,
      },
    })
      .then((res) => {
        if (res?.data?.success) {
          navigate(ServerVariables.Otp, {
            state: { email, forgetPassword: true },
          });
        } else {
          toast.error(res?.data?.error);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
        <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
          <Myh1 title="verify email" />
          <div className="w-[270px] sm:w-full mt-8">
            <div className="mt-2">
              <AuthInput
                name="email"
                type="email"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex justify-center my-2">
                <Button1 text={"proceed"} onClick={handleProceed} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyEmail;

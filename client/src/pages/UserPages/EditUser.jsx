import React, { useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import AuthInput from "../../components/AuthInput";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Myh1 from "../../components/Myh1";
import ErrorStyle from "../../components/ErrorStyle";
import Button2 from "../../components/Button2";
import Button1 from "../../components/Button1";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { updateUser } from "../../Redux/slices/AuthSlice";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../utils/ServerVariables";
import UserNavbar from "../../components/User/UserNavbar";

function EditUser() {
  const { user } = useSelector((state) => state.Auth);
  const [username, setUsername] = useState(user.username);
  const [phone, setPhone] = useState(user.phone);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUpdate = () => {
    if (username.length === 0 || username.length < 4) {
      setError("user name is required and must be at least 4 characters");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    if (phone.length < 10 || phone.length > 10) {
      console.log(phone.length);
      setError("phone is invalid or must contaion 10 digits");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }
    const data = new FormData();
    const selectedImage = document.getElementById("upload");
    const image = selectedImage.files[0];

    if (!image) {
      setError("image is required");
      setTimeout(() => {
        setError("");
      }, 2000);
      return;
    }

    if (image) {
      if (image.type.startsWith("image")) {
        data.append("profile", image);
      } else {
        setError("only images are allowed to upload!");
        setTimeout(() => {
          setError("");
        }, 2000);
        return;
      }
    }
    data.append("username", username);
    data.append("phone", phone);

    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.editUser,
      method: "post",
      data: data,
    })
      .then((res) => {
        dispatch(hideLoading());
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
  };

  const handlePreview = (e) => {
    const file = e.target.files;
    if (!file.length) {
      return setPreview(null);
    }
    const url = URL.createObjectURL(e.target.files[0]);
    setPreview(url);
  };

  return (
    <>
      <UserNavbar />
      <div className="flex">
        <UserSidebar />

        <div className="flex-grow flex-shrink min-h-screen">
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
            <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
              <Myh1 title="Edit Profile" />
              <div className="w-[270px] sm:w-full mt-10">
                <AuthInput
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />

                <AuthInput
                  name="phone"
                  type="number"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

                <AuthInput
                  name="eventProfile"
                  type="file"
                  placeholder="choose image"
                  id="upload"
                  accept="image/*"
                  onChange={handlePreview}
                />
                <br />

                {preview && (
                  <div className="card">
                    <div className="card-header">Preview Image</div>
                    <div className="card-body">
                      <div className="d-flex justify-content-center">
                        <img
                          src={preview}
                          className="preview"
                          style={{
                            maxWidth: "500px",
                            objectFit: "cover",
                            maxHeight: "400px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {error && <ErrorStyle error={error} />}

                <div className="text-center">
                  <Button1
                    text="Update"
                    style={{ marginTop: 10 }}
                    onClick={handleUpdate}
                  />
                  <Button2
                    text="Cancel"
                    style={{ marginTop: 10 }}
                    onClick={() => window.history.back()}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditUser;

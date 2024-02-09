import React, { useState } from "react";
import Myh1 from "./Myh1";
import AuthInput from "./AuthInput";
import Button1 from "./Button1";
import Button2 from "./Button2";
import { eventRequest } from "../Helper/instance";
import { apiEndPoints } from "../utils/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateEvent } from "../Redux/slices/EventAuthSlice";
import { ServerVariables } from "../utils/ServerVariables";
import { useNavigate } from "react-router-dom";
import ErrorStyle from "./ErrorStyle";

function EditProfileForm({ title }) {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlePreview = (e) => {
    const file = e.target.files;
    if (!file.length) {
      return setPreview(null);
    }
    const url = URL.createObjectURL(e.target.files[0]);
    setPreview(url);
  };

  const handleUpdate = () => {
    const data = new FormData();
    const selectedImage = document.getElementById("upload");
    const file = selectedImage?.files[0];
    if (!file) {
      setError("image is required");
      return setTimeout(() => {
        setError("");
      }, 2000);
    }
    data.append("profile", file);

    eventRequest({
      url: apiEndPoints.updateEventProfile,
      method: "post",
      data: data,
    })
      .then((res) => {
        if (res.data.success) {
          toast.success(res.data.success);
          dispatch(updateEvent(res.data.event));
          navigate(ServerVariables.eventHome);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
      <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
        <Myh1 title={title} />
        <div className="w-[270px] sm:w-full mt-10">
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
  );
}

export default EditProfileForm;

import React, { useState } from "react";
import Myh1 from "./Myh1";
import AuthInput from "./AuthInput";
import Button1 from "./Button1";
import Button2 from "./Button2";
import { eventRequest } from "../Helper/instance";
import { apiEndPoints } from "../utils/api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { ServerVariables } from "../utils/ServerVariables";
import { useNavigate } from "react-router-dom";
import ErrorStyle from "./ErrorStyle";
import ImageCrop from "./ImageCrop";
import { hideLoading, showLoading } from "../Redux/slices/LoadingSlice";


function AddPostForm() {
  const [imageFile, setImageFile] = useState(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addCroppedImg = (file) => {
      setImageFile(file);
  };

  const handleAdd = () => {
    const data = new FormData();
    console.log(imageFile);
    if (!imageFile ) {
      setError("post image is required");
      return setTimeout(() => {
        setError("");
      }, 3000);
    }
    data.append("post", imageFile);
    if (location.length) {
      data.append("location", location);
    }
    if (description.length) {
      data.append("description", description);
    }   
    dispatch(showLoading());
    eventRequest({
      url: apiEndPoints.addPost,
      method: "post",
      data: data,
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data.success);
          navigate(ServerVariables.eventHome);
        } else {
          toast.error(res.data.error);
          navigate(ServerVariables.PlansAvailable)
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
      <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
        <Myh1 title='Add post' />
        <div className="w-[270px] sm:w-full mt-10">
          <AuthInput
            name="location"
            type="text"
            placeholder="Location(optional)"
            onChange={(e) => setLocation(e.target.value)}
          />
          <AuthInput
            name="description"
            type="text"
            placeholder="Description(optional)"
            onChange={(e) => setDescription(e.target.value)}
          />
          <ImageCrop onNewImageUrl={addCroppedImg} />
          {error && <ErrorStyle error={error} />}

          <div className="text-center">
            <Button1
              text="Update"
              style={{ marginTop: 10 }}
              onClick={handleAdd}
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

export default AddPostForm;

import React, { useState } from "react";
import EventSideBar from "../../components/EventSideBar";
import AuthInput from "../../components/AuthInput";
import Myh1 from "../../components/Myh1";
import ImageCrop from "../../components/ImageCrop";
import ErrorStyle from "../../components/ErrorStyle";
import Button1 from "../../components/Button1";
import Button2 from "../../components/Button2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { eventRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { ServerVariables } from "../../utils/ServerVariables";
import EventNavbar from "../../components/Event/EventNavbar";

function AddStory() {
  const [imageFile, setImageFile] = useState(null);
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
    if (!imageFile) {
      setError("story image is required");
      return setTimeout(() => {
        setError("");
      }, 3000);
    }
    data.append("post", imageFile);
    if (description.length) {
      data.append("description", description);
    }
    dispatch(showLoading());
    eventRequest({
      url: apiEndPoints.addStory,
      method: "post",
      data: data,
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data?.success);
          navigate(ServerVariables.eventHome);
        } else {
          toast.error(res.data?.error);
          navigate(ServerVariables.PlansAvailable);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  return (
    <>
      <EventNavbar />
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen">
          <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
            <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
              <Myh1 title="Add story" />
              <div className="w-[270px] sm:w-full mt-10">
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
        </div>
      </div>
    </>
  );
}

export default AddStory;

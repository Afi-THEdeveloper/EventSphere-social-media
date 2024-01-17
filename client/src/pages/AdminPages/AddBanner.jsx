import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AdminNavbar from "../../components/AdminNavbar";
import ImageCrop from "../../components/ImageCrop";
import ErrorStyle from "../../components/ErrorStyle";
import Button1 from "../../components/Button1";
import Button2 from "../../components/Button2";
import Myh1 from "../../components/Myh1";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { apiEndPoints } from "../../utils/api";
import { ServerVariables } from "../../utils/ServerVariables";
import { adminRequest } from "../../Helper/instance";
import AuthInput from "../../components/AuthInput";

function AddBanner() {
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addCroppedImg = (file) => {
    setImageFile(file);
  };

  const handleAdd = () => {
    const data = new FormData();
    if (title.length) {
      data.append("title", title);
    } else {
      setError("banner title is required");
      return setTimeout(() => {
        setError("");
      }, 3000);
    }
    if (description.length) {
      data.append("description", description);
    } else {
      setError("banner description is required");
      return setTimeout(() => {
        setError("");
      }, 3000);
    }
    console.log(imageFile);
    if (!imageFile) {
      setError("banner image is required");
      return setTimeout(() => {
        setError("");
      }, 3000);
    }
    data.append("banner", imageFile);

    dispatch(showLoading());
    adminRequest({
      url: apiEndPoints.addBanner,
      method: "post",
      data: data,
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data?.success) {
          toast.success(res.data?.success);
          navigate(ServerVariables?.BannersTable);
        } else {
          toast.error(res.data?.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  return (
    <>
      <AdminNavbar />
      <div className="flex-grow flex-shrink min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
          <div className="flex w-full flex-col max-w-[400px] items-center space-y-3">
            <Myh1 title="Add Banner" />
            <div className="w-full mt-10">
              <AuthInput
                name="title"
                type="text"
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="myDivBg text-[#85ACEF] block w-full rounded-xl p-3 mt-1"
                name="description"
                type="text"
                placeholder="Description(optional)"
                onChange={(e) => setDescription(e.target.value)}
              />
              <ImageCrop onNewImageUrl={addCroppedImg} />
              {error && <ErrorStyle error={error} />}

              <div className="text-center">
                <Button1
                  text="Add"
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
    </>
  );
}

export default AddBanner;

import React, { useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import AuthInput from "./AuthInput";
import Button2 from "./Button2";

function ImageCrop({ onNewImageUrl }) {
  const [avatarUrl, setNewAvatarUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [cropper, setCropper] = useState();

  function getNewAvatarUrl(e) {
    const file = e.target.files[0];
    if (file) {
      setNewAvatarUrl(URL.createObjectURL(file));
    }
  }

  const getCropData = async () => {
    console.log(cropper);
    if (cropper) {
      const file = await fetch(cropper.getCroppedCanvas().toDataURL())
        .then((res) => res.blob())
        .then((blob) => {
          return new File([blob], "newAvatar.png", { type: "image/png" });
        });
      if (file) {
        console.log(file);
        const url = URL.createObjectURL(file);
        setPreview(url);
        onNewImageUrl(file);
      }
    }
  };

  return (
    <>
      <AuthInput
        name="eventProfile"
        type="file"
        placeholder="choose image"
        id="upload"
        accept="image/*"
        onChange={getNewAvatarUrl}
      />
      <br />
      {avatarUrl && (
        <Cropper
          src={avatarUrl}
          style={{ height: 400, width: 400 }}
          initialAspectRatio={4 / 3}
          minCropBoxHeight={100}
          minCropBoxWidth={100}
          guides={false}
          checkOrientation={false}
          onInitialized={(instance) => {
            setCropper(instance);
          }}
        />
      )}
      {avatarUrl && <Button2 text="crop" onClick={getCropData} />}

      {preview && (
        <div className="card mt-2">
          <div className="card-header text-[#E0CDB6]">Preview</div>
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
    </>
  );
}

export default ImageCrop;

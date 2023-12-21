import React, { useState } from "react";
import EventSideBar from "../../components/EventSideBar";
import EditProfileForm from "../../components/EditProfileForm";

function EditEventProfile() {
  return (
    <>
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen">
          <EditProfileForm title='Update profile'/>
        </div>
      </div>
    </>
  );
}

export default EditEventProfile;

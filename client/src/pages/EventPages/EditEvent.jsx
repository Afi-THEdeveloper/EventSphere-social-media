import React, { useState } from "react";
import EventSideBar from "../../components/EventSideBar";
import EditEventForm from "../../components/Event/EditEventForm";
import EventNavbar from "../../components/Event/EventNavbar";

function EditEvent() {
  return (
    <>
      <EventNavbar />
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen">
          <EditEventForm />
        </div>
      </div>
    </>
  );
}

export default EditEvent;

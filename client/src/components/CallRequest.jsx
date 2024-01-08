import React from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";

const CallRequest = ({ isOpen, closeModal, sender, link }) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "100%",
            maxHeight: "90%",
            overflowY: "auto",
          },
        }}
      >
        <div className="h-screen flex justify-center items-center overflow-hidden select-none">
          <div
            className="relative border-2 border-solid border-slate-500 rounded-3xl w-80 "
            style={{ height: "35rem" }}
          >
            <img
              src={`http://localhost:5000/profiles/${sender?.profile}`}
              className="w-full h-full object-cover rounded-3xl border-2 border-white"
              alt=""
            />
            {/* TOP ICONS */}
            <div className="text-2xl text-white flex justify-between px-4 absolute top-0 left-0 right-0 py-4 bg-transparent font-semibold">
              <svg
                onClick={closeModal}
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 cursor-pointer hover:text-gray-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="font-bold">
                {sender?.username || sender?.title} calling...
              </span>
            </div>
            {/* BOTTOM ICONS */}
            <div className="absolute py-5 bottom-6 left-0 right-0 flex justify-around">
              <div
                onClick={closeModal}
                className="p-5 bg-red-600 text-white rounded-full ml-2 cursor-pointer hover:bg-red-600 transition-all duration-150 ease-linear"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <Link to={link}>
                <div className="p-5 bg-green-600 text-white rounded-full ml-2 cursor-pointer transition-all duration-150 ease-linear">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CallRequest;

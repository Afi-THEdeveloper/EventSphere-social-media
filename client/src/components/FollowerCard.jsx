import React, { useState } from "react";
import Modal from "react-modal";
import Myh1 from "./Myh1";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";

function FollowerCard({ isOpen, closeModal, items, role }) {
  const [persons, setPersons] = useState(items);
  const navigate = useNavigate();
  const handleClickPerson = (person) => {
    if (role === "user") {
      navigate(ServerVariables.showEvent, {
        state: { event: person },
      });
    } else {
      navigate(ServerVariables.showUser, {
        state: { user: person },
      });
    }
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            height: "500px",
            maxHeight: "500px",
            overflowY: "auto",
            backgroundColor: "rgb(24, 27, 35)",
          },
        }}
      >
        <Myh1
          title={
            role === "user"
              ? "following"
              : role === "event"
              ? "followers"
              : "Requested Users"
          }
        />

        {persons.length ? (
          persons?.map((person) => {
            return (
              <div
                onClick={() => handleClickPerson(person)}
                className="myDivBg myBorder border-y py-2 pl-4 flex items-center gap-2 cursor-pointer"
              >
                <div className="flex gap-4 py-2 pl-4 items-center">
                  <div className="flex gap-4 py-2 pl-4 items-center">
                    <div className="w-10 h-10 rounded-full">
                      <img
                        className="w-full h-42 object-cover"
                        src={`http://localhost:5000/profiles/${person?.profile}`}
                        alt=""
                      />
                    </div>
                    <span className="text-slate-500 font-bold">
                      {role === "user" ? person?.title : person?.username}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="myPara">No results</p>
        )}
      </Modal>
    </>
  );
}

export default FollowerCard;

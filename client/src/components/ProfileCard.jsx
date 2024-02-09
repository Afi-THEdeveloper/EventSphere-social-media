import React, { useEffect, useState } from "react";
import Button2 from "./Button2";
import EditIcon from "./icons/EditIcon";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";
import { PlusIcon } from "@heroicons/react/24/outline";
import { eventRequest } from "../Helper/instance";
import { apiEndPoints } from "../utils/api";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../Redux/slices/LoadingSlice";
import FollowerCard from "./FollowerCard";
import { API_BASE_URL } from "../config/api";

function ProfileCard({ event, postCount, story }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followers, setFollowers] = useState([]);
  const ProfileClickHandler = () => {
    if (story?.length) {
      navigate(ServerVariables.storyCourosel, { state: { stories: story } });
    } else {
      toast.error("no stories exists");
    }
  };

  const openModal = () => {
    dispatch(showLoading());
    eventRequest({
      url: apiEndPoints.getFollowers,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setFollowers(res.data?.followers);
          setIsModalOpen(true);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const customStyles = {
    content: {
      top: "30%",
      left: "50%",
      right: "auto",
      bottom: "30%",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };

  const handleAddStoryClick = () => {
    eventRequest({
      url: apiEndPoints.hasPlan,
      method: "get",
    })
      .then((res) => {
        if (res.data?.success) {
          navigate(ServerVariables.addStory);
        } else {
          toast.error(res?.data?.error);
          navigate(ServerVariables.PlansAvailable);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <>
      <div className="myDivBg relative max-w-md mx-auto md:max-w-2xl min-w-0 break-words  w-full mb-6 shadow-lg rounded-xl mt-20">
        <div className="px-6">
          <div className="flex flex-wrap justify-center">
            <div className="w-full flex justify-center">
              <div className="relative">
                <img
                  src={`${API_BASE_URL}/profiles/${event.profile}`}
                  className="shadow-xl rounded-full align-middle absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]  border-2 myBorder"
                  alt=""
                  onClick={ProfileClickHandler}
                />
              </div>
            </div>
            <div className="w-full text-center mt-20">
              <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                <div className="p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide myTextColor">
                    {postCount}
                  </span>
                  <span className="text-sm myTextColor">Posts</span>
                </div>
                <div
                  className="p-3 text-center cursor-pointer"
                  onClick={openModal}
                >
                  <span className="text-xl font-bold block uppercase tracking-wide myTextColor hover:text-white">
                    {event?.followers?.length}
                  </span>
                  <span className="text-sm myTextColor hover:text-white">
                    Followers
                  </span>
                </div>
                <div className="p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide myTextColor hover:bg-slate-500">
                    {
                      <EditIcon
                        onClick={() =>
                          navigate(ServerVariables.editProfileImage)
                        }
                      />
                    }
                  </span>
                </div>

                <div className="p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide">
                    <button
                      className="border p-2 rounded-full hover:bg-[#0F1015]"
                      onClick={handleAddStoryClick}
                    >
                      <PlusIcon className="myPara h-3 w-3" />
                    </button>
                  </span>
                  <span className="text-sm myTextColor">Add story</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-2">
            <h3 className="text-2xl myTextColor font-bold leading-normal mb-1">
              {event.title}
            </h3>
            <div className="text-xs mt-0 mb-2 myPara font-bold uppercase">
              <i className="fas fa-map-marker-alt mr-2 opacity-75"></i>
              {event.place}
            </div>
          </div>
          <div className="mt-6 py-6 border-t myBorder text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full px-4">
                <p className="font-light leading-relaxed myPara mb-4">
                  {`Owner:${event.ownerName},services:${event.services},phone:${
                    event?.phone
                  },${event.altPhone && event.altPhone},`}{" "}
                  <br />
                  {`officeAddress:${event.officeAddress}`}
                </p>
                <a
                  href="javascript:;"
                  className="font-normal text-slate-700 hover:text-slate-400"
                >
                  <Button2
                    text={<EditIcon />}
                    onClick={() => navigate(ServerVariables.editEvent)}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          ariaHideApp={false}
          style={customStyles}
        >
          {/* Use the CommentModal component */}
          <FollowerCard
            isOpen={isModalOpen}
            closeModal={closeModal}
            items={followers}
            role={"event"}
          />
        </Modal>
      </div>
    </>
  );
}

export default ProfileCard;

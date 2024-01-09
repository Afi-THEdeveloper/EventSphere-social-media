import React, { useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import EditIcon from "../../components/icons/EditIcon";
import { MdAssignmentAdd } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa6";
import Button2 from "../../components/Button2";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { ServerVariables } from "../../utils/ServerVariables";
import { useNavigate } from "react-router-dom";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import FollowerCard from "../../components/FollowerCard";

function UserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.Auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followings, setFollowings] = useState([]);

  const openModal = () => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.getFollowings,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data?.success) {
          setFollowings(res.data?.followings);
          setIsModalOpen(true);
        } else {
          toast.error(res.data?.error);
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

  return (
    <>
      <div className="flex">
        <UserSidebar />

        <div className="flex-grow flex-shrink min-h-screen">
          <div className="relative max-w-md mx-auto md:max-w-2xl min-w-0 break-words  w-full mb-6 shadow-lg rounded-xl mt-20">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full flex justify-center">
                  <div className="relative">
                    <img
                      src={`http://localhost:5000/profiles/${user?.profile}`}
                      className="shadow-xl rounded-full align-middle absolute -m-16 -ml-20 lg:-ml-16 max-w-[150px]  border-2 border-[#E0CDB6]"
                      alt=""
                    />
                  </div>
                </div>
                <div className="w-full text-center mt-20">
                  <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                    <div
                      onClick={openModal}
                      className="p-3 text-center cursor-pointer"
                    >
                      <span className="text-xl font-bold block uppercase tracking-wide text-slate-400 hover:text-slate-200">
                        {user?.following?.length}
                      </span>
                      <span className="text-sm text-slate-400 hover:text-slate-200">
                        Following
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2">
                <h3 className="text-2xl text-slate-400 font-bold leading-normal mb-1">
                  {user?.username}
                </h3>
                <div className="text-xs mt-0 mb-2 text-slate-300 font-bold uppercase">
                  <i className=" text-slate-400 opacity-75"></i>
                  {user?.phone}
                </div>
                <div className="text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-slate-400 hover:text-slate-500">
                    {
                      <EditIcon
                        onClick={() => navigate(ServerVariables.editUser)}
                      />
                    }
                  </span>
                </div>
              </div>

              {user.isJobSeeker ? (
                <div className="mt-6 py-6 border-t border-slate-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full px-4">
                      <h2 className="text-[#E0CDB6] font-medium">
                        Job profile and CV
                      </h2>
                      <p className="font-light leading-relaxed text-slate-300 mb-4">
                        <FaFilePdf
                          onClick={() =>
                            (window.location.href = `http://localhost:5000/files/${user?.jobProfile?.CV}`)
                          }
                          className="fill-slate-200 mx-[50%] h-8 w-8 mb-2"
                        />
                        {`Full name: ${user?.jobProfile?.fullName}, phone: ${user?.jobProfile?.phone}, skills: ${user?.jobProfile?.skills}`}{" "}
                        <br />
                        {`Job Role looking for : ${user?.jobProfile?.jobRole},year of Experience: ${user?.jobProfile?.yearOfExperience}`}{" "}
                        <br />
                      </p>

                      <Button2
                        text={<EditIcon />}
                        onClick={() => navigate(ServerVariables.editJobProfile)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 py-6 border-t border-slate-200 text-center">
                  <div className="flex flex-wrap justify-center">
                    <div className="w-full px-4">
                      <a className="font-normal text-[#E0CDB6]">
                        <Button2
                          text={<MdAssignmentAdd />}
                          onClick={() =>
                            navigate(ServerVariables.addJobProfile)
                          }
                        />
                        <br />
                        Add job Profile <br /> (so that you can apply for jobs
                        in events)
                      </a>
                    </div>
                  </div>
                </div>
              )}
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
            items={followings}
            role={"user"}
          />
        </Modal>
      </div>
    </>
  );
}

export default UserProfile;

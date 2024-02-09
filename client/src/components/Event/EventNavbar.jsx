import { Fragment, useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { ServerVariables } from "../../utils/ServerVariables";
import socket from "../User/SocketIo";
import { apiEndPoints } from "../../utils/api";
import { API_BASE_URL } from "../../config/api";
import { logout } from "../../Redux/slices/EventAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import CallRequest from "../CallRequest";
import { eventRequest } from "../../Helper/instance";

function EventNavbar() {
  const { event } = useSelector((state) => state.EventAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [CallModalOpen, setCallModalOpen] = useState(false);
  const [sender, setSender] = useState({});
  const [meetlink, setMeetlink] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    socket.on("eventNotification", (notification) => {
      toast.success(notification.message, { duration: 5000 });
    });

    socket.on("videoCallInvite", (data) => {
      setSender(data?.sender);
      setMeetlink(data?.meetlink);
      setCallModalOpen(true);
    });

    return () => {
      socket.off("eventNotification");
      socket.off("videoCallInvite");
    };
  }, []);

  useEffect(() => {
    eventRequest({
      url: apiEndPoints.getNotificationsCount,
      method: "get",
    })
      .then((res) => {
        setNotificationsCount(res.data?.count);
        if (location.pathname !== ServerVariables.eventChats) {
          setMsgCount(res.data?.MsgCount);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  }, [notificationsCount, msgCount]);

  const navigation = [
    { name: "Home", navigation: ServerVariables.eventHome, current: true },
    {
      name: "Messages",
      navigation: ServerVariables.eventChats,
      current: false,
    },
    {
      name: "Jobs & Hirings",
      navigation: ServerVariables.hirings,
      current: false,
    },
    {
      name: "Subscriptions",
      navigation: ServerVariables.PlansAvailable,
      current: false,
    },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

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

  const closeModal = () => {
    socket.emit("videoCallResponse", {
      userId: sender._id,
      accepted: false,
    });
    setCallModalOpen(false);
  };

  return (
    <>
      <Disclosure as="nav">
        {({ open }) => (
          <>
            <div className="md:hidden">
              <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                  <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                    {/* Mobile menu button*/}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <>
                          {msgCount > 0 && (
                            <div className="absolute z-10 ml-4 mb-2 bg-red-500 text-white text-xs w-3 h-3 flex items-center justify-center rounded-full p-2">
                              {msgCount}
                            </div>
                          )}
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-1 items-center justify-center sm:items-stretch">
                    <div className="flex flex-shrink-0 items-center">
                      <h1
                        className="myTextColor uppercase  max-[320px]:text-xs sm:text-xl md:text-2xl font-serif mx-6 cursor-pointer"
                        onClick={() => navigate(ServerVariables.eventHome)}
                      >
                        EventSphere
                      </h1>
                    </div>
                    <div className="hidden md:block sm:ml-6">
                      <div className="flex space-x-4">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            onClick={() => navigate(item.navigation)}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <button
                      type="button"
                      className="relative rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      onClick={() =>
                        navigate(ServerVariables.eventNotifications)
                      }
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      {notificationsCount > 0 && (
                        <div className="absolute ml-2 bg-red-500 text-white text-xs w-3 h-3 flex items-center justify-center rounded-full p-[6px]">
                          {notificationsCount}
                        </div>
                      )}
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex rounded-full  text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open event menu</span>
                          <img
                            className="h-8 w-8 rounded-full"
                            src={`${API_BASE_URL}/profiles/${event?.profile}`}
                            alt=""
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="myPara border myBorder absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={() =>
                                  navigate(ServerVariables.eventHome)
                                }
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm myPara cursor-pointer"
                                )}
                              >
                                Your Profile
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={() => dispatch(logout())}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 text-sm myPara cursor-pointer"
                                )}
                              >
                                Sign out
                              </a>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>

            {/* menu dropdown */}
            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    onClick={() => navigate(item.navigation)}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium cursor-pointer"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name === "Messages" && msgCount > 0 && (
                      <div className="absolute text-xs ml-20 bg-red-500 text-white w-4 h-4 flex items-center justify-center rounded-full p-2">
                        {msgCount}
                      </div>
                    )}
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
            <Modal
              isOpen={CallModalOpen}
              onRequestClose={closeModal}
              ariaHideApp={false}
              style={customStyles}
            >
              {/* Use the CommentModal component */}
              <CallRequest
                isOpen={CallModalOpen}
                closeModal={closeModal}
                sender={sender}
                link={meetlink}
              />
            </Modal>
          </>
        )}
      </Disclosure>
    </>
  );
}

export default EventNavbar;

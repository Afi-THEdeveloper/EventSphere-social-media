import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { useDispatch } from "react-redux";
import SubscriptionHistory from "../../components/Admin/SubscriptionHistory";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { FaMoneyBill } from "react-icons/fa";
import { ServerVariables } from "../../utils/ServerVariables";
import { adminRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";

function AdminHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [usersCount, setUsersCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [subscribedEvents, setSubscribedEvents] = useState(0);
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [weeklyRevenue, setWeeklyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);

  useEffect(() => {
    getDashboardDatas();
  }, []);

  const getDashboardDatas = async () => {
    dispatch(showLoading());
    adminRequest({
      url: apiEndPoints.getDashboardDetails,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res.data.success) {
        setUsersCount(res.data?.users);
        setEventsCount(res.data?.events);
        setSubscribedEvents(res.data?.subscribedEvents);
        setDailyRevenue(res.data?.dailyAmount);
        setWeeklyRevenue(res.data?.weeklyAmount);
        setMonthlyRevenue(res.data?.monthlyAmount);
      }
    });
  };

  return (
    <>
      <AdminNavbar hover={true} />
      <div className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 text-center">
        {/* dashboard */}

        <div className="min-h-full">
          <header className="shadow">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between">
              <h1 className="text-2xl font-bold tracking-tight myTextColor">
                Dashboard
              </h1>
              <p className="myPara">Today: {new Date(Date.now()).toLocaleString()}</p>
            </div>
          </header>
          {/* <!-- component --> */}

          <div class="flex flex-wrap myDivBg">
            <div class="mt-4 w-full lg:w-6/12 xl:w-4/12 px-5 mb-4">
              <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
                <div class="flex-auto p-4">
                  <div class="flex flex-wrap">
                    <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                        {" "}
                        Daily Revenue
                      </h5>
                      <span class="font-semibold text-3xl text-blueGray-700">
                        ₹ {dailyRevenue}.00
                      </span>
                    </div>
                    <div class="relative w-auto pl-4 flex-initial">
                      <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-blue-500">
                        <FaMoneyBill />
                      </div>
                    </div>
                  </div>
                  <p class="text-sm text-green-600 text-blueGray-400 mt-4">
                    <span class="whitespace-nowrap">
                      From events subscriptions
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-4 w-full lg:w-6/12 xl:w-4/12 px-5 mb-4">
              <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
                <div class="flex-auto p-4">
                  <div class="flex flex-wrap">
                    <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                        {" "}
                        Weekly Revenue
                      </h5>
                      <span class="font-semibold text-3xl text-blueGray-700">
                        ₹ {weeklyRevenue}.00
                      </span>
                    </div>
                    <div class="relative w-auto pl-4 flex-initial">
                      <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-red-500">
                        <FaMoneyBill />
                      </div>
                    </div>
                  </div>
                  <p class="text-sm text-green-600 text-blueGray-400 mt-4">
                    <span class="whitespace-nowrap">
                      From events subscriptions
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-4 w-full lg:w-6/12 xl:w-4/12 px-5 mb-4">
              <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
                <div class="flex-auto p-4">
                  <div class="flex flex-wrap">
                    <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                        {" "}
                        Monthly Revenue
                      </h5>
                      <span class="font-semibold text-3xl text-blueGray-700">
                        ₹ {monthlyRevenue}.00
                      </span>
                    </div>
                    <div class="relative w-auto pl-4 flex-initial">
                      <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-red-500">
                        <FaMoneyBill />
                      </div>
                    </div>
                  </div>
                  <p class="text-sm text-green-600 text-blueGray-400 mt-4">
                    <span class="whitespace-nowrap">
                      From events subscriptions
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-4 w-full lg:w-6/12 xl:w-4/12 px-5 mb-4">
              <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-3 xl:mb-0 shadow-lg">
                <div class="flex-auto p-4">
                  <div class="flex flex-wrap">
                    <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                        {" "}
                        Total Users
                      </h5>
                      <span class="font-semibold text-3xl text-blueGray-700">
                        {usersCount}
                      </span>
                    </div>
                    <div class="relative w-auto pl-4 flex-initial">
                      <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-red-500">
                        <UserCircleIcon />
                      </div>
                    </div>
                  </div>
                  <p class="text-sm text-blueGray-400 mt-4">
                    <span
                      class="whitespace-nowrap text-blue-500 cursor-pointer underline"
                      onClick={() => navigate(ServerVariables.UsersTable)}
                    >
                      View All Users...{" "}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class=" mt-4 w-full lg:w-6/12 xl:w-4/12 px-5">
              <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-4 xl:mb-0 shadow-lg">
                <div class="flex-auto p-4">
                  <div class="flex flex-wrap">
                    <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                        Total Events
                      </h5>
                      <span class="font-semibold text-3xl text-blueGray-700">
                        {eventsCount}
                      </span>
                    </div>
                    <div class="relative w-auto pl-4 flex-initial">
                      <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-pink-500">
                        <UserCircleIcon />
                      </div>
                    </div>
                  </div>
                  <p class="text-sm text-blueGray-400 mt-4">
                    <span
                      class="whitespace-nowrap text-blue-500 cursor-pointer underline"
                      onClick={() => navigate(ServerVariables.eventsTable)}
                    >
                      View All Events...{" "}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-4 w-full lg:w-6/12 xl:w-4/12 px-5">
              <div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg">
                <div class="flex-auto p-4">
                  <div class="flex flex-wrap">
                    <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
                      <h5 class="text-blueGray-400 uppercase font-bold text-xs">
                        Subscribed Events
                      </h5>
                      <span class="font-semibold text-3xl text-blueGray-700">
                        {subscribedEvents}{" "}
                      </span>
                    </div>
                    <div class="relative w-auto pl-4 flex-initial">
                      <div class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full  bg-emerald-500">
                        <UserCircleIcon />
                      </div>
                    </div>
                  </div>
                  <p class="text-sm text-blueGray-400 mt-4">
                    <span
                      class="whitespace-nowrap text-blue-500 cursor-pointer underline"
                      onClick={() => navigate(ServerVariables.eventsTable)}
                    >
                      View All Events...{" "}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <SubscriptionHistory />
      </div>
    </>
  );
}

export default AdminHome;

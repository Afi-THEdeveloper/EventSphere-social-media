import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { ServerVariables } from "./ServerVariables";
import { Toaster } from "react-hot-toast";

import LandingPage from "../pages/LandingPage";
import UserLogin from "../pages/UserPages/UserLogin";
import UserRegister from "../pages/UserPages/UserRegister";
import Otp from "../pages/UserPages/Otp";
import UserHome from "../pages/UserPages/UserHome";
import { useSelector } from "react-redux";
import AdminLogin from "../pages/AdminPages/AdminLogin";
import AdminHome from "../pages/AdminPages/AdminHome";
import IsloggedOutUser from "../components/IsloggedOutUser";
import IsLoggedInUser from "../components/IsLoggedInUser";
import UsersTable from "../pages/AdminPages/UsersTable";
import PlansTable from "../pages/AdminPages/PlansTable";
import AddPlan from "../pages/AdminPages/AddPlan";
import EditPlan from "../pages/AdminPages/EditPlan";
import EventLogin from "../pages/EventPages/EventLogin";
import EventRegister from "../pages/EventPages/EventRegister";
import EventOtp from "../pages/EventPages/EventOtp";
import EventHome from "../pages/EventPages/EventHome";
import IsLoggedEvent from "../components/IsLoggedEvent";
import IsLoggedOutEvent from "../components/IsLoggedOutEvent";
import IsAdminLogged from "../components/IsAdminLogged";
import IsAdminLoggedOut from "../components/IsAdminLoggedOut";
import EventsTable from "../pages/AdminPages/EventsTable";
import EventProfile from "../pages/EventPages/EventHome";
import EditEventProfile from "../pages/EventPages/EditEventProfile";
import EditEvent from "../pages/EventPages/EditEvent";
import AddPost from "../pages/EventPages/AddPost";
import PostDetail from "../pages/UserPages/PostDetail";
import AddStory from "../pages/EventPages/AddStory";
import StoryCourosel from "../components/StoryCourosel";

function AppRoutes() {
  const { loading } = useSelector((state) => state.loadings);

  return (
    <div>
      {/* loading spinner ui */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black-100 bg-opacity-90">
          <div className="text-blue-500 flex justify-center items-center">
            <svg
              class="animate-spin h-16 w-16 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.96 7.96 0 014 12H0c0 6.627 5.373 12 12 12v-4c-3.313 0-6.292-1.29-8.544-3.544l1.414-1.414z"
              ></path>
            </svg>
          </div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path={ServerVariables.Landing} element={<LandingPage />} />





        {/* user routes */}

        <Route element={<IsloggedOutUser />}>
          <Route path={ServerVariables.Login} element={<UserLogin />} />
          <Route path={ServerVariables.Register} element={<UserRegister />} />
          <Route path={ServerVariables.Otp} element={<Otp />} />
        </Route>

        <Route element={<IsLoggedInUser />}> {/* protected  */}
          <Route path={ServerVariables.UserHome} element={<UserHome />} />
          <Route path={ServerVariables.postDetails} element={<PostDetail />} />
        </Route>





        {/* admin routes */}
        <Route element={<IsAdminLogged />}>
          <Route path={ServerVariables.AdminHome} element={<AdminHome />} />
          <Route path={ServerVariables.UsersTable} element={<UsersTable />} />
          <Route path={ServerVariables.PlansTable} element={<PlansTable />} />
          <Route path={ServerVariables.AddPlan} element={<AddPlan />} />
          <Route path={ServerVariables.editPlan} element={<EditPlan />} />
          <Route path={ServerVariables.eventsTable} element={<EventsTable />} />
        </Route>

        <Route element={<IsAdminLoggedOut />}>
          <Route path={ServerVariables.AdminLogin} element={<AdminLogin />} />
        </Route>







        {/* event Routes */}

        <Route element={<IsLoggedEvent />}>
          <Route path={ServerVariables.eventHome} element={<EventHome />} />
          <Route path={ServerVariables.editProfileImage} element={<EditEventProfile />}/>
          <Route path={ServerVariables.editEvent} element={<EditEvent />} />
          <Route path={ServerVariables.addPost} element={<AddPost />} />
          <Route path={ServerVariables.addStory} element={<AddStory />} />
          <Route path={ServerVariables.storyCourosel} element={<StoryCourosel />} />
        </Route>

        <Route element={<IsLoggedOutEvent />}>
          <Route path={ServerVariables.eventLogin} element={<EventLogin />} />
          <Route path={ServerVariables.eventRegister} element={<EventRegister />}/>
          <Route path={ServerVariables.eventOtp} element={<EventOtp />} />
        </Route>





      </Routes>
    </div>
  );
}

export default AppRoutes;

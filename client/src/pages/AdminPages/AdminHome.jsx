import React from "react";
import AdminNavbar from "../../components/AdminNavbar";
import Button2 from "../../components/Button2";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/slices/AdminAuthSlice";


function AdminHome() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <AdminNavbar hover={true} />
      <div className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 text-center">
        <h1 className="uppercase text-3xl font-bold text-white mb-3">
          WELCOME TO ADMIN HOME
        </h1>
        <Button2 text="Logout" onClick={handleLogout} />
      </div>
    </>
  );
}

export default AdminHome;

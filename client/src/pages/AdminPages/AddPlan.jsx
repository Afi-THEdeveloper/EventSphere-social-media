import React, { useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { ServerVariables } from "../../utils/ServerVariables";
import Myh1 from "../../components/Myh1";
import AuthInput from "../../components/AuthInput";
import Button2 from "../../components/Button2";
import Button1 from "../../components/Button1";
import { adminRequest } from "../../Helper/instance";
import api from "../../config/api";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

function AddPlan() {
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [amount, setAmount] = useState();
  const [description, setDescription] = useState("");
  const navigate = useNavigate()

  const handleAddPlan = () => {
    console.log(duration);
    console.log("hy");
    if (
      name.length === 0 ||
      duration === "Choose" ||
      amount === null ||
      description.length === 0
    ) {
      setError("All fields are required");
      return setTimeout(() => {
        setError("");
      }, 2000);
    }
    if (name.length <= 3) {
      setError("name must contain atleast 3 characters");
      return setTimeout(() => {
        setError("");
      }, 2000);
    }
    if (description.length <= 5) {
      setError("description must contain atleast 5 characters");
      return setTimeout(() => {
        setError("");
      }, 2000);
    }
    if (amount <= 100) {
      setError("amount must be greater than 100/-");
      return setTimeout(() => {
        setError("");
      }, 2000);
    }

    adminRequest({
      url: apiEndPoints.addPlan,
      method: "post",
      data: {
        name,
        amount,
        description,
        duration,
      },
    }).then(res=>{
        if(res.data.success){
            toast.success(res.data.success)
            navigate(ServerVariables.PlansTable)
        }else{
            toast.error(res.data.error)
        }
    }).catch(err=>{
       toast.error(err)
    })
  };


  const renderDurationOptions = () => {
    switch (name.toLowerCase()) {
      case "weekly":
        return (
          <select
            id="duration"
            name="duration"
            autoComplete="duration-name"
            onChange={(e) => setDuration(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option>Choose</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        );
      case "monthly":
        return (
          <select
            id="duration"
            name="duration"
            autoComplete="duration-name"
            onChange={(e) => setDuration(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option>Choose</option>
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        );
      case "yearly":
        return (
          <select
            id="duration"
            name="duration"
            autoComplete="duration-name"
            onChange={(e) => setDuration(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option>Choose</option>
            {Array.from({ length: 3 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <select
            disabled
            id="duration"
            name="duration"
            autoComplete="duration-name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option>Choose</option>
          </select>
        );
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <header className="bg-black shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Add plan
            </h2>
          </div>
        </header>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3 ml-8 mr-8">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium leading-6 text-white"
            >
              Plan name
            </label>
            <div className="mt-2">
            <select
                id="duration"
                name="duration"
                autoComplete="duration-name"
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option>Choose</option>
                <option>weekly</option>
                <option>monthly</option>
                <option>yearly</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-3 ml-8 mr-8">
            <label
              htmlFor="last-name"
              className="block text-sm font-medium leading-6 text-white"
            >
              plan Amount
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="last-name"
                id="last-name"
                onChange={(e) => setAmount(e.target.value)}
                autoComplete="family-name"
                className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm  p-4 sm:leading-6"
              />
            </div>
          </div>

          <div className="col-span-full mr-8 ml-8">
            <label
              htmlFor="about"
              className="block text-sm font-medium leading-6 text-white"
            >
              Description
            </label>
            <div className="mt-2">
              <textarea
                id="about"
                name="about"
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm p-4 sm:leading-6"
                defaultValue={""}
              />
            </div>
          </div>

          <div className="sm:col-span-3 ml-8 mr-8">
            <label
              htmlFor="duration"
              className="block text-sm font-medium leading-6 text-white"
            >
              Choose Duration {name && `no of (${name})` }
            </label>
            <div className="mt-2">{renderDurationOptions()} </div>
          </div>
          <button
            onClick={handleAddPlan}
            class=" rounded-md bg-[#353a50] px-3 py-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4"
          >
            Add
          </button>
          <button type="button" onClick={()=> window.history.back()} className="text-sm font-semibold leading-6 text-white mt-2">
          Cancel
         </button>
          <div className="mt-7 w-full">
            {error && (
              <p className="text-sm font-bold text-red-600 ">{error}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AddPlan;

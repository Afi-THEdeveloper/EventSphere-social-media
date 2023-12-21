import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import Button2 from "../../components/Button2";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../utils/ServerVariables";
import { adminRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Search1 from "../../components/Search1";

function PlansTable() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [plans, setPlans] = useState([]);
  const [searched, setSearched] = useState("");

  useEffect(() => {
    getPlans();
  }, []);

  const getPlans = async () => {
    dispatch(showLoading());
    adminRequest({
      url: apiEndPoints.getPlans,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setPlans(res.data.plans);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        console.log(err);
      });
  };

  const blockPlan = async (id) => {
    const isBlocked = plans.find((plan) => plan._id === id)?.isDeleted;
    const result = await Swal.fire({
      title: isBlocked ? "Unblock Confirmation" : "Block Confirmation",
      text: isBlocked
        ? "Are you sure you want to Unblock this plan?"
        : "Are you sure you want to Block this plan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isBlocked ? "Unblock" : "Block",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      dispatch(showLoading());

      adminRequest({
        url: apiEndPoints.blockPlan,
        method: "post",
        data: { id: id },
      }).then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data.success);
          getPlans();
        } else {
          toast.error(res.data.error);
        }
      });
    }
  };

  const GetEditPlan = (id)=>{
    const plan = plans.filter(plan => plan._id === id)
    console.log(plan)
    return navigate(ServerVariables.editPlan, {state:{planToEdit:plan}})
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-full">
        <header className="bg-black shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              SUBSCRIPTION PLANS
            </h2>
            <Search1 search='Search Plan' value={searched}  onChange={(e)=> setSearched(e.target.value)}/>
            <Button2
              text="Add Plan"
              onClick={() => navigate(ServerVariables.AddPlan)}
            />
          </div>
        </header>

        <main>
          <div className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
              {/* Your content */}
              <table className="min-w-full bg-gray-100 border border-gray-300">
                <thead className="bg-gray-400">
                  <tr>
                    <th className="border-b p-4">Sl No:</th>
                    <th className="border-b p-4">Name</th>
                    <th className="border-b p-4">Description</th>
                    <th className="border-b p-4">Amount</th>
                    <th className="border-b p-4">Duration</th>
                    <th className="border-b p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.filter((item)=>{   
                     return searched.toLowerCase() === "" ? item
                     : item.name.toLowerCase().includes(searched) ||  
                       item.duration.toString().includes(searched)       ||
                       item.amount.toString().includes(searched)       ||
                       item.description.toLowerCase().includes(searched)
                  }).map((plan, index) => {
                    return (
                      <tr key={plan._id}>
                        <td className="border-b p-4 text-center">
                          {index + 1}
                        </td>
                        <td className="border-b p-4 text-center">
                          {plan.name}
                        </td>
                        <td className="border-b p-4 text-center">
                          {plan.description}
                        </td>
                        <td className="border-b p-4 text-center">
                          {plan.amount}
                        </td>
                        <td className="border-b p-4 text-center">
                          {plan.duration}
                        </td>
                        <td className="text-center">

                          <button onClick={()=> GetEditPlan(plan._id)} className="text-white bg-gray-500 mr-2 mb-2 px-2 py-1 rounded-full w-20 md:w-24 h-8 md:h-10">Edit</button>
                          <button
                            className={`${
                              plan.isDeleted ? "bg-red-500" : "bg-green-500"
                            } text-white px-2 py-1 rounded-full w-20 md:w-24 h-8 md:h-10`}
                            onClick={() => {
                              blockPlan(plan._id);
                            }}
                          >
                            {plan.isDeleted ? "Blocked" : "Block"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default PlansTable;

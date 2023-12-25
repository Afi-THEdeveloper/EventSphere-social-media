import React, { useEffect, useState } from "react";
import EventSideBar from "../../components/EventSideBar";
import { eventRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import Button2 from "../../components/Button2";

function Plans() {
  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    getPlans();
  }, []);

  const getPlans = () => {
    eventRequest({
      url: apiEndPoints.AvailablePlans,
      method: "get",
    })
      .then((res) => {
        setPlans(res.data.plans);
        setCurrentPlan(res.data.currentPlan);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleSubscribe = async (id) => {
    const result = await Swal.fire({
      title: "Purchase plan",
      text: "Are you sure to purchase this plan?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1F2937",
      cancelButtonColor: "#d33",
      confirmButtonText: "Buy",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      dispatch(showLoading());
      eventRequest({
        url: apiEndPoints.subscribePlan,
        method: "post",
        data: { planId: id },
      })
        .then(async (res) => {
          dispatch(hideLoading());
          if (res.data.success) {
            window.location.href = res.data.approvalUrl;
          } else {
            toast.error(res.data.error);
          }
        })
        .catch((err) => {
          dispatch(hideLoading());
          toast.error(err.message);
        });
    }
  };

  return (
    <>
      <div className="flex">
        <EventSideBar />
        <div className="min-h-screen bg-black-100 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-4">
            {/* current plan div */}
            {currentPlan ? (
              <div className="text-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
                <h2 className="text-xl text-[#e2c8a8] font-semibold mb-4">
                  Current plan
                </h2>
                <h2 className="text-xl font-semibold mb-4">{`${currentPlan?.name} (${currentPlan?.duration})`}</h2>
                <h1 className="text-white mb-4 font-bold">
                  ₹{currentPlan?.amount?.toFixed()}
                </h1>
                <small className="mb-4 max-w-10">{`${currentPlan?.totalDays} days Scheme`}</small>
                <br />

                <small className="mb-4 max-w-10 text-red-500">{`expires on ${currentPlan.expiresOn}`}</small>
              </div>
            ) : (
              <div className="text-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 border-2">
                <h3 className="text-[#FFB992]">- You have no plans now</h3>
                <p className="text-[#FFB992]">- Purchase one and explore your event..</p>
              </div>
            )}

            {plans.length ? (
              plans.map((plan, index) => (
                <div
                  key={index}
                  className="border-4 border-[#e2c8a8] text-white p-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
                >
                  <h2 className="text-xl font-semibold mb-4">{`${plan.name} (${plan.duration})`}</h2>
                  <h1 className="text-white mb-4 font-bold">
                    ₹{plan.amount.toFixed()}
                  </h1>
                  <small className="mb-4 max-w-10">{`available for ${plan.totalDays} days`}</small>
                  <br />
                  <small className="mb-4 max-w-10">{plan.description}</small>
                  <br />

                  <Button2
                    text="Subscribe"
                    onClick={() => handleSubscribe(plan._id)}
                  />
                </div>
              ))
            ) : (
              <div className="text-center">
                <p className="text-[#FFB992]">No plans Available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Plans;

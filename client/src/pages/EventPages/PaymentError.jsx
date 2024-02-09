import React from "react";
import EventSideBar from "../../components/EventSideBar";
import Button2 from "../../components/Button2";
import { ServerVariables } from "../../utils/ServerVariables";
import { useNavigate } from "react-router-dom";
import EventNavbar from "../../components/Event/EventNavbar";

function PaymentError() {
  const navigate = useNavigate();
  return (
    <>
      <EventNavbar />
      <div className="flex">
        <EventSideBar />
        <div className="flex-grow flex-shrink min-h-screen">
          <div className="h-screen">
            <div className="myDivBg p-6 m-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-red-500 w-16 h-16 mx-auto my-6"
              >
                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm4.207 12.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path>
              </svg>
              <div className="text-center">
                <h3 className="myTextColor md:text-2xl text-base font-semibold text-center">
                  Payment Cancelled
                </h3>
                <p className="myPara my-2">Try again ...</p>
                <p className="myPara"> check if any invalid steps done </p>
                <div className="py-10 text-center">
                  <Button2
                    text="Go back"
                    onClick={() => navigate(ServerVariables.PlansAvailable)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentError;

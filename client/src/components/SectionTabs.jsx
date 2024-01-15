import React, { useState } from "react";
import JobCard from "./JobCard";
import { useSelector } from "react-redux";
import Myh1 from "./Myh1";

const SectionTabs = ({ sections }) => {
  const [openTab, setOpenTab] = useState(1);
  const { user } = useSelector((state) => state.Auth);

  return (
    <>
      <div className="font-sans flex h-screen items-center justify-center">
        <div className="myDivBg p-12">
          <h1 className="myTextColor uppercase my-4">Job Stats</h1>

          <div className="max-w-md mx-auto">
            <div className="myDivBg mb-4 flex space-x-4 p-2 rounded-lg shadow-md">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => setOpenTab(index + 1)}
                  className={`flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ${
                    openTab === index + 1 ? "activeBg myTextColor" : "myPara"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {sections?.map((section, index) => (
              <div
                key={index}
                style={{
                  display: openTab === index + 1 ? "block" : "none",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
                className="myDivBg transition-all duration-300 p-4 rounded-lg shadow-md border-l-4 border-blue-600"
              >
                {section?.data.length ? (
                  <p className="text-xl font-semibold mb-2 myTextColor">
                    {section.label}
                  </p>
                ) : (
                  <p className="text-md font-semibold mb-2 myPara">
                    {section.label === "Applied Jobs"
                      ? "you are not applied for any jobs"
                      : "no invitations"}
                  </p>
                )}
                <div>
                  {section?.data.map((item) => (
                    <JobCard
                      key={item.id}
                      jobPost={item}
                      role={"user"}
                      userId={user?._id}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionTabs;

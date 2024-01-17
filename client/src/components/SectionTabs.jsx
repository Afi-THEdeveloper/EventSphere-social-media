import React, { useState } from "react";
import JobCard from "./JobCard";
import { useSelector } from "react-redux";
import { ServerVariables } from "../utils/ServerVariables";
import { useNavigate } from "react-router-dom";
import JobCard2 from "./JobCard2";

const SectionTabs = ({ sections, role }) => {
  const [openTab, setOpenTab] = useState(1);
  const { user } = useSelector((state) => state.Auth);
  const navigate = useNavigate();

  const handleClickPerson = (person) => {
    if (role === "event") {
      navigate(ServerVariables.showUser, {
        state: { user: person },
      });
    }
  };

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

            {role !== "event" &&
              sections?.map((section, index) => (
                <div
                  key={index}
                  style={{
                    display: openTab === index + 1 ? "block" : "none",
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                  className="myDivBg transition-all duration-300 p-4 rounded-lg shadow-md border-l-4 border-blue-600"
                >
                  {section?.data.length === 0 && (
                    <p className="text-md font-semibold mb-2 myPara">
                      {section.label === "Applied Jobs"
                        ? "you are not applied for any jobs"
                        : "no invitations"}
                    </p>
                  )}
                  <div>
                    {section?.data.map((item) => (
                      <JobCard
                        key={item._id}
                        jobPost={item}
                        role={"user"}
                        userId={user?._id}
                      />
                    ))}
                  </div>
                </div>
              ))}

            {role === "event" &&
              sections?.map((section, index) => (
                <div
                  key={index}
                  style={{
                    display: openTab === index + 1 ? "block" : "none",
                    maxHeight: "400px",
                    overflowY: "auto",
                  }}
                  className="myDivBg transition-all duration-300 p-4 rounded-lg shadow-md border-l-4 border-blue-600"
                >
                  {section?.data.length === 0 && (
                    <p className="text-md font-semibold mb-2 myPara">
                      {section.label === "Applied Candidates"
                        ? "No candidates applied"
                        : "Not selected any Candidates"}
                    </p>
                  )}

                  {/* tabs */}
                  <div className="mb-20">
                    {section?.data.map((item) => {
                      return (
                        <div
                          onClick={() => handleClickPerson(item)}
                          className="myDivBg myBorder border-y py-2 pl-4 flex items-center gap-2 cursor-pointer"
                        >
                          <div className="flex gap-4 py-2 pl-4 items-center">
                            <div className="flex gap-4 py-2 pl-4 items-center">
                              <div className="w-10 h-10 rounded-full">
                                <img
                                  className="w-full h-42 object-cover"
                                  src={`http://localhost:5000/profiles/${item?.profile}`}
                                  alt=""
                                />
                              </div>
                              <span className="text-slate-500 font-bold">
                                {item?.username}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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

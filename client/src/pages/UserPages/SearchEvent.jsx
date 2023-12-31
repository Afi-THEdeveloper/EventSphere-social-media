import React, { useEffect, useState } from "react";
import UserSidebar from "../../components/User/UserSidebar";
import Myh1 from "../../components/Myh1";
import ProfileCard2 from "../../components/ProfileCard2";
import Search1 from "../../components/Search1";
import ReactPaginate from "react-paginate";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { userRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import { updateUser } from "../../Redux/slices/AuthSlice";
import { updateEvent } from "../../Redux/slices/EventAuthSlice";
import { ServerVariables } from "../../utils/ServerVariables";

function SearchEvent() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.Auth);
  const [events, setEvents] = useState([]);
  const [filterData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Initialize current page
  const [pageCount, setPageCount] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    getEvents();
  }, [currentPage]);

  const getEvents = async () => {
    dispatch(showLoading());
    userRequest({
      url: `${apiEndPoints.searchEvents}?page=${currentPage + 1}`,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setEvents(res.data.events);
          setFilteredData(res.data.events);
          setPageCount(res.data.totalPages);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        console.log(err);
      });
  };

  const handleFilter = (e) => {
    const newData = filterData?.filter((item) =>
      item.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setEvents(newData);
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); // Update current page when page is changed
  };

  const handleFollow = (eventId) => {
    console.log(eventId);
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.followEvent,
      method: "post",
      data: { eventId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          dispatch(updateUser(res.data.user));
          dispatch(updateEvent(res.data.event));
          getEvents();
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const handleUnFollow = (eventId) => {
    dispatch(showLoading());
    userRequest({
      url: apiEndPoints.unfollowEvent,
      method: "post",
      data: { eventId },
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          dispatch(updateUser(res.data.user));
          dispatch(updateEvent(res.data.event));
          getEvents();
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        toast.error(err.message);
      });
  };

  const handleViewProfile = (event) => {
    navigate(ServerVariables.showEvent, {
      state: { event: event },
    });
  };


  return (
    <>
      <div className="flex">
        <UserSidebar />

        <div className="flex-grow flex-shrink min-h-screen">
          <div className="max-w-full w-full h-30 border-b-[0.5px] border-[#E0CDB6] mx-auto p-4 overflow-x-auto">
            <div className="flex justify-center gap-4">
              <Myh1 title="search Events" />
              <Search1 search={"search Event"} onChange={handleFilter} />
            </div>
          </div>
          {events?.length ? (
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 m-6 mb-8"
            >
              {events.map((event) => {
                return (
                  <ProfileCard2
                    key={event._id}
                    item={event}
                    currentUser={user}
                    follow={() => handleFollow(event._id)}
                    unfollow={() => handleUnFollow(event._id)}
                    viewProfile={() => handleViewProfile(event)}
                    bgColor="slate-800"
                    textColor="slate-500"
                    role="user"
                  />
                );
              })}
            </ul>
          ) : (
            <div className="">
              <p className="text-white">No events</p>
            </div>
          )}
          <ReactPaginate
            previousLabel={<i className="fas fa-chevron-left text-white"></i>}
            nextLabel={<i className="fas fa-chevron-right text-white"></i>}
            breakLabel={<span className="hidden sm:inline">...</span>}
            pageCount={pageCount}
            marginPagesDisplayed={3}
            pageRangeDisplayed={2}
            onPageChange={handlePageChange}
            containerClassName="flex justify-center mt-4"
            pageClassName="mx-2"
            pageLinkClassName="cursor-pointer transition-colors duration-300 hover:text-blue-500 text-slate-200"
            previousClassName="mr-2"
            previousLinkClassName="cursor-pointer transition-colors duration-300 hover:text-blue-500"
            nextClassName="ml-2"
            nextLinkClassName="cursor-pointer transition-colors duration-300 hover:text-blue-500"
            breakClassName="mx-2"
            breakLinkClassName="cursor-pointer transition-colors duration-300 hover:text-blue-500"
            activeClassName="text-blue-500 font-bold bg-blue-950"
          />
        </div>
      </div>
    </>
  );
}

export default SearchEvent;

import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../../utils/ServerVariables";
import { adminRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Search1 from "../../components/Search1";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";

function EventsTable() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filterData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Initialize current page
  const [pageCount, setPageCount] = useState(0);
  const dispatch = useDispatch();

  const cols = [
    {
      name: "Sl",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "Event",
      selector: (row) => row?.title,
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row?.phone,
      sortable: true,
    },
    {
      name: "Plan Expiry",
      selector: (row) => {
        return row?.selectedPlan
          ? row?.selectedPlan.expiry.toDateString()
          : "No plan";
      },
      sortable: true,
    },
    {
      name: "Verified",
      selector: (row) => (row.isVerified ? "yes" : "No"),
      sortable: true,
    },
    {
      name: "Actions",
      selector: (row) => (
        <button
          className={`${
            row.isBlocked ? "bg-red-500" : "bg-green-500"
          } text-white px-2 py-1 rounded-full w-20 md:w-24 h-8 md:h-10`}
          onClick={() => {
            blockEvent(row._id);
          }}
        >
          {row.isBlocked ? "blocked" : "Block"}
        </button>
      ),
    },
  ];

  useEffect(() => {
    getEvents();
  }, [currentPage]);

  const getEvents = async () => {
    dispatch(showLoading());
    adminRequest({
      url: `${apiEndPoints.getEvents}?page=${currentPage + 1}`,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setEvents(res.data.events);
          setFilteredData(res.data.events);
          setPageCount(res.data.totalPages)
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        console.log(err);
      });
  };

  const blockEvent = async (id) => {
    const isBlocked = events.find((plan) => plan._id === id)?.isBlocked;
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
        url: apiEndPoints.blockEvent,
        method: "post",
        data: { id: id },
      }).then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data.success);
          getEvents();
        } else {
          toast.error(res.data.error);
        }
      });
    }
  };

  const handleFilter = (e) => {
    const newData = filterData?.filter(
      (item) =>
        item.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.phone.toString().includes(e.target.value)
    );
    setEvents(newData);
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); // Update current page when page is changed
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-full">
        <header className="bg-black shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              EVENTS
            </h2>
            <div className="relative">
              <Search1 search="Search Event" onChange={handleFilter} />
            </div>
          </div>
        </header>

        <main>
          <div className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
              {/* Your content */}
              <DataTable columns={cols} data={events} />
              <ReactPaginate
                previousLabel={
                  <i className="fas fa-chevron-left text-white"></i>
                }
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
        </main>
      </div>
    </>
  );
}

export default EventsTable;

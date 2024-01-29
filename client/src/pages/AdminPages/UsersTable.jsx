import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { useDispatch } from "react-redux";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { adminRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Search1 from "../../components/Search1";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import { API_BASE_URL } from "../../config/api";

function UsersTable() {
  const [users, setUsers] = useState([]);
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
      name: "profile",
      selector: (row) => (
        <img
          className="h-10 w-10 rounded-full"
          src={`${API_BASE_URL}/profiles/${row?.profile}`}
          alt="image"
        />
      ),
    },
    {
      name: "Name",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Mobile",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
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
            blockUser(row._id);
          }}
        >
          {row.isBlocked ? "blocked" : "Block"}
        </button>
      ),
    },
  ];

  useEffect(() => {
    getUsers();
  }, [currentPage]);

  const getUsers = () => {
    dispatch(showLoading());
    adminRequest({
      url: `${apiEndPoints.getUsers}?page=${currentPage + 1}`, // Adjust the endpoint to include the page
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setUsers(res.data.users);
          setFilteredData(res.data.users);
          setPageCount(res.data.totalPages);
        }
      })
      .catch((err) => {
        console.log("no users", err);
        toast.error("something went wrong");
      });
  };

  const blockUser = async (id) => {
    const isBlocked = users.find((user) => user._id === id)?.isBlocked;
    const result = await Swal.fire({
      title: isBlocked ? "Unblock Confirmation" : "Block Confirmation",
      text: isBlocked
        ? "Are you sure you want to Unblock this User?"
        : "Are you sure you want to Block this User?",
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
        url: apiEndPoints.blockUser,
        method: "post",
        data: { id: id },
      }).then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data.success);
          getUsers();
        } else {
          toast.error(res.data.error);
        }
      });
    }
  };

  const handleFilter = (e) => {
    const newData = filterData?.filter(
      (item) =>
        item.username.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.phone.toString().includes(e.target.value)
    );
    setUsers(newData);
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); // Update current page when page is changed
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-full">
        <header className="bg-black shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 flex users-center justify-between sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              USERS
            </h1>
            <div className="relative">
              <Search1 search="Search User" onChange={handleFilter} />
            </div>
          </div>
        </header>

        <main>
          <div className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
              <DataTable columns={cols} data={users} />
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

export default UsersTable;

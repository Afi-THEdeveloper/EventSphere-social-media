import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { adminRequest } from "../../Helper/instance";
import { apiEndPoints } from "../../utils/api";
import Search1 from "../Search1";

function SubscriptionHistory() {
  const [paymentsHistory, setPaymentsHistory] = useState([]);
  const dispatch = useDispatch();
  const [filterData, setFilterData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const cols = [
    {
      name: "Sl",
      selector: (row, index) => index + 1,
      sortable: true,
    },
    {
      name: "purchased On",
      selector: (row) => new Date(row?.startDate).toLocaleString(),
      sortable: true,
    },
    {
      name: "plan Expiry date",
      selector: (row) => new Date(row?.expireDate).toLocaleString(),
      sortable: true,
    },

    {
      name: "Event email",
      selector: (row) => `${row?.event?.email}`,
      sortable: true,
    },
    {
      name: "Plan name",
      selector: (row) => row?.plan?.name,
      sortable: true,
    },
    {
      name: "Amount",
      selector: (row) => row?.plan?.amount,
      sortable: true,
    },
  ];

  useEffect(() => {
    getHistory();
  }, [currentPage]);

  const getHistory = async () => {
    dispatch(showLoading());
    adminRequest({
      url: `${apiEndPoints.getSubscriptionHistory}?page=${currentPage + 1}`,
      method: "get",
    }).then((res) => {
      dispatch(hideLoading());
      if (res?.data?.success) {
        setPaymentsHistory(res.data.payments);
        setFilterData(res?.data?.payments);
        setPageCount(res?.data?.totalPages);
      }
    });
  };

  const handleFilter = (e) => {
    console.log(e.target.value)
    const newData = filterData?.filter(
      (item) =>
        item.event.title.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.event.phone.toString().includes(e.target.value) ||
        item.plan.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.plan.amount.toString().includes(e.target.value)
    );
    setPaymentsHistory(newData);
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected); // Update current page when page is changed
  };

  return (
    <>
      <div className="container mx-auto mt-8">
        <header className="shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Subscription history
            </h2>
            <div className="relative">
              <Search1 search="Search History" onChange={handleFilter} />
            </div>
          </div>
        </header>
        <main>
          <div className="mt-8 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
              {/* Your content */}
              <DataTable columns={cols} data={paymentsHistory} />
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

export default SubscriptionHistory;

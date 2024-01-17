import React, { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import Search1 from "../../components/Search1";
import Button2 from "../../components/Button2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { apiEndPoints } from "../../utils/api";
import { hideLoading, showLoading } from "../../Redux/slices/LoadingSlice";
import { adminRequest } from "../../Helper/instance";
import { ServerVariables } from "../../utils/ServerVariables";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

function Banners() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [banners, setBanners] = useState([]);
  const [searched, setSearched] = useState("");

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = async () => {
    dispatch(showLoading());
    adminRequest({
      url: apiEndPoints.getBanners,
      method: "get",
    })
      .then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          setBanners(res.data?.banners);
        }
      })
      .catch((err) => {
        dispatch(hideLoading());
        console.log(err);
      });
  };

  const blockBanner = async (id) => {
    const isBlocked = banners.find((banner) => banner._id === id)?.isBlocked;
    const result = await Swal.fire({
      title: isBlocked ? "Unblock Confirmation" : "Block Confirmation",
      text: isBlocked
        ? "Are you sure you want to deActive this banner?"
        : "Are you sure you want to active this banner?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isBlocked ? "Activate" : "De-Activate",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      dispatch(showLoading());
      adminRequest({
        url: apiEndPoints.blockBanner,
        method: "patch",
        data: { id: id },
      }).then((res) => {
        dispatch(hideLoading());
        if (res.data.success) {
          toast.success(res.data.success);
          getBanners();
        } else {
          toast.error(res.data.error);
        }
      });
    }
  };

  const GetEditBanner = (id) => {
    const banner = banners.filter((banner) => banner._id === id);
    console.log(banner);
    return navigate(ServerVariables.editBanner, {
      state: { bannerToEdit: banner },
    });
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-full">
        <header className="bg-black shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight myTextColor uppercase">
              Banners
            </h2>
            <Search1
              search="Search Banner"
              value={searched}
              onChange={(e) => setSearched(e.target.value)}
            />
            <Button2
              text="Add Banner"
              onClick={() => navigate(ServerVariables.addBanner)}
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
                    <th className="border-b p-4">Title</th>
                    <th className="border-b p-4">Banner</th>
                    <th className="border-b p-4">Description</th>
                    <th className="border-b p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {banners
                    .filter((item) => {
                      return searched.toLowerCase() === ""
                        ? item
                        : item?.description.toLowerCase().includes(searched) ||
                            item?.title.toLowerCase().includes(searched);
                    })
                    .map((banner, index) => {
                      return (
                        <tr key={banner?._id}>
                          <td className="border-b p-4 text-center">
                            {index + 1}
                          </td>
                          <td className="border-b p-4 text-center">
                            {banner?.title}
                          </td>
                          <td className="border-b p-4 text-center">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={`http://localhost:5000/banners/${banner?.image}`}
                              alt={`http://localhost:5000/profiles/avatar.png`}
                            />
                          </td>
                          <td className="border-b p-4 text-center">
                            {banner?.description}
                          </td>
                          <td className="text-center">
                            <button
                              onClick={() => GetEditBanner(banner._id)}
                              className="text-white bg-gray-500 mr-2 mb-2 px-2 py-1 rounded-full w-20 md:w-24 h-8 md:h-10"
                            >
                              Edit
                            </button>
                            <button
                              className={`${
                                banner?.isBlocked
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              } text-white px-2 py-1 rounded-full w-20 md:w-28 h-8 md:h-10`}
                              onClick={() => {
                                blockBanner(banner._id);
                              }}
                            >
                              {banner?.isBlocked ? "DeActivated" : "Active"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {banners?.length <= 0 && <div className="text-center myPara"><p>No banners exists</p></div>}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Banners;

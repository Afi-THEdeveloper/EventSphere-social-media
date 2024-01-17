import React, { useEffect, useState } from "react";
import Button1 from "../components/Button1";
import Myh1 from "../components/Myh1";
import { useNavigate } from "react-router-dom";
import { ServerVariables } from "../utils/ServerVariables";
import { adminRequest } from "../Helper/instance";
import { apiEndPoints } from "../utils/api";
import toast from "react-hot-toast";
import BannerCourosel from "../components/BannerCourosel";

function LandingPage() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    getBanners();
  }, []);

  const getBanners = () => {
    adminRequest({
      url: apiEndPoints.getClientBanners,
      method: "get",
    })
      .then((res) => {
        setBanners(res.data?.banners);
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };
  return (
    <>
      <div className="min-h-screen">
        <BannerCourosel banners={banners} />
      </div>
    </>
  );
}

export default LandingPage;

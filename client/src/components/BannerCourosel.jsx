import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Button1 from "./Button1";
import Myh1 from "./Myh1";
import { ServerVariables } from "../utils/ServerVariables";
import { useNavigate } from "react-router-dom";

const BannerCourosel = ({ banners }) => {
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {banners.map((banner, index) => (
        <div key={index} className="relative">
          <img
            src={`http://localhost:5000/banners/${banner?.image}`}
            alt={`Banner ${index + 1}`}
            className="w-full h-screen"
          />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h2 className="text-7xl font-bold myTextColor">{banner.title}</h2>
            <p className="text-lg myTextColor font-semibold">
              {banner?.description}
            </p>

            {/* who are you part */}
            <div className="bg-[#181b23] bg-opacity-70 flex-1 flex flex-col items-center justify-center p-4">
              <div className="flex flex-col max-w-[400px] items-center space-y-3">
                <Myh1 title="Who are you ?" />
                <Button1
                  text="User"
                  onClick={() => navigate(ServerVariables.Login)}
                />
                <Button1
                  text="Event Manager"
                  onClick={() => navigate(ServerVariables.eventLogin)}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default BannerCourosel;

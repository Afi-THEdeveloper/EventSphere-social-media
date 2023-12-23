import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import { IoArrowBackCircleOutline } from "react-icons/io5";

export default function Carousel({
  children: stories,
  autoSlide = false,
  autoSlideInterval = 3000,
  descriptions,
}) {
  const [curr, setCurr] = useState(0);

  const prev = () =>
    setCurr((curr) => (curr === 0 ? stories.length - 1 : curr - 1));
  const next = () =>
    setCurr((curr) => (curr === stories.length - 1 ? 0 : curr + 1));

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, []);

  return (
    <>
      <IoArrowBackCircleOutline
        className="h-10 w-10 bg-[#E0CDB6]"
        onClick={() => window.history.back()}
      />
      <div className="overflow-hidden relative">
        <div
          className="flex transition-transform ease-out duration-500"
          style={{ transform: `translateX(-${curr * 100}%)` }}
        >
          {stories}
        </div>
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={prev}
            className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={next}
            className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
          >
            <ChevronRight size={40} />
          </button>
        </div>

        <div className="absolute bottom-4 right-0 left-0">
          <div className="flex items-center justify-center gap-2">
            {stories.map((story, i) => (
              <div
                className={`
                    transition-all w-3 h-3 bg-white rounded-full text-white
                    ${curr === i ? "p-2" : "bg-opacity-50"}
                  `}
              />
            ))}
          </div>
        </div>
      </div>
      <p className="text-[#E0CDB6] text-center mt-2">{descriptions[curr]}</p>
    </>
  );
}

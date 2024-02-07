import React from "react";



function Button1({text,...props}) { 
  return (
    <button {...props} className="myBorder myTextColor h-8 md:h-10 text-[10px] sm:text-sm border-2  w-full rounded-full px-4 font-semibold flex items-center justify-center hover:bg-[#0f1015]">
      {text}
    </button>
  );
}

export default Button1;

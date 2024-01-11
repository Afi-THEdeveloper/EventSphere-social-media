import React from "react";



function Button1({text,...props}) { 
  return (
    <button {...props} className="border-2 myBorder h-10 w-full rounded-full px-4 text-sm font-semibold myTextColor flex items-center justify-center hover:bg-[#0f1015]">
      {text}
    </button>
  );
}

export default Button1;

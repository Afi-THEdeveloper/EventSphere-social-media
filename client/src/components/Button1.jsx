import React from "react";



function Button1({text,...props}) { 
  return (
    <button {...props} className="h-10 w-full rounded-full px-4 text-sm font-semibold text-[#E0CDB6] bg-[#071F48] flex items-center justify-center">
      {text}
    </button>
  );
}

export default Button1;

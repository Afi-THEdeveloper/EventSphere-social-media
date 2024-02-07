import React from "react";

function AuthInput({ ...props }) {
  return (
    <div className="py-2">
      <input
        {...props}
        className="myDivBg text-[#85ACEF] block w-full rounded-xl p-4 border myBorder"
      />
    </div>
  );
}

export default AuthInput;

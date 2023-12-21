import React from "react";

function Search1({ search, ...props }) {
  return (
    <input
      {...props}
      type="text"
      placeholder={search}
      className="w-48 h-8 px-3 py-2 mr-4 text-sm text-white bg-gray-800 rounded-md focus:outline-none focus:border-indigo-500 focus:ring focus:ring-indigo-200"
    />
  );
}

export default Search1;

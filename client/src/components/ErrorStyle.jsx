import React from "react";

function ErrorStyle({ error }) {
  return <p className="text-xs sm:text-sm font-bold text-red-500">{error}</p>;
}

export default ErrorStyle;

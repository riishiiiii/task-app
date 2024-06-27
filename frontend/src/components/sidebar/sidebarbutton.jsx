import React from "react";

const SidebarButton = ({ onClick, buttonname, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center text-black text-lg w-full text-left group-hover:text-white transition duration-300 ease-in-out focus:outline-none"
    >
      <svg
        className="w-6 h-6 mr-3 text-black group-hover:text-white transition duration-300 ease-in-out"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 12h18M3 6h18M3 18h18"
        ></path>
      </svg>
      {buttonname}
      <svg
        className={`w-4 h-4 ml-auto transition-transform ${
          isOpen ? "transform rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </button>
  );
};

export default SidebarButton;

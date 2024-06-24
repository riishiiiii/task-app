import React from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";


const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    document.cookie = "todoToken=; Max-Age=0; path=/;";
    navigate("/");
  };

  return (
    <div className="w-64  bg-indigo-600 border-r border-blue-200 h-screen p-6 flex flex-col shadow-lg">
    <div>
      <div className="flex items-center mb-8">
        <svg
          className="w-10 h-10 mr-3 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          ></path>
        </svg>
        <h1 className="text-3xl font-extrabold text-white tracking-wider">TASKME</h1>
      </div>
      <nav>
        <ul className="space-y-6">
          <li className="group">
            <Link
              to="/dashboard"
              className={`flex items-center text-gray-100 text-lg group-hover:text-white transition duration-300 ease-in-out ${
                location.pathname === "/dashboard" ? "font-bold" : ""
              }`}
            >
              <svg
                className="w-6 h-6 mr-3 text-gray-100 group-hover:text-white transition duration-300 ease-in-out"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h8v8H3zM3 13h8v8H3zM13 3h8v8h-8zM13 13h4v4h-4z"
                ></path>
              </svg>
              Dashboard
            </Link>
          </li>
          <li className="group">
            <Link
              to="/archive"
              className={`flex items-center text-gray-100 text-lg group-hover:text-white transition duration-300 ease-in-out ${
                location.pathname === "/archive" ? "font-bold" : ""
              }`}
            >
              <svg
                className="w-6 h-6 mr-3 text-gray-100 group-hover:text-white transition duration-300 ease-in-out"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4h16v4H4zM4 8v12h16V8M10 12h4M12 12v6"
                ></path>
              </svg>
              Archive
            </Link>
          </li>
        </ul>
      </nav>
    </div>
    <div className="mt-auto">
      <button
        onClick={handleLogout}
        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
      >
        Logout
      </button>
      </div>
    </div>
  );
};

export default Sidebar;
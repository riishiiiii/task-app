import React from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const todoToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("todoToken="));

  const handleLogout = () => {
    document.cookie = "todoToken=; Max-Age=0; path=/;";
    navigate("/");
  };

  return (
    <div className="w-64 bg-blue-400 border-r border--200 h-screen p-6 flex flex-col">
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">TASKME</h1>
        <nav>
          <ul>
            <li className="mb-2">
              <Link
                to="/dashboard"
                className={`text-gray-700 text-lg hover:text-gray-900 ${
                  location.pathname === "/dashboard" ? "font-bold" : ""
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/archive"
                className={`text-gray-700 text-lg hover:text-gray-900 ${
                  location.pathname === "/archive" ? "font-bold" : ""
                }`}
              >
                Archive
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

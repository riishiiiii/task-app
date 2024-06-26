import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import SidebarButton from "./sidebarbutton";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(true);

  const handleLogout = () => {
    document.cookie = "todoToken=; Max-Age=0; path=/;";
    navigate("/");
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTasksToggle = () => {
    setIsTasksOpen(!isTasksOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={handleSidebarToggle}
        className="md:hidden p-4 focus:outline-none"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-indigo-600 border-r border-blue-200 h-screen p-6 flex flex-col shadow-lg`}
      >
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
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
            <h1 className="text-3xl font-extrabold text-white tracking-wider">
              TASKME
            </h1>
          </div>
          <button
            onClick={handleSidebarToggle}
            className="md:hidden p-4 focus:outline-none"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <nav>
          <ul className="space-y-6">
            <li>
              <SidebarButton
                onClick={handleTasksToggle}
                buttonname="Tasks"
                isOpen={isTasksOpen}
              />
              {isTasksOpen && (
                <ul className="pl-8 mt-4 space-y-4">
                  <li className="group">
                    <Link
                      to="/dashboard"
                      className={`flex items-center text-gray-100 text-lg group-hover:text-white transition duration-300 ease-in-out ${
                        location.pathname === "/dashboard" ? "font-bold" : ""
                      }`}
                    >
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
                      Archive
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li className="group">
              <Link
                to="/projects"
                className={`flex items-center text-gray-100 text-lg group-hover:text-white transition duration-300 ease-in-out ${
                  location.pathname === "/projects" ? "font-bold" : ""
                }`}
              >
                Projects
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

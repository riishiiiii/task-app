import React from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const todoToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("todoToken="));

  const handleLogout = () => {
    document.cookie = "todoToken=; Max-Age=0; path=/;";
    navigate("/");
  };

  return (
    <nav className="p-6 shadow-lg bg-black">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-3xl font-bold tracking-wider">Tasks</div>
        <div className="space-x-8">
          <a
            href="#"
            className="text-white text-lg hover:text-gray-300 transition duration-300"
          >
            Home
          </a>
          <a
            href="#"
            className="text-white text-lg hover:text-gray-300 transition duration-300"
          >
            About
          </a>
          <a
            href="#"
            className="text-white text-lg hover:text-gray-300 transition duration-300"
          >
            Contact
          </a>
          {todoToken && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white text-lg px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

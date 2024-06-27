// components/Layout.jsx
import React from "react";
import Sidebar from "./sidebar/sidebar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const getTodoToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("todoToken="))
      ?.split("=")[1];
  };

  useEffect(() => {
    const todoToken = getTodoToken();
    if (!todoToken) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;

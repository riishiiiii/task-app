import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterLogin = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");

  useEffect(() => {
    const todoToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("todoToken="));
    if (todoToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/register",
        {
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        }
      );
      if (response.status === 200) {
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterUsername("");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        setPopupMessage("Registered successfully!");
        setPopupType("success");
      }
    } catch (error) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      setPopupMessage(error.response.data.detail);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          username: loginUsername,
          password: loginPassword,
        }
      );
      if (response.status === 200) {
        setLoginUsername("");
        setLoginPassword("");
        document.cookie = `todoToken=${response.data.todoToken}; path=/;`;
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
    }
  };

  return (
    <div className="flex h-screen">
      {showPopup && (
        <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 ${popupType === "success" ? "bg-green-5000" : "bg-red-500"} text-white px-4 py-2 rounded`}>
          {popupMessage}
        </div>
      )}
      <div className="w-1/2 bg-purple-600 flex flex-col justify-center items-center p-8 shadow-2xl">
        <h2 className="text-4xl font-extrabold mb-4 text-white">Register</h2>
        <form id="register-form" className="w-full max-w-sm">
          <div className="mb-5">
            <label
              className="block text-black text-base font-medium mb-3"
              htmlFor="register-username"
            >
              Username
            </label>
            <input
              className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="register-username"
              type="text"
              placeholder="Enter your username"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label
              className="block text-black text-base font-medium mb-3"
              htmlFor="register-email"
            >
              Email
            </label>
            <input
              className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="register-email"
              type="email"
              placeholder="Enter your email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <label
              className="block text-black text-base font-medium mb-3"
              htmlFor="register-password"
            >
              Password
            </label>
            <input
              className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="register-password"
              type="password"
              placeholder="Enter your password"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
              type="button"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </form>
        <p id="register-message" className="mt-4 text-red-500"></p>
      </div>
      <div className="w-1/2 bg-green-100 flex flex-col justify-center items-center p-8 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-black">Login</h2>
        <form id="login-form" className="w-full max-w-md">
          <div className="mb-5">
            <label
              className="block text-black text-base font-medium mb-3"
              htmlFor="login-username"
            >
              Username
            </label>
            <input
              className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
              id="login-username"
              type="text"
              placeholder="Enter your username"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
          </div>
          <div className="mb-8">
            <label
              className="block text-black text-base font-medium mb-3"
              htmlFor="login-password"
            >
              Password
            </label>
            <input
              className="shadow-md appearance-none border rounded-lg w-full py-3 px-4 text-gray-800 mb-4 leading-tight focus:outline-none focus:shadow-outline"
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 px-5 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </form>
        <p id="login-message" className="mt-4 text-red-500"></p>
      </div>
    </div>
  );
};

export default RegisterLogin;

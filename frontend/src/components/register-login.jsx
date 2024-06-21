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
    <div className="flex h-screen bg-cover bg-center" style={{ backgroundImage: "url('https://images.deepai.org/art-image/64ea15bda9934180acbd90207f083b79/create-me-an-oil-pasted-image-of-a-person-thinking-wh.jpg')" }}>
      {showPopup && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${popupType === "success" ? "bg-green-500" : "bg-red-500"} text-white px-6 py-3 rounded-lg shadow-2xl z-50 transition-all duration-300 ease-in-out`}>
          {popupMessage}
        </div>
      )}
      <div className="m-auto bg-white  rounded-2xl border border-gray-200 shadow-2xl flex w-3/4 max-w-4xl flex-col items-center p-6">
        <h1 className="text-4xl font-bold text-indigo-800 mb-6">Let's Plan Your Task!</h1>
        <div className="w-full flex flex-row">
          <div className="w-1/2 p-12">
            <h2 className="text-3xl font-bold text-indigo-800 mb-8">Register</h2>
            <form id="register-form" className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-600 block" htmlFor="register-username">
                  Username
                </label>
                <input
                  className="w-full p-3 mt-1 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                  id="register-username"
                  type="text"
                  placeholder="Enter your username"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 block" htmlFor="register-email">
                  Email
                </label>
                <input
                  className="w-full p-3 mt-1 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 block" htmlFor="register-password">
                  Password
                </label>
                <input
                  className="w-full p-3 mt-1 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                  id="register-password"
                  type="password"
                  placeholder="Enter your password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              <button
                className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition duration-200"
                type="button"
                onClick={handleRegister}
              >
                Register
              </button>
            </form>
          </div>
          <div className="w-1/2 bg-indigo-600 text-white rounded-r-2xl p-12 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold mb-8">Welcome Back!</h2>
            <form id="login-form" className="w-full space-y-6">
              <div>
                <label className="text-sm font-semibold block" htmlFor="login-username">
                  Username
                </label>
                <input
                  className="w-full p-3 mt-1 bg-indigo-500 bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                  id="login-username"
                  type="text"
                  placeholder="Enter your username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-semibold block" htmlFor="login-password">
                  Password
                </label>
                <input
                  className="w-full p-3 mt-1 bg-indigo-500 bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <button
                className="w-full bg-white text-indigo-600 p-3 rounded-lg font-semibold hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition duration-200"
                type="button"
                onClick={handleLogin}
              >
                Login
              </button>
            </form>
            <p id="login-message" className="mt-4 text-red-300"></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterLogin;

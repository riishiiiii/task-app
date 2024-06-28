import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import boy2 from "../../images/boy.png";
import logo from "../../logos/png/logo-black.png";
import Popup from "../popup";
import { backendUrl, getTodoToken } from "../../helpers";

const RegisterLogin = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");


  useEffect(() => {
    const todoToken = getTodoToken();
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
    const passwordValidator = (password) => {
      const minLength = 8;
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
      );
    };

    if (!passwordValidator(registerPassword)) {
      setShowPopup(true);
      setPopupType("error");
      setTimeout(() => setShowPopup(false), 3000);
      setPopupMessage(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/register`,
        {
          username: registerUsername,
          email: registerEmail,
          password: registerPassword,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
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
      setPopupType("error");
      setTimeout(() => setShowPopup(false), 3000);
      setPopupMessage(error.response.data.detail);
    }
  };
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        {
          username: loginUsername,
          password: loginPassword,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
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
    <div
      className="flex h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${boy2})` }}
    >
      <Popup
        showPopup={showPopup}
        popupMessage={popupMessage}
        popupType={popupType}
        setShowPopup={setShowPopup}
      />
      <div className="m-auto bg-white  rounded-2xl border border-gray-200 shadow-2xl flex w-3/4 max-w-4xl flex-col items-center p-6">
        <div className="flex items-center mb-6">
          <img src={logo} alt="Logo" className="w-32 h-32 mr-4" />
          <h1 className="text-4xl font-bold text-indigo-800">
            Let's Plan Your Task!
          </h1>
        </div>
        <div className="w-full flex flex-row">
          <div className="w-1/2 p-12">
            <h2 className="text-3xl font-bold text-indigo-800 mb-8">
              Register
            </h2>
            <form id="register-form" className="space-y-6">
              <div>
                <label
                  className="text-sm font-semibold text-gray-600 block"
                  htmlFor="register-username"
                >
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
                <label
                  className="text-sm font-semibold text-gray-600 block"
                  htmlFor="register-email"
                >
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
                <label
                  className="text-sm font-semibold text-gray-600 block"
                  htmlFor="register-password"
                >
                  Password
                </label>
                <input
                  className="w-full p-3 mt-1 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
                  id="register-password"
                  type="password"
                  placeholder="Enter your password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Password must contain at least one number, one uppercase and lowercase letter, and at least 8 or more characters"
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleRegister();
                    }
                  }}
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
                <label
                  className="text-sm font-semibold block"
                  htmlFor="login-username"
                >
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
                <label
                  className="text-sm font-semibold block"
                  htmlFor="login-password"
                >
                  Password
                </label>
                <input
                  className="w-full p-3 mt-1 bg-indigo-500 bg-opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
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

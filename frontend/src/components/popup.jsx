import React from "react";
import { useState } from "react";

import { useEffect } from "react";

const Popup = ({ showPopup, popupMessage, popupType, setShowPopup }) => {
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, setShowPopup]);

  return (
    <>
      {showPopup && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 ${
            popupType === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-6 py-3 rounded-lg shadow-2xl z-50 transition-all duration-300 ease-in-out`}
        >
          {popupMessage}
        </div>
      )}
    </>
  );
};

export default Popup;

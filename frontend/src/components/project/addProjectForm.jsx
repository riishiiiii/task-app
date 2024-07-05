import React from "react";
import { useState } from "react";
import axios from "axios";
import Popup from "../popup";
import { backendUrl, getTodoToken } from "../../helpers";

const AddProjectForm = ({ setShowAddProject, onProjectAdded }) => {
  const [projectName, setProjectName] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");

    
  const handleAddProject = async () => {
    if (projectName === "") {
      setPopupMessage("Please enter a project name");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    const response = await axios.post(
      `${backendUrl}/api/project/`,
      {
        project_name: projectName,
      },
      {
        headers: {
          Authorization: `Bearer ${getTodoToken()}`,
        },
      }
    );
    if (response.status === 200) {
      setShowAddProject(false);
      onProjectAdded();
    } else {
      setShowPopup(true);
      setPopupMessage("Failed to add project");
      setPopupType("error");
    }
  };

  return (
    <>
      <Popup
        showPopup={showPopup}
        setShowPopup={setShowPopup}
        popupMessage={popupMessage}
        popupType={popupType}
      />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
              <form>
                <div className="mb-4">
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="projectName"
                    type="text"
                    placeholder="Enter project name"
                    value={projectName}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        handleAddProject();
                      }
                    }}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={handleAddProject}
                  >
                    Add Project
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="button"
                    onClick={() => setShowAddProject(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProjectForm;

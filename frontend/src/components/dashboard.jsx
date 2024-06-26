import React, { useEffect, useState } from "react";
import axios from "axios";
import boy from "../images/boy.png";
import Popup from "./popup";

const Dashboard = () => {
  const getTodoToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("todoToken="))
      ?.split("=")[1];
  };
  // const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const backendUrl = "https://bcaa-120-72-93-46.ngrok-free.app";

  const [task, setTask] = useState("");
  const [completed, setCompleted] = useState(false);
  const [tasksPerDay, setTasksPerDay] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("");

  const addTask = async () => {
    if (!task.trim()) {
      setPopupMessage("Task cannot be empty");
      setPopupType("error");
      setShowPopup(true);
      return;
    }

    const todoToken = getTodoToken();

    const response = await axios.post(
      `${backendUrl}/api/task/`,
      { task: task },
      {
        headers: {
          Authorization: `Bearer ${todoToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      setTask(''); // Clear the input field
      setTasksPerDay((prevTasks) => {
        const newTasks = { today: [], ...prevTasks };
        if (!newTasks.today.length) {
          newTasks.today = [response.data];
        } else {
          newTasks.today = [response.data, ...newTasks.today];
        }
        return newTasks;
      });
    }
  };

  const updateTask = async (id) => {
    const todoToken = getTodoToken();
    setCompleted(!completed);
    const response = await axios.put(
      `${backendUrl}/api/task/${id}`,
      { completed: !completed },
      {
        headers: {
          Authorization: `Bearer ${todoToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      fetchTasks();
    }
  };

  const fetchTasks = async () => {
    const todoToken = getTodoToken();
    const response = await axios.get(`${backendUrl}/api/task/`, {
      headers: {
        Authorization: `Bearer ${todoToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      setTasksPerDay(response.data.tasks);
    }
  };

  const toggleMenu = (dayKey, taskId) => {
    setTasksPerDay((prevTasks) => ({
      ...prevTasks,
      [dayKey]: prevTasks[dayKey].map((task) =>
        task.task_id === taskId
          ? { ...task, showMenu: !task.showMenu }
          : { ...task, showMenu: false }
      ),
    }));
  };

  const handleDelete = async (taskId) => {
    const todoToken = getTodoToken();
    const response = await axios.delete(`${backendUrl}/api/task/${taskId}`, {
      headers: {
        Authorization: `Bearer ${todoToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      fetchTasks();
    }
  };

  const handleArchive = async (taskId) => {
    const todoToken = getTodoToken();
    try {
      const response = await axios.post(
        `${backendUrl}/api/archive/${taskId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${todoToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        fetchTasks();
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setPopupMessage(
          "Error: Access forbidden. You do not have permission to archive this task."
        );
        setPopupType("error");
        setShowPopup(true);
      } else {
        setPopupMessage("An error occurred while archiving the task:", error);
        setPopupType("error");
        setShowPopup(true);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div
      className="flex flex-col md:flex-row h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${boy})`, filter: "blue(1)" }}
    >
      <Popup
        showPopup={showPopup}
        popupMessage={popupMessage}
        popupType={popupType}
        setShowPopup={setShowPopup}
      />
      {/* Main content */}
      <div className="flex-1 p-4 md:p-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-indigo-600 rounded-lg">
            <h2 className="p-2 text-2xl md:text-3xl font-bold mb-6 text-black">
              Tasks
            </h2>
          </div>

          {/* Add Task Section */}
          <div className="bg-white rounded-lg shadow-md mb-8 p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-700">
              Add New Task
            </h3>
            <div className="flex flex-col md:flex-row">
              <input
                className="flex-grow shadow-sm border border-gray-300 rounded-t-lg md:rounded-l-lg md:rounded-t-none py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                type="text"
                placeholder="Enter your task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter" && task.trim() !== "") {
                    addTask();
                  }
                }}
              />
              <button
                className="bg-gradient-to-r bg-indigo-600 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-b-lg md:rounded-r-lg md:rounded-b-none transition duration-150 ease-in-out"
                onClick={addTask}
              >
                Add Task
              </button>
            </div>
          </div>
          {/* Tasks List */}

          {Object.keys(tasksPerDay).length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500 text-lg">
                No tasks listed. Add a new task to get started!
              </p>
            </div>
          ) : (
            Object.entries(tasksPerDay).map(([day, tasks]) => (
              <div
                key={day}
                className="bg-white border border-gray-200 shadow-lg rounded-lg p-4 md:p-6 mb-6"
              >
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-gray-700 capitalize">
                  {day}
                </h3>
                {tasks.length === 0 ? (
                  <p className="text-gray-500">No tasks listed for this day.</p>
                ) : (
                  <ul className="space-y-3">
                    {tasks.map((task) => (
                      <li
                        key={task.task_id}
                        className="flex flex-col md:flex-row items-center justify-between bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="flex items-center flex-grow">
                          <input
                            type="checkbox"
                            className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={task.completed}
                            onChange={() => updateTask(task.task_id)}
                          />
                          <span
                            className={`text-lg ${
                              task.completed
                                ? "line-through text-gray-500"
                                : "text-gray-700"
                            }`}
                          >
                            {task.task}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 ml-4 pr-5">
                          <span className="font-medium">Created at:</span>{" "}
                          {new Date(task.created_at).toLocaleTimeString()}
                        </div>
                        <div className="relative">
                          <button
                            className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            onClick={() => toggleMenu(day, task.task_id)}
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              ></path>
                            </svg>
                          </button>
                          {task.showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                              <div className="py-1">
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => handleDelete(task.task_id)}
                                >
                                  Delete
                                </button>
                                {task.completed && (
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    onClick={() => handleArchive(task.task_id)}
                                  >
                                    Archive
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

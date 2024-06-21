// pages/Archive.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const Archive = () => {
  const [archivedTasksPerDay, setArchivedTasksPerDay] = useState({});

  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  const getTodoToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("todoToken="))
      ?.split("=")[1];
  };
  const fetchArchivedTasks = async () => {
    const todoToken = getTodoToken();
    try {
      const response = await axios.get("http://localhost:8000/api/archive/", {
        headers: {
          Authorization: `Bearer ${todoToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setArchivedTasksPerDay(response.data.tasks);
        console.log("Archived tasks fetched successfully");
      }
    } catch (error) {
      console.error("Error fetching archived tasks:", error);
    }
  };

  const toggleMenu = (dayKey, taskId) => {
    setArchivedTasksPerDay((prevTasks) => ({
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
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/archive/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${todoToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        console.log("Task deleted successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleRestore = (taskId) => {
    // Implement restore functionality
    console.log("Restore archived task", taskId);
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Archive</h2>

        {Object.keys(archivedTasksPerDay).length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500 text-lg">No archived tasks found.</p>
          </div>
        ) : (
          Object.entries(archivedTasksPerDay).map(([day, tasks]) => (
            <div key={day} className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-700 capitalize">
                {day}
              </h3>
              {tasks.length === 0 ? (
                <p className="text-gray-500">No archived tasks for this day.</p>
              ) : (
                <ul className="space-y-3">
                  {tasks.map((task) => (
                    <li
                      key={task.task_id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center flex-grow">
                        <input
                          type="checkbox"
                          className="mr-3 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={task.completed}
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
  );
};

export default Archive;

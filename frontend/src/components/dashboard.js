import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const todoToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("todoToken="));
    if (!todoToken) {
      navigate("/");
    }
  }, [navigate]);

  const [task, setTask] = useState("");
  const [userTasks, setUserTasks] = useState([]);
  const [completed, setCompleted] = useState(false);

  const getTodoToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("todoToken="))
      ?.split("=")[1];
  };

  const addTask = async () => {
    const todoToken = getTodoToken();

    const response = await axios.post(
      "http://localhost:8000/api/task/",
      { task: task },
      {
        headers: {
          Authorization: `Bearer ${todoToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      setTask("");
      console.log("Task added successfully");
      window.location.reload();
    }
  };

  const updateTask = async (id) => {
    const todoToken = getTodoToken();
    setCompleted(!completed);
    const response = await axios.put(
      `http://localhost:8000/api/task/${id}/`,
      { completed: !completed },
      {
        headers: {
          Authorization: `Bearer ${todoToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      console.log("Task updated successfully");
      window.location.reload();
    }
  };

  const fetchTasks = async () => {
    const todoToken = getTodoToken();
    if (!todoToken) {
      navigate("/");
    } else {
      const response = await axios.get("http://localhost:8000/api/task/", {
        headers: {
          Authorization: `Bearer ${todoToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        setUserTasks(response.data);
        console.log("Tasks fetched successfully");
      }
    }
  };

  const toggleMenu = (taskId) => {
    setUserTasks(
      userTasks.map((task) =>
        task.task_id === taskId
          ? { ...task, showMenu: !task.showMenu }
          : { ...task, showMenu: false }
      )
    );
  };

  const handleDelete = async (taskId) => {
    const todoToken = getTodoToken();
    const response = await axios.delete(
      `http://localhost:8000/api/task/${taskId}/`,
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
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <div className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm mb-8 p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Add New Task
            </h3>
            <div className="flex">
              <input
                className="flex-grow shadow-sm border border-gray-300 rounded-l-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="text"
                placeholder="Enter your task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
              />
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-r-lg transition duration-150 ease-in-out"
                onClick={addTask}
              >
                Add Task
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
              Your Tasks
            </h3>
            <ul className="space-y-3">
              {userTasks.map((task) => (
                <li
                  key={task.task_id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
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
                  <div className="relative">
                    <button
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => toggleMenu(task.task_id)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

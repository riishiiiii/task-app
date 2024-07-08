import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { backendUrl, getTodoToken } from "../../../helpers";
import CommentItem from "./comments";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TaskDescription = ({ projectId, taskId, onClose }) => {
  const [task, setTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedNote, setEditedNote] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editedPriority, setEditedPriority] = useState("");
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const titleInputRef = useRef(null);
  const priorityInputRef = useRef(null);

  const navigate = useNavigate();

  const fetchTask = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/project/task/${projectId}/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${getTodoToken()}`,
          },
        }
      );
      if (response.status === 200) {
        setTask(response.data);
        setEditedTitle(response.data.task);
        setEditedDescription(response.data.description || "");
        setEditedNote(response.data.note || "");
        setEditedPriority(response.data.priority || "");
      } else {
        console.error("Failed to fetch task");
      }
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/project/taskcomment/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${getTodoToken()}`,
          },
        }
      );
      if (response.status === 200) {
        setComments(response.data);
      } else {
        console.error("Failed to fetch comments");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchTask();
    fetchComments();
  }, [taskId, projectId]);

  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
    if (isEditingPriority && priorityInputRef.current) {
      priorityInputRef.current.focus();
    }
  }, [isEditing, isEditingPriority]);

  const handleUpdate = async (field, value) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/project/task/${projectId}/${taskId}`,
        { [field]: value },
        {
          headers: {
            Authorization: `Bearer ${getTodoToken()}`,
          },
        }
      );
      if (response.status === 200) {
        setTask((prevTask) => ({ ...prevTask, [field]: value }));
      } else {
        console.error(`Failed to update ${field}`);
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (editedTitle !== task.task) {
      handleUpdate("task", editedTitle);
    }
  };

  const handleDescriptionChange = (e) => {
    setEditedDescription(e.target.value);
  };

  const handleDescriptionBlur = () => {
    setIsEditingDescription(false);
    if (editedDescription !== task.description) {
      handleUpdate("description", editedDescription);
    }
  };

  const handleNoteChange = (e) => {
    setEditedNote(e.target.value);
  };

  const handleNoteBlur = () => {
    setIsEditingNote(false);
    if (editedNote !== task.note) {
      handleUpdate("note", editedNote);
    }
  };

  const handlePriorityChange = (e) => {
    setEditedPriority(e.target.value);
  };

  const handlePriorityBlur = () => {
    setIsEditingPriority(false);
    if (editedPriority !== task.priority) {
      handleUpdate("priority", editedPriority);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `${backendUrl}/api/project/taskcomment/${taskId}`,
        { comment: newComment },
        {
          headers: {
            Authorization: `Bearer ${getTodoToken()}`,
          },
        }
      );
      if (response.status === 200) {
        setComments([...comments, response.data]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/project/taskcomment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${getTodoToken()}`,
          },
        }
      );
      if (response.status === 200) {
        setComments(
          comments.filter((comment) => comment.comment_id !== commentId)
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/project/task/${projectId}/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${getTodoToken()}`,
          },
        }
      );
      if (response.status === 200) {
        onClose();
        navigate(`/project/${projectId}`);
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  if (!task) {
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <div className="text-white p-8 shadow-2xl overflow-y-auto h-full">
      <button
        onClick={onClose}
        className="absolute top-4 mr-3 right-4 text-2xl text-white"
      >
        ×
      </button>
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-8 shadow-2xl rounded-lg">
        {isEditing ? (
          <input
            ref={titleInputRef}
            type="text"
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKkeydown={(e) => {
              if (e.key === "Enter") {
                handleTitleBlur();
              }
            }}
            className="text-3xl font-extrabold mb-6 bg-transparent border-b-2 border-pink-400 focus:outline-none text-white w-full"
          />
        ) : (
          <div className="flex justify-between">
            <h1
              onClick={() => setIsEditing(true)}
              className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 cursor-pointer"
            >
              {task.task}
            </h1>
            <button
              onClick={() => handleDeleteTask(task.project_task_id)}
              className="hover:bg-red-700 text-white font-bold p-3 rounded"
            >
              <FaTrash />
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <InfoItem label="Assignee" value={task.created_by_name} />
          <div>
            <p className="text-sm text-pink-300 mb-1">Due Date</p>
            <input
              type="date"
              value={
                task.due_date
                  ? new Date(task.due_date).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) => handleUpdate("due_date", e.target.value)}
              className="bg-transparent border-b-2 border-pink-400 focus:outline-none text-white"
            />
          </div>
          <div>
            <p className="text-sm text-pink-300 mb-1">Priority</p>
            <div className="relative">
              <select
                value={task.priority || "Not set"}
                onChange={(e) => handleUpdate("priority", e.target.value)}
                className={`appearance-none border-b-2 border-pink-400 focus:outline-none text-black bg-transparent font-medium  ${getPriorityClass(
                  task.priority
                )}`}
              >
                <option value="Low" style={{ backgroundColor: "green", color: "white", borderRadius: "5px" }}>
                  Low
                </option>
                <option value="Medium" style={{ backgroundColor: "yellow", color: "black", borderRadius: "5px" }}>
                  Medium
                </option>
                <option value="High" style={{ backgroundColor: "orange", color: "white", borderRadius: "5px" }}>
                  High
                </option>
                <option value="Urgent" style={{ backgroundColor: "red", color: "white", borderRadius: "5px" }}>
                  Urgent
                </option>
                <option value="Immediate" style={{ backgroundColor: "purple", color: "white", borderRadius: "5px" }}>
                  Immediate
                </option>
                <option value="Critical" style={{ backgroundColor: "brown", color: "white", borderRadius: "5px" }}>
                  Critical
                </option>
                <option
                  value="Blocker"
                  style={{ backgroundColor: "black", color: "white", borderRadius: "5px" }}
                >
                  Blocker
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 15l-5-5 1.41-1.41L12 12.17l6.59-6.59L18 10l-6 6z" />
                </svg>
              </div>
            </div>
          </div>
          <InfoItem label="Label" value={task.label || "None"} />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-pink-300">
            Description
          </h2>
          {isEditingDescription ? (
            <textarea
              value={editedDescription}
              onChange={handleDescriptionChange}
              onBlur={handleDescriptionBlur}
              className="bg-black bg-opacity-30 p-4 rounded-lg w-full text-white"
              rows="4"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleDescriptionBlur();
                }
              }}
            />
          ) : (
            <p
              onClick={() => setIsEditingDescription(true)}
              className="bg-black bg-opacity-30 p-4 rounded-lg cursor-pointer whitespace-pre-wrap"
            >
              {task.description || "No description provided."}
            </p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-pink-300">Notes</h2>
          {isEditingNote ? (
            <textarea
              value={editedNote}
              onChange={handleNoteChange}
              onBlur={handleNoteBlur}
              className="bg-black bg-opacity-30 p-4 rounded-lg w-full text-white"
              rows="4"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleNoteBlur();
                }
              }}
            />
          ) : (
            <p
              onClick={() => setIsEditingNote(true)}
              className="bg-black bg-opacity-30 p-4 rounded-lg cursor-pointer whitespace-pre-wrap"
            >
              {task.note || "No notes provided."}
            </p>
          )}
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3 text-pink-300">Comments</h2>
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem
                key={comment.comment_id}
                comment={comment}
                onDelete={handleDeleteComment}
              />
            ))}
          </div>
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full h-20 p-2 bg-black bg-opacity-30 rounded-lg text-white"
              rows="3"
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition duration-300"
            >
              Add Comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value, isStatus, isPriority }) => (
  <div>
    <p className="text-sm text-pink-300 mb-1">{label}</p>
    <p
      className={`font-medium ${isStatus ? getStatusClass(value) : ""} ${
        isPriority ? getPriorityClass(value) : ""
      }`}
    >
      {value}
    </p>
  </div>
);

const getStatusClass = (status) => {
  const classes = {
    "In Progress": "text-yellow-400",
    Completed: "text-green-400",
    Pending: "text-red-400",
  };
  return classes[status] || "text-gray-400";
};

const getPriorityClass = (priority) => {
  const classes = {
    High: "text-red-400",
    Medium: "text-yellow-400",
    Low: "text-green-400",
    Urgent: "text-red-600",
    Immediate: "text-red-700",
    Critical: "text-brown-700",
    Blocker: "text-black",
  };
  return classes[priority] || "text-gray-400";
};

export default TaskDescription;

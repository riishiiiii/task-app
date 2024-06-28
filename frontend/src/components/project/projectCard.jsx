import React, { useState } from "react";
import axios from "axios";
import { backendUrl, getTodoToken } from "../../helpers";

const ProjectCard = ({ project, fetchProjects }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editText, setEditText] = useState("");

  const deleteProject = async (project_id) => {
    const token = getTodoToken();
    try {
      const response = await axios.delete(
        `${backendUrl}/api/project/${project_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        fetchProjects();
      } else {
        console.log("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const confirmDelete = () => {
    deleteProject(project.project_id);
    setShowConfirmDelete(false);
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowConfirmDelete(true);
  };

  const editProject = async (project_id) => {
    const token = getTodoToken();
    const response = await axios.put(
      `${backendUrl}/api/project/${project_id}`,
      { project_name: editText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 200) {
      fetchProjects();
    } else {
      console.log("Failed to edit project");
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    editProject(project.project_id);
    setShowEdit(false);
  };

  const handleEditChange = (e) => {
    setEditText(e.target.value);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
    setShowEdit(true);
    setEditText(project.project_name);
  };

  const changeCursor = (cursor) => {
    document.documentElement.style.cursor = cursor;
  };

  return (
    <div
      className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-xl relative cursor-pointer"
      onClick={() => {
        setIsMenuOpen(false);
        window.location.href = `/project/${project.project_id}`;
      }}
      onMouseEnter={() => changeCursor("pointer")}
    >
      {!project || Object.keys(project).length === 0 ? (
        <div className="text-center">
          <h1 className="text-gray-500 mb-4">No project exists. Create one.</h1>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">
                {project.project_name}
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Created: {new Date(project.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Owner: {project.owner_name}
              </p>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu(e);
              }}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6 10a2 2 0 114 0 2 2 0 01-4 0zm4 0a2 2 0 114 0 2 2 0 01-4 0zm4 0a2 2 0 114 0 2 2 0 01-4 0z" />
              </svg>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(e);
                  }}
                >
                  Edit
                </button>
                <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Archive
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(e);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </>
      )}
      {showConfirmDelete && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirmDelete(false);
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete this project?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={(e) => {
                  setShowConfirmDelete(false);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={(e) => {
                  confirmDelete();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {showEdit && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold mb-4">Edit Project</h3>
            <form onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editText}
                onChange={handleEditChange}
                placeholder={project.project_name}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  disabled={editText === project.project_name}
                >
                  Save
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowEdit(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProjectCard;

import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import axios from "axios";
import { backendUrl, getTodoToken } from "../../helpers";
import { useParams } from "react-router-dom";
import { FaPlus, FaPencilAlt, FaTrash } from "react-icons/fa";

const Project = () => {
  const { projectId } = useParams();
  const [columns, setColumns] = useState([]);
  const [newLabelName, setNewLabelName] = useState("");
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [editingLabelName, setEditingLabelName] = useState("");
  const [newTaskNames, setNewTaskNames] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [projectInfo, setProjectInfo] = useState({});

  useEffect(() => {
    // Default suggestions for new labels
    const defaultSuggestions = ["BackLog", "In Progress", "Done"];
    setSuggestions(defaultSuggestions);
    getProjectInfo();
  }, []);

  const getProjectInfo = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/project/${projectId}`,
        { headers: { Authorization: `Bearer ${getTodoToken()}` } }
      );
      if (response.status === 200) {
        setProjectInfo(response.data);
      }
    } catch (err) {
      console.error("Error fetching project info:", err);
    }
  };

  const fetchLabelsAndTasks = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/project/${projectId}/task`,
        { headers: { Authorization: `Bearer ${getTodoToken()}` } }
      );
      if (response.status === 200) {
        setColumns(response.data.labels || []);
      }
    } catch (err) {
      console.error("Error fetching labels and tasks:", err);
    }
  };

  useEffect(() => {
    fetchLabelsAndTasks();
  }, [projectId]);

  const addLabel = async (e) => {
    e.preventDefault();
    if (!newLabelName.trim()) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/project/${projectId}/label`,
        { label_name: newLabelName },
        { headers: { Authorization: `Bearer ${getTodoToken()}` } }
      );
      if (response.status === 200) {
        setColumns([...columns, response.data]);
        setNewLabelName("");
      }
    } catch (err) {
      console.error("Error adding label:", err);
    }
  };

  const startEditingLabel = (labelId, labelName) => {
    setEditingLabelId(labelId);
    setEditingLabelName(labelName);
  };

  const saveEditedLabel = async (labelId) => {
    if (!editingLabelName.trim()) return;
    try {
      const response = await axios.put(
        `${backendUrl}/api/project/label/${labelId}`,
        { label_name: editingLabelName },
        { headers: { Authorization: `Bearer ${getTodoToken()}` } }
      );
      if (response.status === 200) {
        setColumns(
          columns.map((col) =>
            col.label_id === labelId
              ? { ...col, label_name: editingLabelName }
              : col
          )
        );
        setEditingLabelId(null);
        setEditingLabelName("");
      }
    } catch (err) {
      console.error("Error updating label:", err);
    }
  };

  const deleteLabel = async (labelId) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/project/label/${labelId}`,
        { headers: { Authorization: `Bearer ${getTodoToken()}` } }
      );
      if (response.status === 200) {
        setColumns(columns.filter((col) => col.label_id !== labelId));
        setShowDeleteConfirm(null);
      }
    } catch (err) {
      console.error("Error deleting label:", err);
    }
  };
  const addTask = async (e, labelId) => {
    e.preventDefault();
    if (!newTaskNames[labelId]?.trim()) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/project/${projectId}/task`,
        { task_name: newTaskNames[labelId], label_id: labelId },
        { headers: { Authorization: `Bearer ${getTodoToken()}` } }
      );
      if (response.status === 200) {
        setNewTaskNames((prev) => ({ ...prev, [labelId]: "" }));
        fetchLabelsAndTasks(); // Refresh the data after adding a task
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const task = columns
      .find((col) => col.label_id === source.droppableId)
      .tasks.find((task) => task.project_task_id === draggableId);

    if (task) {
      try {
        const response = await axios.put(
          `${backendUrl}/api/project/${projectId}/task/${task.project_task_id}`,
          { label: destination.droppableId },
          { headers: { Authorization: `Bearer ${getTodoToken()}` } }
        );
        if (response.status === 200) {
          fetchLabelsAndTasks();
        }
      } catch (err) {
        console.error("Error updating task:", err);
      }
    }
  };

  const handleTaskNameChange = (labelId, value) => {
    setNewTaskNames((prev) => ({ ...prev, [labelId]: value }));
  };

  return (
    <div
      className="p-6 bg-gradient-to-r from-blue-900 to-indigo-800 min-h-screen"
      onClick={() => setShowSuggestions(false)}
    >
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-white">{projectInfo.project_name}</h1>
          <h4 className="text-white mt-2 md:mt-0">{projectInfo.owner_name}</h4>
        </div>
        <div className="text-center md:text-right mt-4 md:mt-0">
          <h5 className="text-gray-400">{new Date(projectInfo.created_at).toLocaleDateString()}</h5>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {columns.map((column) => (
            <div
              key={column.label_id}
              className="flex-shrink-0 w-80 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="bg-gray-5000 p-3">
                {editingLabelId === column.label_id ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editingLabelName}
                      onChange={(e) => setEditingLabelName(e.target.value)}
                      className="border p-2 mr-2 rounded flex-grow shadow-sm"
                    />
                    <button
                      onClick={() => saveEditedLabel(column.label_id)}
                      className="bg-green-500 text-white p-2 rounded shadow-sm"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-xl text-gray-800">
                      {column.label_name}
                    </h2>
                    <div>
                      <button
                        onClick={() =>
                          startEditingLabel(column.label_id, column.label_name)
                        }
                        className="text-blue-600 mr-3 hover:text-blue-800"
                      >
                        <FaPencilAlt />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(column.label_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Droppable droppableId={column.label_id.toString()}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-white p-3 min-h-[200px]"
                  >
                    {column.tasks && column.tasks.length > 0 ? (
                      column.tasks.map((task, index) => (
                        <Draggable
                          key={task.project_task_id}
                          draggableId={task.project_task_id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-black text-white p-6 mb-3 rounded shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              {task.task}
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        No tasks available
                      </p>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <form
                onSubmit={(e) => addTask(e, column.label_id)}
                className="p-3 bg-white"
              >
                <input
                  type="text"
                  value={newTaskNames[column.label_id] || ""}
                  onChange={(e) =>
                    handleTaskNameChange(column.label_id, e.target.value)
                  }
                  placeholder="Add a new task"
                  className="border border-black bg-gray-100 p-2 rounded w-full shadow-sm"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded w-full mt-2 hover:bg-blue-600 transition-colors duration-200"
                >
                  <FaPlus className="inline mr-2" /> Add Task
                </button>
              </form>

              {showDeleteConfirm === column.label_id && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <p className="mb-4">
                      Are you sure you want to delete this label?
                    </p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="bg-white text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-400 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => deleteLabel(column.label_id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <div
            className="flex-shrink-0 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={addLabel}
              className="bg-white p-4 rounded-lg shadow-lg"
            >
              <input
                type="text"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                placeholder="New label name"
                className="border p-3 rounded w-full shadow-sm mb-2"
              />
              {showSuggestions && (
                <div className="bg-white border border-gray-300 rounded shadow-lg mt-2">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setNewLabelName(suggestion);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
              <button
                type="submit"
                className="bg-green-500 text-white p-3 rounded w-full hover:bg-green-600 transition-colors duration-200"
              >
                <FaPlus className="inline mr-2" /> Add New Label
              </button>
            </form>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Project;

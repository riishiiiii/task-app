import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl, getTodoToken } from "../../helpers";
import { useParams } from "react-router-dom";
import ProjectBoardBar from "./projectBoardBar";
import { FaSearch } from "react-icons/fa";

const ProjectBoard = ({ projectId, onTaskClick }) => {
  // const { projectId } = useParams();
  const [columns, setColumns] = useState([]);
  const [newLabelName, setNewLabelName] = useState("");
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [editingLabelName, setEditingLabelName] = useState("");
  const [newTaskNames, setNewTaskNames] = useState({});
  const [projectInfo, setProjectInfo] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [labelSuggestion, setLabelSuggestion] = useState(false); 
  useEffect(() => {
    fetchLabelsAndTasks();
    getProjectInfo();
  }, [projectId]);

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
        `${backendUrl}/api/project/task/${projectId}`,
        { headers: { Authorization: `Bearer ${getTodoToken()}` } }
      );
      if (response.status === 200) {
        setColumns(response.data.labels || []);
      }
    } catch (err) {
      console.error("Error fetching labels and tasks:", err);
    }
  };

  const addLabel = async (e) => {
    e.preventDefault();
    if (!newLabelName.trim()) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/project/label/${projectId}`,
        { label_name: newLabelName },
        { headers: { Authorization: `Bearer ${getTodoToken()}` } }
      );
      if (response.status === 200) {
        setColumns([...columns, { ...response.data, tasks: [] }]);
        setNewLabelName("");
      }
    } catch (err) {
      console.error("Error adding label:", err);
    }
  };

  const editLabel = async (labelId, newName) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/project/label/${labelId}`,
        { label_name: newName },
        { headers: { Authorization: `Bearer ${getTodoToken()}` } }
      );
      if (response.status === 200) {
        setColumns(columns.map(col => 
          col.label_id === labelId ? { ...col, label_name: newName } : col
        ));
        setEditingLabelId(null);
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
        setColumns(columns.filter(col => col.label_id !== labelId));
      }
    } catch (err) {
      console.error("Error deleting label:", err);
    }
  };

  const addTask = async (labelId) => {
    if (!newTaskNames[labelId]?.trim()) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/project/task/${projectId}`,
        { task_name: newTaskNames[labelId], label_id: labelId },
        { headers: { Authorization: `Bearer ${getTodoToken()}` } }
      );
      if (response.status === 200) {
        setColumns(columns.map(col => 
          col.label_id === labelId 
            ? { ...col, tasks: [...col.tasks, response.data] }
            : col
        ));
        setNewTaskNames({ ...newTaskNames, [labelId]: "" });
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = columns.find(col => col.label_id.toString() === source.droppableId);
    const finishColumn = columns.find(col => col.label_id.toString() === destination.droppableId);

    if (startColumn === finishColumn) {
      const newTasks = Array.from(startColumn.tasks);
      const [reorderedItem] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, reorderedItem);

      const newColumn = {
        ...startColumn,
        tasks: newTasks,
      };

      setColumns(columns.map(col =>
        col.label_id === newColumn.label_id ? newColumn : col
      ));
    } else {
      const startTasks = Array.from(startColumn.tasks);
      const [movedItem] = startTasks.splice(source.index, 1);
      const newStartColumn = {
        ...startColumn,
        tasks: startTasks,
      };

      const finishTasks = Array.from(finishColumn.tasks);
      finishTasks.splice(destination.index, 0, movedItem);
      const newFinishColumn = {
        ...finishColumn,
        tasks: finishTasks,
      };

      setColumns(columns.map(col =>
        col.label_id === newStartColumn.label_id ? newStartColumn :
        col.label_id === newFinishColumn.label_id ? newFinishColumn : col
      ));

      try {
        await axios.put(
          `${backendUrl}/api/project/task/${projectId}/${movedItem.project_task_id}/label`,
          { label: finishColumn.label_id },
          { headers: { Authorization: `Bearer ${getTodoToken()}` } }
        );
      } catch (err) {
        console.error("Error updating task:", err);
      }
    }
  };

  const filteredColumns = columns.map(column => ({
    ...column,
    tasks: column.tasks.filter(task => 
      task.task.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  return (
    <div className="h-screen bg-gradient-to-r from-blue-700 to-indigo-900 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{projectInfo.project_name}</h1>
          <p className="text-gray-300">{projectInfo.owner_name}</p>
        </div>
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white bg-opacity-20 text-white placeholder-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-300" />
          </div>
        </div>
      </div>

      <ProjectBoardBar
        columns={filteredColumns}
        projectId={projectId}
        onDragEnd={onDragEnd}
        editingLabelId={editingLabelId}
        setEditingLabelId={setEditingLabelId}
        editingLabelName={editingLabelName}
        setEditingLabelName={setEditingLabelName}
        deleteLabel={deleteLabel}
        editLabel={editLabel}
        newTaskNames={newTaskNames}
        setNewTaskNames={setNewTaskNames}
        addTask={addTask}
        newLabelName={newLabelName}
        setNewLabelName={setNewLabelName}
        addLabel={addLabel}
        onTaskClick={onTaskClick}
        labelSuggestion={labelSuggestion}
        setLabelSuggestion={setLabelSuggestion} 
      />
    </div>
  );
};


export default ProjectBoard;
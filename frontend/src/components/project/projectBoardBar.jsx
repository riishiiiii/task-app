import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FaPlus, FaPencilAlt, FaTrash, FaTag } from "react-icons/fa";

const ProjectBoardBar = ({
  columns,
  onDragEnd,
  editingLabelId,
  setEditingLabelId,
  editingLabelName,
  setEditingLabelName,
  deleteLabel,
  editLabel,
  newTaskNames,
  setNewTaskNames,
  addTask,
  newLabelName,
  setNewLabelName,
  addLabel,
  onTaskClick,
  labelSuggestion,
  setLabelSuggestion,
}) => {
  const suggestedLabels = ["Backlog", "To Do", "In Progress", "Done"];

  const showLablesuggestion = () => {
    setLabelSuggestion(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} onClick={() => setLabelSuggestion()}>
      <div className="flex overflow-x-auto space-x-4 pb-4">
        {columns.map((column) => (
          <div
            key={column.label_id}
            className="flex-shrink-0 w-80 bg-gray-700 rounded-lg shadow-xlg overflow-hidden flex flex-col"
          >
            <div className="bg-gray-800 p-3 flex justify-between items-center">
              <h2 className="font-bold text-lg text-white">
                {column.label_name} ({column.tasks.length})
              </h2>
              <div className="flex items-center">
                <button
                  onClick={() => setEditingLabelId(column.label_id)}
                  className="text-gray-300 hover:text-white mr-2"
                >
                  <FaPencilAlt />
                </button>
                <button
                  onClick={() => deleteLabel(column.label_id)}
                  className="text-gray-300 hover:text-white"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {editingLabelId === column.label_id && (
              <div className="p-3 bg-gray-800">
                <input
                  type="text"
                  value={editingLabelName}
                  onChange={(e) => setEditingLabelName(e.target.value)}
                  className="w-full p-2 rounded bg-gray-700 text-white"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => setEditingLabelId(null)}
                    className="text-gray-300 hover:text-white mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => editLabel(column.label_id, editingLabelName)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            <Droppable droppableId={column.label_id.toString()}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-gray-700 p-3 min-h-[300px] flex-grow"
                >
                  {column.tasks.map((task, index) => (
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
                          onClick={() => {
                            onTaskClick(task.project_task_id);
                          }}
                          className="bg-white text-black p-3 mb-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
                        >
                          {task.task}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="p-3 bg-gray-800">
              <input
                type="text"
                value={newTaskNames[column.label_id] || ""}
                onChange={(e) =>
                  setNewTaskNames({
                    ...newTaskNames,
                    [column.label_id]: e.target.value,
                  })
                }
                placeholder="Add a new task"
                className="w-full p-2 mb-2 rounded bg-gray-700 text-white placeholder-gray-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addTask(column.label_id);
                  }
                }}
              />
              <button
                onClick={() => addTask(column.label_id)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition-colors duration-200"
              >
                <FaPlus className="inline mr-2" /> Add Task
              </button>
            </div>
          </div>
        ))}

        <div className="flex-shrink-0 w-80">
          <form
            onSubmit={addLabel}
            className="bg-gray-700 p-4 rounded-lg shadow-lg relative"
          >
            <input
              type="text"
              value={newLabelName}
              onChange={(e) => setNewLabelName(e.target.value)}
              placeholder="New label name"
              className="w-full p-3 mb-2 rounded bg-gray-800 text-white placeholder-gray-400"
              autoComplete="off"
              onClick={() => showLablesuggestion()}
            />
            {labelSuggestion && (
              <div className="bg-white p-2 mb-2 rounded-lg flex-shrink-0 w-70">
                <ul className="list-none">
                  {suggestedLabels.map((label) => (
                    <li
                      key={label}
                      className="p-2 hover:bg-gray-600 cursor-pointer transition-colors duration-200"
                      onClick={() => setNewLabelName(label)}
                    >
                      <FaTag className="inline mr-2" /> {label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded transition-colors duration-200"
            >
              <FaPlus className="inline mr-2" /> Add New Label
            </button>
          </form>
        </div>
      </div>
    </DragDropContext>
  );
};

export default ProjectBoardBar;

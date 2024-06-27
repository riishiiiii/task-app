import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Project = () => {
  const [columns, setColumns] = useState({
    "to-do": {
      id: "to-do",
      title: "To Do",
      tasks: [
        { id: "task-1", content: "First task" },
        { id: "task-2", content: "Second task" },
      ],
    },
    "in-progress": {
      id: "in-progress",
      title: "In Progress",
      tasks: [{ id: "task-3", content: "Third task" }],
    },
    done: {
      id: "done",
      title: "Done",
      tasks: [],
    },
  });

  const onDragEnd = (result) => {
    // Handle drag end
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        {Object.values(columns).map((column) => (
          <Droppable droppableId={column.id} key={column.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-gray-100 p-4 rounded-lg shadow-md w-1/3"
              >
                <h2 className="text-xl font-bold mb-4">{column.title}</h2>
                <div className="space-y-2">
                  {column.tasks.map((task, index) => (
                    <Draggable
                      draggableId={task.id}
                      index={index}
                      key={task.id}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-2 rounded-md shadow-sm"
                        >
                          {task.content}
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Project;

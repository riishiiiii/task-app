import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectBoard from './projectBoard';
import TaskDescription from './task/taskDescription';

const Project = () => {
  const { projectId } = useParams();
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskDescriptionOpen, setIsTaskDescriptionOpen] = useState(false);

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsTaskDescriptionOpen(true);
  };

  const closeTaskDescription = () => {
    setIsTaskDescriptionOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`transition-all duration-300 ease-in-out ${
          isTaskDescriptionOpen ? 'w-1/2' : 'w-full'
        }`}
      >
        <ProjectBoard projectId={projectId} onTaskClick={handleTaskClick} />
      </div>
      <div
        className={`fixed top-0 right-0 h-full bg-gradient-to-br from-indigo-900 to-purple-900 shadow-lg transition-all duration-300 ease-in-out overflow-y-auto ${
          isTaskDescriptionOpen ? 'w-1/2 translate-x-0' : 'w-1/2 translate-x-full'
        }`}
      >
        <button
          onClick={closeTaskDescription}
          className="absolute top-4 left-4 text-2xl text-white"
        >
          →
        </button>
        {selectedTaskId && (
          <TaskDescription 
            projectId={projectId} 
            taskId={selectedTaskId} 
            onClose={closeTaskDescription}
          />
        )}
      </div>
    </div>
  );
};

export default Project;
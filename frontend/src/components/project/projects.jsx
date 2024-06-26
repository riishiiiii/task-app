import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import boy from "../../images/boy.png";
import AddProjectForm from "./addProjectForm";
import ProjectCard from "./projectCard";

const Projects = () => {
  const getTodoToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("todoToken="))
      ?.split("=")[1];
  };
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [projects, setProjects] = useState([]);
  const [showAddProject, setShowAddProject] = useState(false);

  const fetchProjects = async () => {
    const response = await axios.get(`${backendUrl}/api/project/`, {
      headers: {
        Authorization: `Bearer ${getTodoToken()}`,
      },
    });
    if (response.status === 200) {
      setProjects(response.data);
    }
  };

  const handleAddProject = () => {
    setShowAddProject(true);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center p-8 relative"
      style={{
        backgroundImage: `url(${boy})`,
      }}
    >
      <button
        className="absolute top-9 right-9 bg-blue-500 text-white px-5 py-3 rounded hover:bg-blue-600 transition-colors flex items-center"
        onClick={handleAddProject}
      >
        <svg
          className="w-6 h-6 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Project
      </button>
      {showAddProject && (
        <div>
          <AddProjectForm
            setShowAddProject={setShowAddProject}
            onProjectAdded={fetchProjects}
          />
        </div>
      )}

      <div className="container mx-auto mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              fetchProjects={fetchProjects}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;

import RegisterLogin from "./components/auth/register-login";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/tasks/dashboard";
import Archive from "./components/tasks/archive";
import Layout from "./components/layout";
import ProjectList from "./components/project/projectsList";
import Project from "./components/project/projects";
import NotFoundPage from "./components/nopagefound";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RegisterLogin />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/archive"
          element={
            <Layout>
              <Archive />
            </Layout>
          }
        />
        <Route
          path="/projects"
          element={
            <Layout>
              <ProjectList />
            </Layout>
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <Layout>
              <Project />
            </Layout>
          }
        />
      </Routes>

      <NotFoundPage />
    </>
  );
}

export default App;

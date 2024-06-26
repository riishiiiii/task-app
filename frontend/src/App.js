import RegisterLogin from "./components/register-login";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Archive from "./components/archive";
import Layout from "./components/layout";
import Projects from "./components/projects";

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
              <Projects />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;

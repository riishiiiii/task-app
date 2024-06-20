import NavBar from './components/nav';
import RegisterLogin from './components/register-login';
import { Routes, Route } from 'react-router-dom';
import  Dashboard  from './components/dashboard';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<RegisterLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;

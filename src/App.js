import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import { selectUser } from './features/auth/auth';
import TaskBoard from './pages/ProjectBoard';

function App() {
  const user = useSelector(selectUser)

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/projects/:projectId" element={<TaskBoard />} />

      </Routes>
    </Router>
  );
}

export default App;

import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from './features/auth/auth';

import Layout from './components/Layout';
import Login from './pages/login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskBoard from './pages/ProjectBoard';

function App() {
  const user = useSelector(selectUser);

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Routes rendered inside Layout (Header/Footer always shown) */}
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
          <Route
            path="/projects/:projectId"
            element={user ? <TaskBoard /> : <Navigate to="/login" />}
          />
          {/* Redirect any unknown route */}
          <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

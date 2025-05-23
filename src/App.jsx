import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import AddTask from "./pages/AddTask/AddTask";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import EditTask from "./pages/EditTask/EditTask";
import './App.css';
import { useEffect, useState } from 'react';
import Sidebar from "./components/Sidebar";
import TaskTracking from "./pages/TaskTracking";
import CalendarPage from "./pages/Calendar";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    async function fetchTasks() {
      if (user && user.id) {
        const response = await fetch(`https://innovative-flow-production.up.railway.app/api/tasks?userId=${user.id}`);
        const data = await response.json();
        setTasks(data);
      }
    }
    fetchTasks();
    App.fetchTasks = fetchTasks;
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>;
  }

  return (
    <div className="App" style={{ display: 'flex' }}>
      {user && !isMobile && <Sidebar />}
      <div className="mainContent" style={{ flex: 1, marginLeft: user && !isMobile ? 250 : 0, width: '100%' }}>
        <Routes>
          <Route path="/" element={user ? <Home user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          <Route path="/add-task" element={user ? <AddTask user={user} fetchTasks={App.fetchTasks} /> : <Navigate to="/login" />} />
          <Route path="/edit-task/:id" element={user ? <EditTask user={user} fetchTasks={App.fetchTasks} /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register onRegister={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/task-tracking" element={user ? <TaskTracking tasks={tasks} user={user} onLogout={handleLogout} fetchTasks={App.fetchTasks} /> : <Navigate to="/login" />} />
          <Route path="/calendar" element={user ? <CalendarPage tasks={tasks} user={user} onLogout={handleLogout} fetchTasks={App.fetchTasks} /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {user && isMobile && (
        <nav className="mobileMenu">
          <a href="/" className="mobileMenuItem">
            <span className="mobileMenuIcon">🏠</span>
            <span>Home</span>
          </a>
          <a href="/add-task" className="mobileMenuItem">
            <span className="mobileMenuIcon">➕</span>
            <span>New</span>
          </a>
          <a href="/task-tracking" className="mobileMenuItem">
            <span className="mobileMenuIcon">📋</span>
            <span>Tasks</span>
          </a>
          <a href="/calendar" className="mobileMenuItem">
            <span className="mobileMenuIcon">📅</span>
            <span>Calendar</span>
          </a>
        </nav>
      )}
    </div>
  );
}

export default App;
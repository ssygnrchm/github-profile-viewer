import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserProfilePage from './components/UserProfilePage';
import RepoDetailsPage from './components/RepoDetailsPage';
import './App.css'; // Keep the main CSS

function App() {
  return (
    <Router> {/* BrowserRouter wraps our entire application */}
      <div className="app-main-container"> {/* A container for global styling */}
        <Routes> {/* Routes component defines individual routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:username" element={<UserProfilePage />} />
          <Route path="/user/:username/:repoName" element={<RepoDetailsPage />} />
          {/* Optional: Add a catch-all for 404 Not Found pages */}
          <Route path="*" element={<h2 style={{ marginTop: '50px' }}>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
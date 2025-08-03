// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserProfilePage from './components/UserProfilePage';
import RepoDetailsPage from './components/RepoDetailsPage';
import NotFoundPage from './components/NotFoundPage'; // New import
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:username" element={<UserProfilePage />} />
          <Route path="/user/:username/:repoName" element={<RepoDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} /> {/* Catch-all route for 404 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
// src/App.jsx
import React from 'react';
// CHANGE THIS LINE:
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import UserProfilePage from './components/UserProfilePage';
import RepoDetailsPage from './components/RepoDetailsPage';
import NotFoundPage from './components/NotFoundPage';
import './App.css';

function App() {
  return (
    <Router> {/* This is now HashRouter */}
      <div className="app-main-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:username" element={<UserProfilePage />} />
          <Route path="/user/:username/:repoName" element={<RepoDetailsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
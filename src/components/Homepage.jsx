// src/components/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // New hook for navigation

function HomePage() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate(); // Hook to programmatically navigate

    const handleInputChange = (event) => {
        setUsername(event.target.value);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        if (username.trim()) { // Ensure username is not empty or just whitespace
            navigate(`/user/${username.trim()}`); // Navigate to the user profile page
        }
    };

    return (
        <div className="homepage-container">
            <h1>GitHub Profile Viewer</h1>
            <p>Enter a GitHub username to view their profile and repositories.</p>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Enter GitHub username"
                    value={username}
                    onChange={handleInputChange}
                    className="search-input"
                />
                <button type="submit" className="search-button">
                    Search
                </button>
            </form>
        </div>
    );
}

export default HomePage;
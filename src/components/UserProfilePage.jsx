// src/components/UserProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // useParams to get username from URL

function UserProfilePage() {
    const { username } = useParams(); // Get the username from the URL parameter
    const [userData, setUserData] = useState(null);
    const [userRepos, setUserRepos] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Start loading immediately
    const [error, setError] = useState(null);

    // useEffect hook to fetch data when the component mounts or username changes
    useEffect(() => {
        const fetchUserProfileAndRepos = async () => {
            setIsLoading(true);
            setError(null);
            setUserData(null);
            setUserRepos([]);

            try {
                // 1. Fetch User Data
                const userResponse = await fetch(`https://api.github.com/users/${username}`);
                if (!userResponse.ok) {
                    if (userResponse.status === 404) {
                        throw new Error(`User "${username}" not found.`);
                    }
                    throw new Error(`GitHub API error: ${userResponse.statusText}`);
                }
                const fetchedUserData = await userResponse.json();
                setUserData(fetchedUserData);

                // 2. Fetch User Repositories
                const reposResponse = await fetch(fetchedUserData.repos_url);
                if (!reposResponse.ok) {
                    throw new Error(`Failed to fetch repositories: ${reposResponse.statusText}`);
                }
                const fetchedReposData = await reposResponse.json();
                // Sort repositories by stars (descending) or last updated
                const sortedRepos = fetchedReposData.sort((a, b) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at) - new Date(a.updated_at));
                setUserRepos(sortedRepos);

            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch GitHub data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfileAndRepos();
        // Re-run this effect if the username in the URL changes
    }, [username]); // Dependency array: useEffect runs when `username` changes

    if (isLoading) {
        return <p className="loading-message">Loading profile for {username}...</p>;
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <Link to="/" className="back-link">Go back to search</Link>
            </div>
        );
    }

    if (!userData) {
        // This case handles if error was cleared but no data loaded for some reason,
        // though with current logic, error should be set if userData is null.
        return <p className="error-message">No user data available.</p>;
    }

    return (
        <div className="user-profile-page">
            <Link to="/" className="back-link">← Back to Search</Link>

            <div className="user-profile">
                <img src={userData.avatar_url} alt={`${userData.login}'s avatar`} className="avatar" />
                <h2>{userData.name || userData.login}</h2>
                {userData.bio && <p className="bio">{userData.bio}</p>}
                <p>Followers: {userData.followers}</p>
                <p>Following: {userData.following}</p>
                <a href={userData.html_url} target="_blank" rel="noopener noreferrer" className="github-link">
                    View on GitHub
                </a>
            </div>

            {/* Display Repositories */}
            {userRepos.length > 0 && (
                <div className="user-repos-section">
                    <h3>Public Repositories ({userRepos.length})</h3>
                    <ul className="repo-list">
                        {userRepos.map((repo) => (
                            <li key={repo.id} className="repo-item">
                                {/* Link to individual repository details page */}
                                <Link to={`/user/${username}/${repo.name}`} className="repo-name-link">
                                    {repo.name}
                                </Link>
                                <p>{repo.description || 'No description available.'}</p>
                                <div className="repo-meta">
                                    <span>⭐ {repo.stargazers_count}</span>
                                    <span>🍴 {repo.forks_count}</span>
                                    <span>Last updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {userRepos.length === 0 && !isLoading && <p className="no-repos-message">{userData.login} has no public repositories.</p>}

        </div>
    );
}

export default UserProfilePage;
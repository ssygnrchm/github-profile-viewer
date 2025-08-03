// src/components/RepoDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function RepoDetailsPage() {
    const { username, repoName } = useParams(); // Get username and repoName from URL
    const [repoDetails, setRepoDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRepoDetails = async () => {
            setIsLoading(true);
            setError(null);
            setRepoDetails(null);

            try {
                const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Repository "${repoName}" not found for user "${username}".`);
                    }
                    throw new Error(`GitHub API error: ${response.statusText}`);
                }
                const data = await response.json();
                setRepoDetails(data);
            } catch (err) {
                setError(err.message);
                console.error("Failed to fetch repository details:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRepoDetails();
        // Re-run this effect if username or repoName in the URL changes
    }, [username, repoName]);

    if (isLoading) {
        return <p className="loading-message">Loading repository details for {repoName}...</p>;
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <Link to={`/user/${username}`} className="back-link">← Back to {username}'s Profile</Link>
            </div>
        );
    }

    if (!repoDetails) {
        return <p className="error-message">No repository details available.</p>;
    }

    return (
        <div className="repo-details-page">
            <Link to={`/user/${username}`} className="back-link">← Back to {username}'s Profile</Link>

            <div className="repo-detail-card">
                <h2>{repoDetails.name}</h2>
                <p className="repo-detail-description">{repoDetails.description || 'No description available.'}</p>
                <div className="repo-detail-meta">
                    <span>Owner: <a href={repoDetails.owner.html_url} target="_blank" rel="noopener noreferrer">{repoDetails.owner.login}</a></span>
                    <span>Default Branch: {repoDetails.default_branch}</span>
                    <span>Created: {new Date(repoDetails.created_at).toLocaleDateString()}</span>
                    <span>Last Updated: {new Date(repoDetails.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="repo-detail-stats">
                    <span>⭐ {repoDetails.stargazers_count} Stars</span>
                    <span>🍴 {repoDetails.forks_count} Forks</span>
                    <span>👁️ {repoDetails.subscribers_count} Watchers</span>
                    <span>Issues: {repoDetails.open_issues_count}</span>
                </div>
                {repoDetails.language && <p>Language: <span className="language-tag">{repoDetails.language}</span></p>}
                <a href={repoDetails.html_url} target="_blank" rel="noopener noreferrer" className="github-link">
                    View on GitHub
                </a>
            </div>
        </div>
    );
}

export default RepoDetailsPage;
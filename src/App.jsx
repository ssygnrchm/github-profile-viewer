import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [userRepos, setUserRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setUsername(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    if (!username) {
      setError("Please enter a Github username");
      setUserData(null);
      setUserRepos([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setUserData(null);
    setUserRepos([])

    try {
      const userResponse = await fetch(`https://api.github.com/users/${username}`);

      if (!userResponse.ok) {
        if (userResponse.status === 404) {
          throw new Error(`User "${username}" not found`);
        }
        throw new Error(`Github API error: ${userResponse.statusText}`);
      }

      const userData = await userResponse.json();
      setUserData(userData);

      // Get user repos
      const reposResponse = await fetch(userData.repos_url);

      if (!reposResponse.ok) {
        throw new Error(`Failed to fetch repositories: ${reposResponse.statusText}`);
      }
      const reposData = await reposResponse.json();
      setUserRepos(reposData);

    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch GitHub user:", err);
      setUserData(null);
      setUserRepos([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='app-container'>
      <h1>Github Profile Viewer</h1>

      <form onSubmit={handleSearch} className='search-form'>
        <input
          type="text"
          placeholder='Enter GitHub username'
          value={username}
          onChange={handleInputChange}
          className='search-input'
        />
        <button type="submit" className='search-button' disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className='error-message'>{error}</p>}

      {isLoading && <p className='loading-message'>Loading profile...</p>}

      {userData && (
        <div className='user-profile'>
          <img src={userData.avatar_url} alt={`${userData.login}'s avatar`} className='avatar' />
          <h2>{userData.name || userData.login}</h2>
          {userData.bio && <p className='bio'>{userData.bio}</p>}
          <p>Followers: {userData.followers}</p>
          <p>Following: {userData.following}</p>
          <a href={userData.html_url} target='_blank' rel='noopener noreferrer' className='github-link'>
            View on GitHub
          </a>

          {/* Display Repositories */}
          {userRepos.length > 0 && (
            <div className='user-repos-section'>
              <h3>Public Repositories ({userRepos.length})</h3>
              <ul className='repo-list'>
                {userRepos.map((repo) => (
                  <li key={repo.id} className='repo-item'>
                    <a href={repo.html_url} target='_blank' rel='noopener noreferrer'>
                      {repo.name}
                    </a>
                    <p>{repo.description || 'No description available.'}</p>
                    <div className='repo-meta'>
                      <span>⭐ {repo.stargazers_count}</span>
                      <span>🍴 {repo.forks_count}</span>
                      <span>Last updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
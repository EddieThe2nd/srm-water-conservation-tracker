import { useState } from 'react';
 import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      localStorage.setItem('username', username);
      navigate('/dashboard');
    }
  };

  return (
    <div className="login-background">
      <div className="login-box">
        <div className="left-panel">
          <h2>Welcome</h2>
          <p>Introducing Water Conservation Tracker</p>
        
          <div className="illustration-placeholder">
            <svg
              width="140"
              height="120"
              viewBox="0 0 140 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="140" height="120" rx="15" fill="#78C2D0" />
              <circle cx="70" cy="60" r="30" fill="#A9E3F0" />
            </svg>
          </div>
        </div>

        <div className="right-panel">
          <form className="login-form" onSubmit={handleSubmit}>
            <h3>Login</h3>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <span className="input-icon">👤</span>
            </div>
            <button type="submit" className="btn-login">
              Login
            </button>
            <div className="helper-links">
              <a href="#forgot">Forgot</a>
              <a href="#help">Help</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthService } from '../../services/adminAuthService';
import './AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    phoneNumber: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminAuthService.adminLogin(credentials.phoneNumber, credentials.password);
      
      // Store admin token and data
      localStorage.setItem('adminToken', response.token);
      localStorage.setItem('adminData', JSON.stringify(response.admin));
      
      // Redirect to admin dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <h1>🔐 Admin Portal</h1>
          <p>Gaming Store Administration</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label>Admin Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={credentials.phoneNumber}
              onChange={handleChange}
              placeholder="Enter admin phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>Admin Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Admin Login'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p>Not an admin? <a href="/login">Go to User Login</a></p>
          <p className="admin-note">
            Only administrators with ADMIN role can access this portal
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
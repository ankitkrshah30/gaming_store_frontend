import React from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/" className="app-title">Gaming Store</Link>
      </div>
      
      <nav className="header-nav">
        <Link to="/" className="nav-link">Home</Link>
        {isAuthenticated && (
          <>
            <Link to="/games" className="nav-link">Games</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            {isAdmin() && (
              <Link to="/admin" className="nav-link admin-link">Admin</Link>
            )}
          </>
        )}
      </nav>

      <div className="header-right">
        {isAuthenticated ? (
          <div className="user-menu">
            <div className="user-info">
              <span className="user-name">Hi, {user?.name}</span>
              <span className="user-role">{user?.role}</span>
              <span className="user-balance">₹{user?.balance?.toFixed(2)}</span>
            </div>
            <div className="user-actions">
              {!isAdmin() && (
                <Link to="/wallet" className="wallet-btn">Wallet</Link>
              )}
              <Link to="/profile" className="profile-btn">Profile</Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { adminAuthService } from '../../services/adminAuthService';
import AdminMembers from '../../components/admin/AdminMembers';
import AdminGames from '../../components/admin/AdminGames';
import AdminTransactions from '../../components/admin/AdminTransactions';
import AdminRecharges from '../../components/admin/AdminRecharges';
import AdminStats from '../../components/admin/AdminStats';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [adminData, setAdminData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    if (!adminAuthService.isAdminLoggedIn()) {
      navigate('/admin/login');
      return;
    }

    // Get admin data
    const currentAdmin = adminAuthService.getCurrentAdmin();
    setAdminData(currentAdmin);

    // Validate token
    validateAdminSession();
  }, [navigate]);

  const validateAdminSession = async () => {
    try {
      await adminAuthService.validateAdminToken();
    } catch (error) {
      console.error('Admin session invalid:', error);
      navigate('/admin/login');
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      adminAuthService.adminLogout();
      navigate('/admin/login');
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'games', label: 'Games', icon: '🎮' },
    { id: 'transactions', label: 'Transactions', icon: '💸' },
    { id: 'recharges', label: 'Recharges', icon: '🔄' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminStats />;
      case 'members':
        return <AdminMembers />;
      case 'games':
        return <AdminGames />;
      case 'transactions':
        return <AdminTransactions />;
      case 'recharges':
        return <AdminRecharges />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminStats />;
    }
  };

  if (!adminData) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-layout">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="admin-profile">
            <div className="admin-avatar">
              {adminData.name?.charAt(0).toUpperCase()}
            </div>
            <div className="admin-info">
              <h3>{adminData.name}</h3>
              <p>Administrator</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main-content">
        <div className="admin-topbar">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          
          <div className="topbar-title">
            <h1>Gaming Store Admin</h1>
            <p>Manage your gaming platform</p>
          </div>

          <div className="topbar-actions">
            <span className="admin-name">Welcome, {adminData.name}</span>
          </div>
        </div>

        <div className="admin-content-area">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Admin Settings Component
const AdminSettings = () => (
  <div className="admin-settings">
    <h2>Admin Settings</h2>
    <div className="settings-grid">
      <div className="setting-card">
        <h3>🔐 Security</h3>
        <p>Manage admin passwords and security settings</p>
        <button className="btn btn-primary">Configure</button>
      </div>
      <div className="setting-card">
        <h3>🎮 Game Settings</h3>
        <p>Configure game pricing and availability</p>
        <button className="btn btn-primary">Configure</button>
      </div>
      <div className="setting-card">
        <h3>💰 Payment Settings</h3>
        <p>Manage payment methods and pricing</p>
        <button className="btn btn-primary">Configure</button>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
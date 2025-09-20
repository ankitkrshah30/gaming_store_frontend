import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './AdminStats.css';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await adminService.getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  return (
    <div className="admin-stats">
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Members</h3>
            <p className="stat-number">{stats?.totalMembers || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-info">
            <h3>Total Games</h3>
            <p className="stat-number">{stats?.totalGames || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💸</div>
          <div className="stat-info">
            <h3>Total Transactions</h3>
            <p className="stat-number">{stats?.totalTransactions || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <h3>Total Recharges</h3>
            <p className="stat-number">{stats?.totalRecharges || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-number">₹{stats?.totalRevenue || 0}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div className="stat-info">
            <h3>Recharge Amount</h3>
            <p className="stat-number">₹{stats?.totalRechargeAmount || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
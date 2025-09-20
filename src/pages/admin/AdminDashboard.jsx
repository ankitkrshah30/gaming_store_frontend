import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { memberService } from '../../services/memberService';
import { gameService } from '../../services/gameService';
import { transactionService } from '../../services/transactionService';
import { rechargeService } from '../../services/rechargeService';
import { useAuth } from '../../context/AuthContext';
import AddGameModal from '../../components/AddGameModal/AddGameModal';
import AddAdminModal from '../../components/AddAdminModal/AddAdminModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [members, setMembers] = useState([]);
  const [games, setGames] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showGameModal, setShowGameModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === 'members') fetchMembers();
    if (activeTab === 'games') fetchGames();
    if (activeTab === 'transactions') fetchTransactions();
    if (activeTab === 'recharges') fetchRecharges();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    try {
      const data = await adminService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      setMessage('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const data = await memberService.getAllMembers();
      setMembers(data);
    } catch (error) {
      setMessage('Failed to load members');
    }
  };

  const fetchGames = async () => {
    try {
      const data = await gameService.getAllGames();
      setGames(data);
    } catch (error) {
      setMessage('Failed to load games');
    }
  };

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      setMessage('Failed to load transactions');
    }
  };

  const fetchRecharges = async () => {
    try {
      const data = await rechargeService.getAllRecharges();
      setRecharges(data);
    } catch (error) {
      setMessage('Failed to load recharges');
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    
    try {
      await memberService.deleteMember(memberId);
      setMembers(members.filter(m => m.id !== memberId));
      setMessage('Member deleted successfully');
    } catch (error) {
      setMessage('Failed to delete member');
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (!window.confirm('Are you sure you want to delete this game?')) return;
    
    try {
      await gameService.deleteGame(gameId);
      setGames(games.filter(g => g.id !== gameId));
      setMessage('Game deleted successfully');
    } catch (error) {
      setMessage('Failed to delete game');
    }
  };

  const handleGameAdded = () => {
    setShowGameModal(false);
    setMessage('Game added successfully');
    if (activeTab === 'games') fetchGames();
    fetchDashboardData();
  };

  const handleAdminAdded = () => {
    setShowAdminModal(false);
    setMessage('Admin created successfully');
    if (activeTab === 'members') fetchMembers();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <div className="loading-spinner">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-welcome">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.name}</p>
          </div>
          <div className="admin-actions">
            <button 
              className="action-btn primary"
              onClick={() => setShowGameModal(true)}
            >
              Add Game
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => setShowAdminModal(true)}
            >
              Add Admin
            </button>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
            <button onClick={() => setMessage('')} className="close-btn">×</button>
          </div>
        )}

        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`tab-btn ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            👥 Members
          </button>
          <button 
            className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            🎮 Games
          </button>
          <button 
            className={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            💳 Transactions
          </button>
          <button 
            className={`tab-btn ${activeTab === 'recharges' ? 'active' : ''}`}
            onClick={() => setActiveTab('recharges')}
          >
            💰 Recharges
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-overview">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>Total Members</h3>
                    <p>{dashboardData?.totalMembers || 0}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎮</div>
                  <div className="stat-info">
                    <h3>Total Games</h3>
                    <p>{dashboardData?.totalGames || 0}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💳</div>
                  <div className="stat-info">
                    <h3>Total Transactions</h3>
                    <p>{dashboardData?.totalTransactions || 0}</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <h3>Total Revenue</h3>
                    <p>₹{dashboardData?.totalRevenue?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="members-section">
              <div className="section-header">
                <h2>All Members</h2>
                <p>{members.length} total members</p>
              </div>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Balance</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(member => (
                      <tr key={member.id}>
                        <td>{member.name}</td>
                        <td>{member.phoneNumber}</td>
                        <td>
                          <span className={`role-badge ${member.role?.toLowerCase()}`}>
                            {member.role}
                          </span>
                        </td>
                        <td>₹{member.balance?.toFixed(2)}</td>
                        <td>{formatDate(member.joiningDate)}</td>
                        <td>
                          {member.role !== 'ADMIN' && (
                            <button 
                              className="delete-btn"
                              onClick={() => handleDeleteMember(member.id)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'games' && (
            <div className="games-section">
              <div className="section-header">
                <h2>All Games</h2>
                <p>{games.length} total games</p>
              </div>
              <div className="games-grid">
                {games.map(game => (
                  <div key={game.id} className="admin-game-card">
                    <div className="game-info">
                      <h3>{game.name}</h3>
                      <p className="game-price">₹{game.price}</p>
                      <p className="game-players">{game.minPlayer}-{game.maxPlayer} players</p>
                      <p className="game-duration">{game.duration} mins</p>
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteGame(game.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="transactions-section">
              <div className="section-header">
                <h2>All Transactions</h2>
                <p>{transactions.length} total transactions</p>
              </div>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Game</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td>{transaction.memberName}</td>
                        <td>{transaction.gameName}</td>
                        <td>₹{transaction.amount?.toFixed(2)}</td>
                        <td>{formatDate(transaction.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'recharges' && (
            <div className="recharges-section">
              <div className="section-header">
                <h2>All Recharges</h2>
                <p>{recharges.length} total recharges</p>
              </div>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recharges.map((recharge, index) => (
                      <tr key={index}>
                        <td>{recharge.memberName}</td>
                        <td>₹{recharge.amount?.toFixed(2)}</td>
                        <td>{formatDate(recharge.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {showGameModal && (
        <AddGameModal 
          onClose={() => setShowGameModal(false)}
          onGameAdded={handleGameAdded}
        />
      )}

      {showAdminModal && (
        <AddAdminModal 
          onClose={() => setShowAdminModal(false)}
          onAdminAdded={handleAdminAdded}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
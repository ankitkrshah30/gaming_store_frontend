import React, { useState, useEffect } from 'react';
import { memberService } from '../../services/memberService';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await memberService.getProfile();
      setProfileData(data);
    } catch (error) {
      setMessage('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div className="profile-info">
            <h1>{profileData?.name}</h1>
            <p className="phone-number">{profileData?.phoneNumber}</p>
            <p className="member-since">Member since {formatDate(profileData?.joiningDate)}</p>
          </div>
        </div>

        {message && (
          <div className="message error">{message}</div>
        )}

        <div className="profile-stats">
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Current Balance</h3>
              <p>₹{profileData?.balance?.toFixed(2)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎮</div>
            <div className="stat-info">
              <h3>Games Purchased</h3>
              <p>{profileData?.transactions?.length || 0}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💳</div>
            <div className="stat-info">
              <h3>Total Recharges</h3>
              <p>{profileData?.recharges?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="profile-sections">
          <div className="section">
            <h2>Recent Transactions</h2>
            {profileData?.transactions?.length > 0 ? (
              <div className="transactions-list">
                {profileData.transactions.slice(0, 5).map((transaction, index) => (
                  <div key={index} className="transaction-item">
                    <div className="transaction-info">
                      <h4>{transaction.gameName || 'Game Purchase'}</h4>
                      <p>{formatDate(transaction.date)}</p>
                    </div>
                    <div className="transaction-amount">
                      -₹{transaction.amount?.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No transactions yet</p>
            )}
          </div>

          <div className="section">
            <h2>Recent Recharges</h2>
            {profileData?.recharges?.length > 0 ? (
              <div className="recharges-list">
                {profileData.recharges.slice(0, 5).map((recharge, index) => (
                  <div key={index} className="recharge-item">
                    <div className="recharge-info">
                      <h4>Wallet Recharge</h4>
                      <p>{formatDate(recharge.date)}</p>
                    </div>
                    <div className="recharge-amount">
                      +₹{recharge.amount?.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No recharges yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
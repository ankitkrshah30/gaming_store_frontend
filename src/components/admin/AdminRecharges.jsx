import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './AdminRecharges.css';

const AdminRecharges = () => {
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRecharges();
  }, []);

  const loadRecharges = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminService.getAllRecharges();
      console.log('Recharges data:', data); // Debug log
      setRecharges(data || []); // Ensure it's always an array
    } catch (error) {
      console.error('Error loading recharges:', error);
      setError('Failed to load recharges: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading recharges...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error Loading Recharges</h3>
          <p>{error}</p>
          <button onClick={loadRecharges} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-recharges">
      <div className="section-header">
        <h2>All Recharges ({recharges.length})</h2>
        <p>View all recharge history</p>
        <button onClick={loadRecharges} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      {recharges.length === 0 ? (
        <div className="no-data">
          <h3>No Recharges Found</h3>
          <p>No recharge records are available at the moment.</p>
        </div>
      ) : (
        <div className="recharges-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Member ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recharges.map((recharge, index) => (
                <tr key={recharge.id || recharge._id || index}>
                  <td>{recharge.id || recharge._id || 'N/A'}</td>
                  <td>{recharge.memberId || 'N/A'}</td>
                  <td className="positive">
                    ₹{recharge.amount ? recharge.amount.toFixed(2) : '0.00'}
                  </td>
                  <td>
                    <span className={`status-badge ${(recharge.status || 'pending').toLowerCase()}`}>
                      {recharge.status || 'PENDING'}
                    </span>
                  </td>
                  <td>
                    {recharge.rechargeDate 
                      ? new Date(recharge.rechargeDate).toLocaleString()
                      : recharge.createdAt
                      ? new Date(recharge.createdAt).toLocaleString()
                      : 'N/A'
                    }
                  </td>
                  <td>
                    <button 
                      className="view-btn"
                      onClick={() => viewRechargeDetails(recharge)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  function viewRechargeDetails(recharge) {
    alert(`
      Recharge Details:
      ID: ${recharge.id || recharge._id}
      Member ID: ${recharge.memberId}
      Amount: ₹${recharge.amount}
      Status: ${recharge.status}
      Date: ${recharge.rechargeDate ? new Date(recharge.rechargeDate).toLocaleString() : 'N/A'}
    `);
  }
};

export default AdminRecharges;
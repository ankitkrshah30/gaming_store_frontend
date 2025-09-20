import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './AdminMembers.css';

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await adminService.getAllMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error loading members:', error);
      setMessage('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await adminService.deleteMember(memberId);
        await loadMembers();
        setMessage('Member deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting member:', error);
        const errorMsg = error.response?.data?.error || 'Failed to delete member';
        setMessage(errorMsg);
        setTimeout(() => setMessage(''), 5000);
      }
    }
  };

  const getUserRole = (member) => {
    // Handle your Role enum structure
    if (Array.isArray(member.roles)) {
      const hasAdmin = member.roles.some(role => 
        role === 'ADMIN' || 
        role.name === 'ADMIN' || 
        role.authority === 'ROLE_ADMIN' ||
        (typeof role === 'object' && role.name === 'ADMIN')
      );
      return hasAdmin ? 'ADMIN' : 'USER';
    }
    return 'USER';
  };

  if (loading) {
    return <div className="loading">Loading members...</div>;
  }

  return (
    <div className="admin-members">
      <div className="section-header">
        <h2>All Members ({members.length})</h2>
        <p>Manage all registered members</p>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="members-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Balance</th>
              <th>Role</th>
              <th>Joining Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map(member => {
              const role = getUserRole(member);
              return (
                <tr key={member.id}>
                  <td>{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.phoneNumber}</td>
                  <td>₹{member.balance?.toFixed(2) || '0.00'}</td>
                  <td>
                    <span className={`role-badge ${role.toLowerCase()}`}>
                      {role}
                    </span>
                  </td>
                  <td>
                    {member.joiningDate 
                      ? new Date(member.joiningDate).toLocaleDateString()
                      : 'N/A'
                    }
                  </td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteMember(member.id)}
                      disabled={role === 'ADMIN'}
                    >
                      {role === 'ADMIN' ? 'Protected' : 'Delete'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMembers;
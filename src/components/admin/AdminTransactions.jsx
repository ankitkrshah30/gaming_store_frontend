import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './AdminTransactions.css';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const data = await adminService.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  return (
    <div className="admin-transactions">
      <div className="section-header">
        <h2>All Transactions ({transactions.length})</h2>
        <p>View all transaction history</p>
      </div>

      <div className="transactions-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Member ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id || transaction._id}>
                <td>{transaction.id || transaction._id}</td>
                <td>{transaction.memberId}</td>
                <td>
                  <span className={`type-badge ${transaction.type?.toLowerCase() || 'unknown'}`}>
                    {transaction.type || 'UNKNOWN'}
                  </span>
                </td>
                <td className={transaction.type === 'DEBIT' ? 'negative' : 'positive'}>
                  {transaction.type === 'DEBIT' ? '-' : '+'}₹{transaction.amount?.toFixed(2) || '0.00'}
                </td>
                <td>{transaction.description}</td>
                <td>
                  {transaction.transactionDate 
                    ? new Date(transaction.transactionDate).toLocaleString()
                    : 'N/A'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactions;
import React, { useState } from 'react';
import { rechargeService } from '../../services/rechargeService';
import { useAuth } from '../../context/AuthContext';
import './Wallet.css';

const Wallet = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user, updateUserBalance } = useAuth();

  const predefinedAmounts = [100, 250, 500, 1000, 2000, 5000];

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString());
  };

  const handleRecharge = async (e) => {
    e.preventDefault();
    
    const rechargeAmount = parseFloat(amount);
    if (!rechargeAmount || rechargeAmount <= 0) {
      setMessage('Please enter a valid amount');
      return;
    }

    if (rechargeAmount < 10) {
      setMessage('Minimum recharge amount is ₹10');
      return;
    }

    if (rechargeAmount > 10000) {
      setMessage('Maximum recharge amount is ₹10,000');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await rechargeService.rechargeAccount(rechargeAmount);
      updateUserBalance(user.balance + rechargeAmount);
      setMessage(`Successfully recharged ₹${rechargeAmount}!`);
      setAmount('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Recharge failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet-page">
      <div className="wallet-container">
        <div className="wallet-header">
          <h1>My Wallet</h1>
          <div className="current-balance">
            <span className="balance-label">Current Balance</span>
            <span className="balance-amount">₹{user?.balance?.toFixed(2)}</span>
          </div>
        </div>

        <div className="recharge-section">
          <h2>Recharge Your Wallet</h2>
          <p>Add money to your wallet to purchase games</p>

          <div className="quick-amounts">
            <h3>Quick Recharge</h3>
            <div className="amount-buttons">
              {predefinedAmounts.map(amt => (
                <button
                  key={amt}
                  className={`amount-btn ${amount === amt.toString() ? 'selected' : ''}`}
                  onClick={() => handleAmountSelect(amt)}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleRecharge} className="recharge-form">
            <div className="form-group">
              <label htmlFor="amount">Enter Amount</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (₹10 - ₹10,000)"
                min="10"
                max="10000"
                step="1"
              />
            </div>

            {message && (
              <div className={`message ${message.includes('Successfully') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <button 
              type="submit" 
              className="recharge-btn"
              disabled={loading || !amount}
            >
              {loading ? 'Processing...' : `Recharge ₹${amount || '0'}`}
            </button>
          </form>

          <div className="payment-info">
            <h3>Payment Methods</h3>
            <div className="payment-methods">
              <div className="payment-method">
                <span className="method-icon">💳</span>
                <span>Credit/Debit Card</span>
              </div>
              <div className="payment-method">
                <span className="method-icon">🏦</span>
                <span>Net Banking</span>
              </div>
              <div className="payment-method">
                <span className="method-icon">📱</span>
                <span>UPI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
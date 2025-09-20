import React, { useState, useEffect } from 'react';
import { gameService } from '../../services/gameService';
import { transactionService } from '../../services/transactionService';
import { useAuth } from '../../context/AuthContext';
import GameCard from '../../components/GameCard/GameCard';
import './games.css';

const Games = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [message, setMessage] = useState('');
  const { user, updateUserBalance } = useAuth();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const gamesData = await gameService.getAllGames();
      setGames(gamesData);
    } catch (error) {
      setMessage('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (gameId, gameName, gamePrice) => {
    if (user.balance < gamePrice) {
      setMessage(`Insufficient balance! You need ₹${gamePrice - user.balance} more.`);
      return;
    }

    setPurchasing(gameId);
    try {
      const result = await transactionService.purchaseGame(gameId);
      setMessage(`Successfully purchased ${gameName}!`);
      updateUserBalance(user.balance - gamePrice);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Purchase failed');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="games-page">
        <div className="loading-container">
          <div className="loading-spinner">Loading games...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="games-page">
      <div className="games-header">
        <h1>Game Store</h1>
        <p>Choose from our collection of amazing games</p>
        <div className="user-balance">
          Your Balance: <span>₹{user?.balance?.toFixed(2)}</span>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('Successfully') ? 'success' : 'error'}`}>
          {message}
          <button onClick={() => setMessage('')} className="close-btn">×</button>
        </div>
      )}

      <div className="games-grid">
        {games.map(game => (
          <div key={game.id} className="game-item">
            <GameCard 
              game={game}
              onPurchase={handlePurchase}
              purchasing={purchasing === game.id}
              userBalance={user?.balance}
            />
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="no-games">
          <h3>No games available</h3>
          <p>Check back later for new releases!</p>
        </div>
      )}
    </div>
  );
};

export default Games;
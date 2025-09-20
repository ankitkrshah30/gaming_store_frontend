import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './AdminGames.css';

const AdminGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const data = await adminService.getAllGames();
      setGames(data);
    } catch (error) {
      console.error('Error loading games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGame = async (gameId) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      try {
        await adminService.deleteGame(gameId);
        await loadGames();
        setMessage('Game deleted successfully');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting game:', error);
        setMessage('Failed to delete game');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading games...</div>;
  }

  return (
    <div className="admin-games">
      <div className="section-header">
        <h2>All Games ({games.length})</h2>
        <button 
          className="add-btn"
          onClick={() => setShowAddModal(true)}
        >
          Add New Game
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="games-grid">
        {games.map(game => (
          <div key={game.id || game._id} className="game-card">
            <div className="game-info">
              <h3>{game.name}</h3>
              <div className="game-details">
                <p><strong>Price:</strong> ₹{game.price?.toFixed(2) || '0.00'}</p>
                <p><strong>Max Players:</strong> {game.maxPlayers || 'N/A'}</p>
                <p><strong>Duration:</strong> {game.duration || 'N/A'}</p>
              </div>
            </div>
            <div className="game-actions">
              <button 
                className="delete-btn"
                onClick={() => handleDeleteGame(game.id || game._id)}
              >
                Delete Game
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <AddGameModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadGames();
            setMessage('Game added successfully');
            setTimeout(() => setMessage(''), 3000);
          }}
        />
      )}
    </div>
  );
};

// Simple Add Game Modal
const AddGameModal = ({ onClose, onSuccess }) => {
  const [gameData, setGameData] = useState({
    name: '',
    price: '',
    maxPlayers: '',
    duration: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminService.addGame({
        ...gameData,
        price: parseFloat(gameData.price),
        maxPlayers: parseInt(gameData.maxPlayers)
      });
      onSuccess();
    } catch (error) {
      console.error('Error adding game:', error);
      alert('Failed to add game');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add New Game</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Game Name"
            value={gameData.name}
            onChange={(e) => setGameData({...gameData, name: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={gameData.price}
            onChange={(e) => setGameData({...gameData, price: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Max Players"
            value={gameData.maxPlayers}
            onChange={(e) => setGameData({...gameData, maxPlayers: e.target.value})}
          />
          <input
            type="text"
            placeholder="Duration (e.g., 30 minutes)"
            value={gameData.duration}
            onChange={(e) => setGameData({...gameData, duration: e.target.value})}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Add Game</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminGames;
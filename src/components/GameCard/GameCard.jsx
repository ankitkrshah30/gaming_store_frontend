import React from 'react';
import './GameCard.css';

const GameCard = ({ game, onPurchase, purchasing, userBalance }) => {
  const getImageUrl = (gifURL) => {
    if (!gifURL) return null;
    const filename = gifURL.split('\\').pop();
    return `http://localhost:8080/GIF_Assets/${filename}`;
  };

  const imageUrl = getImageUrl(game.gifURL);
  const canAfford = userBalance >= game.price;

  const handlePurchase = () => {
    if (onPurchase && !purchasing) {
      onPurchase(game.id, game.name, game.price);
    }
  };

  return (
    <div className="game-card">
      <div className="game-card-media">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={game.name} 
            className="game-card-gif"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="game-placeholder" style={{ display: imageUrl ? 'none' : 'flex' }}>
          <span>No Image Available</span>
        </div>
      </div>
      
      <div className="game-card-content">
        <h3 className="game-card-title">{game.name}</h3>
        <p className="game-card-price">₹{game.price.toFixed(2)}</p>
        
        <div className="game-card-details">
          <div className="detail-item">
            <span className="detail-label">Players:</span>
            <span className="detail-value">
              {game.minPlayer === game.maxPlayer 
                ? `${game.minPlayer}` 
                : `${game.minPlayer}-${game.maxPlayer}`}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">{game.duration} mins</span>
          </div>
          
          {game.multipleOf && (
            <div className="detail-item">
              <span className="detail-label">Multiple of:</span>
              <span className="detail-value">{game.multipleOf}</span>
            </div>
          )}
        </div>
        
        {game.description && (
          <p className="game-card-description">
            {game.description.length > 100 
              ? `${game.description.substring(0, 100)}...` 
              : game.description}
          </p>
        )}
        
        <button 
          className={`game-card-button ${!canAfford ? 'disabled' : ''}`}
          onClick={handlePurchase}
          disabled={purchasing || !canAfford}
        >
          {purchasing ? 'Purchasing...' : 
           !canAfford ? 'Insufficient Balance' : 
           'Purchase Game'}
        </button>
      </div>
    </div>
  );
};

export default GameCard;
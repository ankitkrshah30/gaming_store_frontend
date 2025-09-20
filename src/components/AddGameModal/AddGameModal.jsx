import React, { useState } from 'react';
import { gameService } from '../../services/gameService';
import './AddGameModal.css';

const AddGameModal = ({ onClose, onGameAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    minPlayer: '',
    maxPlayer: '',
    multipleOf: '',
    duration: '',
    gifURL: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Game name is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.minPlayer || parseInt(formData.minPlayer) < 1) {
      newErrors.minPlayer = 'Minimum players must be at least 1';
    }

    if (!formData.maxPlayer || parseInt(formData.maxPlayer) < parseInt(formData.minPlayer)) {
      newErrors.maxPlayer = 'Maximum players must be greater than or equal to minimum players';
    }

    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = 'Valid duration is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const gameData = {
        ...formData,
        price: parseFloat(formData.price),
        minPlayer: parseInt(formData.minPlayer),
        maxPlayer: parseInt(formData.maxPlayer),
        multipleOf: formData.multipleOf ? parseInt(formData.multipleOf) : null,
        duration: parseInt(formData.duration)
      };

      await gameService.addGame(gameData);
      onGameAdded();
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Failed to add game' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Game</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Game Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter game name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.price ? 'error' : ''}
              />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter game description"
              rows="3"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minPlayer">Min Players *</label>
              <input
                type="number"
                id="minPlayer"
                name="minPlayer"
                value={formData.minPlayer}
                onChange={handleChange}
                placeholder="1"
                min="1"
                className={errors.minPlayer ? 'error' : ''}
              />
              {errors.minPlayer && <span className="error-text">{errors.minPlayer}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="maxPlayer">Max Players *</label>
              <input
                type="number"
                id="maxPlayer"
                name="maxPlayer"
                value={formData.maxPlayer}
                onChange={handleChange}
                placeholder="4"
                min="1"
                className={errors.maxPlayer ? 'error' : ''}
              />
              {errors.maxPlayer && <span className="error-text">{errors.maxPlayer}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="multipleOf">Multiple Of</label>
              <input
                type="number"
                id="multipleOf"
                name="multipleOf"
                value={formData.multipleOf}
                onChange={handleChange}
                placeholder="Optional"
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (minutes) *</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="30"
                min="1"
                className={errors.duration ? 'error' : ''}
              />
              {errors.duration && <span className="error-text">{errors.duration}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="gifURL">GIF Path</label>
            <input
              type="text"
              id="gifURL"
              name="gifURL"
              value={formData.gifURL}
              onChange={handleChange}
              placeholder="e.g., C:\path\to\game.gif"
            />
          </div>

          {errors.submit && (
            <div className="error-message">{errors.submit}</div>
          )}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Game'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGameModal;
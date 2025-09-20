import api from './authService';

export const gameService = {
  // Get all games (public)
  getAllGames: async () => {
    const response = await api.get('/games');
    return response.data;
  },

  // Admin: Add new game
  addGame: async (gameData) => {
    const response = await api.post('/admin/games', gameData);
    return response.data;
  },

  // Admin: Delete game
  deleteGame: async (gameId) => {
    const response = await api.delete(`/admin/games/${gameId}`);
    return response.data;
  }
};
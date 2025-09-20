import api from './authService';

export const transactionService = {
  // User: Purchase game
  purchaseGame: async (gameId) => {
    const response = await api.post('/transactions/purchase', { gameId });
    return response.data;
  },

  // Admin: Get all transactions
  getAllTransactions: async () => {
    const response = await api.get('/admin/transactions');
    return response.data;
  }
};
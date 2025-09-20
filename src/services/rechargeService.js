import api from './authService';

export const rechargeService = {
  // User: Recharge account
  rechargeAccount: async (amount) => {
    const response = await api.post('/recharges', { amount });
    return response.data;
  },

  // Admin: Get all recharges
  getAllRecharges: async () => {
    const response = await api.get('/admin/recharges');
    return response.data;
  }
};
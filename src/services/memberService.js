import api from './authService';

export const memberService = {
  // User: Get own profile
  getProfile: async () => {
    const response = await api.get('/members/profile');
    return response.data;
  },

  // Admin: Get all members
  getAllMembers: async () => {
    const response = await api.get('/admin/members');
    return response.data;
  },

  // Admin: Delete member
  deleteMember: async (memberId) => {
    const response = await api.delete(`/admin/members/${memberId}`);
    return response.data;
  },

  // Mixed: Get member by ID
  getMemberById: async (memberId) => {
    const response = await api.get(`/members/${memberId}`);
    return response.data;
  }
};
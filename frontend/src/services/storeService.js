import api from './api';

const storeService = {
  // Get all stores (with optional search)
  getStores: async (search = '') => {
    const response = await api.get('/stores', {
      params: search ? { search } : {},
    });
    return response.data;
  },

  // Get store by ID
  getStore: async (storeId) => {
    const response = await api.get(`/stores/${storeId}`);
    return response.data;
  },
};

export default storeService;

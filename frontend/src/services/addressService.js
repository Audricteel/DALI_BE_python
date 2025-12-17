import api from './api';

const addressService = {
  // Get all addresses for current user
  getAddresses: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },

  // Get single address
  getAddress: async (addressId) => {
    const response = await api.get(`/addresses/${addressId}`);
    return response.data;
  },

  // Create new address
  createAddress: async (addressData) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    const response = await api.put(`/addresses/${addressId}`, addressData);
    return response.data;
  },

  // Delete address
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/addresses/${addressId}`);
    return response.data;
  },

  // Set default address
  setDefaultAddress: async (addressId) => {
    const response = await api.post(`/addresses/${addressId}/default`);
    return response.data;
  },
};

export default addressService;

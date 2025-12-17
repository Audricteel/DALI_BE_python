import api from './api';

const locationService = {
  // Get all provinces
  getProvinces: async () => {
    const response = await api.get('/locations/provinces');
    return response.data;
  },

  // Get cities by province ID
  getCities: async (provinceId) => {
    const response = await api.get(`/locations/provinces/${provinceId}/cities`);
    return response.data;
  },

  // Get barangays by city ID
  getBarangays: async (cityId) => {
    const response = await api.get(`/locations/cities/${cityId}/barangays`);
    return response.data;
  },
};

export default locationService;

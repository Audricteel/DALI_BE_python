import api from './api';

const checkoutService = {
  // Get checkout session details
  getCheckoutDetails: async () => {
    const response = await api.get('/checkout/details');
    return response.data;
  },

  // Set shipping address
  setAddress: async (addressId) => {
    const response = await api.post('/checkout/address', { address_id: addressId });
    return response.data;
  },

  // Set delivery method and get shipping fee
  setShipping: async (deliveryMethod, storeId = null) => {
    const response = await api.post('/checkout/shipping', {
      delivery_method: deliveryMethod,
      store_id: storeId,
    });
    return response.data;
  },

  // Calculate shipping fee
  calculateShipping: async (addressId, deliveryMethod) => {
    const response = await api.get('/checkout/calculate-shipping', {
      params: { address_id: addressId, delivery_method: deliveryMethod },
    });
    return response.data;
  },

  // Place order with payment method
  placeOrder: async (paymentMethod) => {
    const response = await api.post('/checkout/payment', { payment_method: paymentMethod });
    return response.data;
  },

  // Get stores for pickup (uses stores API)
  getStoresForPickup: async (search = '') => {
    const response = await api.get('/stores', {
      params: { search },
    });
    return response.data;
  },
};

export default checkoutService;

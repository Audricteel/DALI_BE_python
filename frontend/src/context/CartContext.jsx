import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Calculate cart count from items
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch cart on mount and when auth changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      // Backend returns: { items: [], subtotal: number, total: number }
      const response = await cartService.getCart();
      setCartItems(response.items || []);
      setSubtotal(response.subtotal || 0);
      setTotal(response.total || 0);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // Reset cart on error
      setCartItems([]);
      setSubtotal(0);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      // Backend returns { message: "Item added to cart" }
      await cartService.addToCart(productId, quantity);
      // Refetch cart to get updated data
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to add to cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      // Backend returns { message: "Cart updated" }
      await cartService.updateCartItem(productId, quantity);
      // Refetch cart to get updated data
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error updating cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to update cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      // Backend returns { message: "Item removed from cart" }
      await cartService.removeFromCart(productId);
      // Refetch cart to get updated data
      await fetchCart();
      return { success: true };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to remove from cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.clearCart();
      setCartItems([]);
      setSubtotal(0);
      setTotal(0);
      return { success: true };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Failed to clear cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    cartCount,
    subtotal,
    total,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

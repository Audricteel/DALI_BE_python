import { useState, useEffect } from 'react';
import { locationService } from '../services';
import LocationPicker from './LocationPicker';
import './LocationPicker.css';

const AddressForm = ({
  address = null,
  onSubmit,
  onCancel,
  submitLabel = 'Save Address',
}) => {
  const [formData, setFormData] = useState({
    additional_info: '',
    province_id: '',
    city_id: '',
    barangay_id: '',
    phone_number: '',
    is_default: false,
    latitude: null,
    longitude: null,
  });
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get selected names for geocoding
  const getSelectedProvinceName = () => {
    const province = provinces.find(p => p.province_id === parseInt(formData.province_id));
    return province?.province_name || '';
  };
  
  const getSelectedCityName = () => {
    const city = cities.find(c => c.city_id === parseInt(formData.city_id));
    return city?.city_name || '';
  };
  
  const getSelectedBarangayName = () => {
    const barangay = barangays.find(b => b.barangay_id === parseInt(formData.barangay_id));
    return barangay?.barangay_name || '';
  };
  // Load provinces on mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const data = await locationService.getProvinces();
        setProvinces(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading provinces:', err);
      }
    };
    loadProvinces();
  }, []);

  // Load cities when province changes
  useEffect(() => {
    if (formData.province_id) {
      const loadCities = async () => {
        try {
          const data = await locationService.getCities(formData.province_id);
          setCities(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Error loading cities:', err);
        }
      };
      loadCities();
    } else {
      setCities([]);
      setBarangays([]);
    }
  }, [formData.province_id]);

  // Load barangays when city changes
  useEffect(() => {
    if (formData.city_id) {
      const loadBarangays = async () => {
        try {
          const data = await locationService.getBarangays(formData.city_id);
          setBarangays(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error('Error loading barangays:', err);
        }
      };
      loadBarangays();
    } else {
      setBarangays([]);
    }
  }, [formData.city_id]);

  // Populate form if editing
  useEffect(() => {
    if (address) {
      setFormData({
        additional_info: address.additional_info || '',
        province_id: address.province_id || '',
        city_id: address.city_id || '',
        barangay_id: address.barangay_id || '',
        phone_number: address.phone_number || '',
        is_default: address.is_default || false,
        latitude: address.latitude || null,
        longitude: address.longitude || null,
      });
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Reset dependent fields
    if (name === 'province_id') {
      setFormData((prev) => ({
        ...prev,
        city_id: '',
        barangay_id: '',
        latitude: null,
        longitude: null,
      }));
    }
    if (name === 'city_id') {
      setFormData((prev) => ({
        ...prev,
        barangay_id: '',
        latitude: null,
        longitude: null,
      }));
    }
    if (name === 'barangay_id') {
      // Reset coordinates when barangay changes so user re-pins
      setFormData((prev) => ({
        ...prev,
        latitude: null,
        longitude: null,
      }));
    }
  };

  // Handle location change from map picker
  const handleLocationChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate that location is pinned
    if (!formData.latitude || !formData.longitude) {
      setError('Please pin your location on the map for accurate delivery fee calculation');
      setLoading(false);
      return;
    }

    try {
      // Convert string IDs to integers for the backend
      const submitData = {
        ...formData,
        province_id: parseInt(formData.province_id),
        city_id: parseInt(formData.city_id),
        barangay_id: parseInt(formData.barangay_id),
      };
      await onSubmit(submitData);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-form-container">
      {onCancel && (
        <button
          type="button"
          className="address-form-cancel-btn"
          onClick={onCancel}
        >
          ×
        </button>
      )}

      <form className="address-form" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="e.g., 09123456789"
            pattern="^(\+63|0)9\d{9}$"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="province_id">Province</label>
          <select
            id="province_id"
            name="province_id"
            value={formData.province_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option key={province.province_id} value={province.province_id}>
                {province.province_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="city_id">City / Municipality</label>
          <select
            id="city_id"
            name="city_id"
            value={formData.city_id}
            onChange={handleChange}
            required
            disabled={!formData.province_id}
          >
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="barangay_id">Barangay</label>
          <select
            id="barangay_id"
            name="barangay_id"
            value={formData.barangay_id}
            onChange={handleChange}
            required
            disabled={!formData.city_id}
          >
            <option value="">Select Barangay</option>
            {barangays.map((barangay) => (
              <option key={barangay.barangay_id} value={barangay.barangay_id}>
                {barangay.barangay_name}
              </option>
            ))}
          </select>
        </div>

        {/* Location Picker - shown after barangay is selected */}
        {formData.barangay_id && (
          <LocationPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            onChange={handleLocationChange}
            provinceName={getSelectedProvinceName()}
            cityName={getSelectedCityName()}
            barangayName={getSelectedBarangayName()}
          />
        )}

        <div className="form-group">
          <label htmlFor="additional_info">Street Address / Additional Info</label>
          <input
            type="text"
            id="additional_info"
            name="additional_info"
            value={formData.additional_info}
            onChange={handleChange}
            placeholder="House No., Street Name, Building"
            required
          />
        </div>

        <div className="form-group-checkbox">
          <input
            type="checkbox"
            id="is_default"
            name="is_default"
            checked={formData.is_default}
            onChange={handleChange}
          />
          <label htmlFor="is_default">Set as default address</label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading || !formData.latitude}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </form>
    </div>
  );
};

export default AddressForm;

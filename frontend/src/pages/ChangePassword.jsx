import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services';

const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    number: false,
    special: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'newPassword') {
      setPasswordValidation({
        length: value.length >= 8,
        number: /\d/.test(value),
        special: /[!@#$%^&*]/.test(value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (
      !passwordValidation.length ||
      !passwordValidation.number ||
      !passwordValidation.special
    ) {
      setError('Please ensure your new password meets all requirements.');
      return;
    }

    setLoading(true);

    try {
      await authService.changePassword(
        formData.currentPassword,
        formData.newPassword,
        formData.confirmPassword
      );
      setSuccess('Password changed successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div>
            <p>Security</p>
            <h1>Change Password</h1>
          </div>
          <Link to="/profile" className="edit-link">
            Back to Profile
          </Link>
        </div>

        <div className="profile-content" style={{ display: 'block' }}>
          <div className="profile-main" style={{ maxWidth: '500px' }}>
            {error && <div className="auth-error">{error}</div>}
            {success && <div className="auth-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div id="password-rules" className="password-rules-container">
                <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
                  <li
                    style={{
                      color: passwordValidation.length ? '#28a745' : '#dc3545',
                      fontSize: '0.85rem',
                      marginBottom: '5px',
                    }}
                  >
                    {passwordValidation.length ? '✓' : '✗'} At least 8 characters
                  </li>
                  <li
                    style={{
                      color: passwordValidation.number ? '#28a745' : '#dc3545',
                      fontSize: '0.85rem',
                      marginBottom: '5px',
                    }}
                  >
                    {passwordValidation.number ? '✓' : '✗'} At least one number (0-9)
                  </li>
                  <li
                    style={{
                      color: passwordValidation.special ? '#28a745' : '#dc3545',
                      fontSize: '0.85rem',
                      marginBottom: '5px',
                    }}
                  >
                    {passwordValidation.special ? '✓' : '✗'} At least one special character
                    (!@#$%^&*)
                  </li>
                </ul>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
                <Link to="/profile" className="btn btn-secondary">
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChangePassword;

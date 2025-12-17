import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSuccess(
        'If an account with that email exists, a password reset link has been sent.'
      );
    } catch (err) {
      setError(
        err.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        {/* Image Panel */}
        <div className="auth-image-panel">
          <Link to="/login" className="back-to-shop-btn">
            <span>&lt;</span>&nbsp;Back to login
          </Link>
          <img src="/images/login.png" alt="Shopping cart with groceries" />
        </div>

        {/* Form Panel */}
        <div className="auth-form-panel">
          <h2>Forgot Password</h2>
          <p className="sub-heading">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="switch-auth-link" style={{ marginTop: '30px' }}>
            Remember your password? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

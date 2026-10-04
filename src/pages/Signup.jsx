import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store';

export default function Signup() {
  const { s, actions } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isGuest = s.auth?.type === 'guest';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // If user currently has guest data, convert it seamlessly, otherwise standard register
      if (isGuest && s.auth?.guestId) {
        await actions.convertGuest({
          name: name.trim(),
          email: email.trim(),
          password
        });
      } else {
        await actions.register({
          name: name.trim(),
          email: email.trim(),
          password
        });
      }
      navigate(redirectUrl, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 460, margin: '20px auto 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            background: 'var(--ac)',
            display: 'inline-grid',
            placeItems: 'center',
            fontSize: 24,
            marginBottom: 12
          }}
        >
          🚀
        </div>
        <h1>Create your account</h1>
        <p className="mut" style={{ marginTop: 6 }}>
          {isGuest
            ? 'Claim your guest progress and unlock your permanent profile.'
            : 'Join the challenge platform, set goals, and build consistency.'}
        </p>
      </div>

      <div className="card">
        {error && (
          <div
            style={{
              color: 'var(--bad)',
              background: 'var(--bads)',
              padding: '10px 14px',
              borderRadius: 10,
              marginBottom: 16,
              fontSize: 14,
              fontWeight: 600
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ marginTop: 0 }}>Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>

          <div>
            <label>Email Address</label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              required
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              required
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn p big"
            style={{ width: '100%', marginTop: 24 }}
          >
            {loading ? 'Creating Account…' : isGuest ? 'Save Progress & Sign Up' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
          <p className="mut">
            Already have an account?{' '}
            <Link
              to={`/login${redirectUrl !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
              style={{ color: 'var(--ac)', fontWeight: 700 }}
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

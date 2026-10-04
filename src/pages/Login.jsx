import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { authService } from '../services/authService';

export default function Login() {
  const { actions } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [mode, setMode] = useState('password'); // 'password' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!email.trim() || !password) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);
    try {
      await actions.login({ email: email.trim(), password });
      navigate(redirectUrl, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!email.trim()) {
      setError('Please enter your email to receive an OTP.');
      return;
    }

    setLoading(true);
    try {
      await authService.requestOtp(email.trim(), 'login');
      setOtpSent(true);
      setInfo('A 6-digit login code has been sent to your email.');
    } catch (err) {
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp.trim()) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.verifyOtp({ email: email.trim(), otp: otp.trim(), purpose: 'login' });
      await actions.refreshChallenges();
      actions.say(`Welcome back, ${res.user?.name || 'User'}! 👋`);
      navigate(redirectUrl, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP.');
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
          🔥
        </div>
        <h1>Welcome back</h1>
        <p className="mut" style={{ marginTop: 6 }}>
          Log in to manage your challenges and keep your streaks alive.
        </p>
      </div>

      <div className="card">
        <div className="tabs" style={{ marginTop: 0, marginBottom: 16 }}>
          <button
            type="button"
            className={mode === 'password' ? 'on' : ''}
            onClick={() => { setMode('password'); setError(''); setInfo(''); }}
          >
            Password
          </button>
          <button
            type="button"
            className={mode === 'otp' ? 'on' : ''}
            onClick={() => { setMode('otp'); setError(''); setInfo(''); }}
          >
            Email OTP
          </button>
        </div>

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

        {info && (
          <div
            style={{
              color: 'var(--ok)',
              background: 'var(--oks)',
              padding: '10px 14px',
              borderRadius: 10,
              marginBottom: 16,
              fontSize: 14,
              fontWeight: 600
            }}
          >
            ✉️ {info}
          </div>
        )}

        {mode === 'password' ? (
          <form onSubmit={handlePasswordLogin}>
            <div>
              <label style={{ marginTop: 0 }}>Email Address</label>
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn p big"
              style={{ width: '100%', marginTop: 24 }}
            >
              {loading ? 'Logging in…' : 'Log In'}
            </button>
          </form>
        ) : (
          <div>
            {!otpSent ? (
              <form onSubmit={handleRequestOtp}>
                <div>
                  <label style={{ marginTop: 0 }}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn p big"
                  style={{ width: '100%', marginTop: 24 }}
                >
                  {loading ? 'Sending Code…' : 'Send Login Code'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div>
                  <label style={{ marginTop: 0 }}>Enter 6-Digit Code sent to {email}</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    style={{ letterSpacing: '4px', fontSize: 20, textAlign: 'center' }}
                  />
                </div>

                <div className="row sb" style={{ marginTop: 12 }}>
                  <button
                    type="button"
                    className="like"
                    onClick={() => { setOtpSent(false); setOtp(''); }}
                  >
                    ← Change Email
                  </button>
                  <button
                    type="button"
                    className="like"
                    onClick={handleRequestOtp}
                    disabled={loading}
                  >
                    Resend Code
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn p big"
                  style={{ width: '100%', marginTop: 20 }}
                >
                  {loading ? 'Verifying…' : 'Verify & Log In'}
                </button>
              </form>
            )}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
          <p className="mut">
            Don't have an account yet?{' '}
            <Link
              to={`/signup${redirectUrl !== '/dashboard' ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
              style={{ color: 'var(--ac)', fontWeight: 700 }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

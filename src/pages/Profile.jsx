import { useState } from 'react';
import { useStore } from '../store';
import ChallengeCard from '../components/ChallengeCard';
import { UserAvatar } from '../components/ui';

const heat = Array.from({ length: 182 }, (_, i) => ['', 'a', 'b', 'c'][(i * 7 + (i % 5) * 3) % 11 > 7 ? (i % 3) + 1 : i % 4 === 0 ? 1 : 0]);

export default function Profile() {
  const { s, actions } = useStore();
  const [authMode, setAuthMode] = useState('convert'); // 'convert' | 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const isGuest = s.auth?.type === 'guest';
  const mine = s.ch.filter((c) => c.own);
  const activeMine = mine.filter((c) => c.st === 'active' || c.status === 'ACTIVE' || c.status === 'UPCOMING');
  const completedMine = mine.filter((c) => c.st === 'completed' || c.status === 'COMPLETED');

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      if (authMode === 'convert') {
        if (!form.name || !form.email || !form.password) {
          throw new Error('Please fill in all fields to save your account.');
        }
        await actions.convertGuest({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        });
      } else if (authMode === 'login') {
        if (!form.email || !form.password) {
          throw new Error('Please provide email and password.');
        }
        await actions.login({
          email: form.email.trim(),
          password: form.password
        });
      } else if (authMode === 'register') {
        if (!form.name || !form.email || !form.password) {
          throw new Error('Please fill in all required fields.');
        }
        await actions.register({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password
        });
      }
      setForm({ name: '', email: '', password: '' });
    } catch (err) {
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{ textAlign: 'center', paddingTop: 10 }}>
        <UserAvatar name={s.me} large />
        <h1 style={{ marginTop: 12 }}>{s.me}</h1>
        <p className="mut" style={{ marginTop: 6 }}>
          {completedMine.length} completed · {activeMine.length} active · 🔥 {s.streak} day streak
        </p>
        {!isGuest && s.auth?.user?.email && (
          <p className="mut" style={{ marginTop: 2, fontSize: 13 }}>
            📧 {s.auth.user.email}
          </p>
        )}
      </div>

      {isGuest ? (
        <div className="card" style={{ marginTop: 24, border: '1px solid var(--ac)' }}>
          <div className="row sb">
            <div>
              <h2 style={{ color: 'var(--ac)' }}>⚡ Save Your Challenges</h2>
              <p className="mut" style={{ marginTop: 4 }}>
                You are browsing as a <b>Guest</b>. Create a permanent account to keep your challenges and progress across devices.
              </p>
            </div>
          </div>

          <div className="tabs" style={{ marginTop: 16 }}>
            <button
              type="button"
              className={authMode === 'convert' ? 'on' : ''}
              onClick={() => { setAuthMode('convert'); setAuthError(''); }}
            >
              Save Guest Account
            </button>
            <button
              type="button"
              className={authMode === 'login' ? 'on' : ''}
              onClick={() => { setAuthMode('login'); setAuthError(''); }}
            >
              Log In
            </button>
            <button
              type="button"
              className={authMode === 'register' ? 'on' : ''}
              onClick={() => { setAuthMode('register'); setAuthError(''); }}
            >
              New Account
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ marginTop: 16 }}>
            {authError && (
              <div style={{ color: 'var(--bad)', background: 'var(--bads)', padding: '8px 14px', borderRadius: 8, marginBottom: 12, fontSize: 14 }}>
                {authError}
              </div>
            )}

            {(authMode === 'convert' || authMode === 'register') && (
              <div>
                <label>Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            )}

            <div>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="btn p" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Processing…' : authMode === 'convert' ? 'Claim My Guest Account' : authMode === 'login' ? 'Log In' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
          <button type="button" className="btn" onClick={() => actions.logout()}>
            Sign Out
          </button>
        </div>
      )}

      <div className="sec">
        <h2>Activity</h2>
        <span className="mut">Last 26 weeks</span>
      </div>
      <div className="card">
        <div className="heat">
          {heat.map((h, i) => (
            <u key={i} className={h} />
          ))}
        </div>
      </div>

      <div className="sec">
        <h2>Your Active Challenges ({activeMine.length})</h2>
      </div>
      {activeMine.length > 0 ? (
        <div className="cols two">
          {activeMine.map((c) => (
            <ChallengeCard key={c.id} c={c} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
          <p className="mut">No active challenges. Start one today!</p>
        </div>
      )}

      <div className="sec">
        <h2>Your Completed Challenges ({completedMine.length})</h2>
      </div>
      {completedMine.length > 0 ? (
        <div className="cols two">
          {completedMine.map((c) => (
            <ChallengeCard key={c.id} c={c} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
          <p className="mut">No completed challenges yet. Stay focused on your goals!</p>
        </div>
      )}
    </>
  );
}

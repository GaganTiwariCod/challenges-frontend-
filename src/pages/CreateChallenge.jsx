import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function CreateChallenge() {
  const { s, actions } = useStore();
  const nav = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().split('T')[0]
  );
  const [place, setPlace] = useState('Online');
  const [visibility, setVisibility] = useState('PUBLIC');
  const [oathText, setOathText] = useState('I solemnly commit to completing this challenge with consistency and integrity.');
  const [oathAccepted, setOathAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const resolvedCategoryId = categoryId || (s.categories && s.categories[0]?.id) || '';

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter what you want to achieve.');
      return;
    }

    if (!oathText.trim()) {
      setError('Please write your commitment oath.');
      return;
    }

    if (!oathAccepted) {
      setError('You must accept your commitment oath to publish this challenge.');
      return;
    }

    const startAt = new Date(`${startDate}T00:00:00Z`).toISOString();
    const endAt = new Date(`${endDate}T23:59:59Z`).toISOString();

    if (new Date(startAt) >= new Date(endAt)) {
      setError('End date must be after the start date.');
      return;
    }

    setSubmitting(true);
    try {
      const id = await actions.createChallenge({
        title: title.trim(),
        description: description.trim(),
        categoryId: resolvedCategoryId,
        startAt,
        endAt,
        place: place.trim() || null,
        visibility,
        oathText: oathText.trim()
      });
      nav(`/challenges/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to create challenge. Please try again.');
      setSubmitting(false);
    }
  };

  const isUser = s.auth?.type === 'user';
  const hasGuestName = !!s.auth?.isGuestNamed || (s.me && s.me !== 'Guest');
  const [chosenApproach, setChosenApproach] = useState(isUser || hasGuestName ? 'ready' : '');
  const [guestNameInput, setGuestNameInput] = useState(s.me !== 'Guest' ? s.me : '');

  const handleGuestContinue = (e) => {
    e?.preventDefault();
    if (!guestNameInput.trim()) {
      setError('Please enter your name or nickname.');
      return;
    }
    actions.setGuestName(guestNameInput.trim());
    setChosenApproach('ready');
    setError('');
  };

  if (!isUser && !hasGuestName && chosenApproach !== 'ready') {
    return (
      <div style={{ maxWidth: 640, margin: '10px auto 40px' }}>
        <Link className="mut" to="/dashboard">
          ← Back
        </Link>
        <h1 style={{ margin: '14px 0 6px' }}>Before creating your challenge</h1>
        <p className="mut">Choose how you want to track and publish your commitment.</p>

        {error && (
          <div style={{ background: 'var(--bads)', color: 'var(--bad)', padding: '12px 16px', borderRadius: 12, marginTop: 14, fontWeight: 600 }}>
            ⚠️ {error}
          </div>
        )}

        <div className="cols two" style={{ marginTop: 24, gap: 18 }}>
          {/* 1. Guest Approach */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--line)' }}>
            <div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
              <h2>Guest Approach</h2>
              <p className="mut" style={{ marginTop: 6, fontSize: 14 }}>
                Instant & quick. Start right now without an email or password.
              </p>
              <form onSubmit={handleGuestContinue} style={{ marginTop: 16 }}>
                <label style={{ marginTop: 0 }}>Your Display Name / Nickname</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  required
                  value={guestNameInput}
                  onChange={(e) => setGuestNameInput(e.target.value)}
                />
                <button type="submit" className="btn p" style={{ width: '100%', marginTop: 16 }}>
                  Continue as Guest →
                </button>
              </form>
            </div>
          </div>

          {/* 2. Permanent Account */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--ac)' }}>
            <div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🔐</div>
              <h2 style={{ color: 'var(--ac)' }}>Permanent Account</h2>
              <p className="mut" style={{ marginTop: 6, fontSize: 14 }}>
                Recommended. Save your progress permanently, track streaks, and access on all devices.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 24 }}>
              <Link
                to={`/login?redirect=${encodeURIComponent('/challenges/create')}`}
                className="btn p"
                style={{ textAlign: 'center' }}
              >
                Log In
              </Link>
              <Link
                to={`/signup?redirect=${encodeURIComponent('/challenges/create')}`}
                className="btn"
                style={{ textAlign: 'center' }}
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Link className="mut" to="/dashboard">
        ← Back
      </Link>
      <div className="row sb" style={{ marginTop: 10 }}>
        <div>
          <h1 style={{ margin: 0 }}>Create your challenge</h1>
          <p className="mut" style={{ marginTop: 4 }}>
            Publishing as <b>{s.me}</b> {isUser ? '👤 (Verified Account)' : '⚡ (Guest Mode)'}
          </p>
        </div>
        {!isUser && (
          <Link
            to={`/login?redirect=${encodeURIComponent('/challenges/create')}`}
            className="btn"
            style={{ fontSize: 13, padding: '6px 12px' }}
          >
            Log in to save
          </Link>
        )}
      </div>

      {error && (
        <div style={{ background: 'var(--bads)', color: 'var(--bad)', padding: '12px 16px', borderRadius: 12, marginTop: 14, fontWeight: 600 }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ marginTop: 18, maxWidth: 640 }}>
        <label style={{ marginTop: 0 }}>What do you want to achieve? *</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Run 100 KM in 30 Days"
        />

        <label>Why are you doing it?</label>
        <textarea
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your motivation and what success looks like…"
        />

        <label>Category *</label>
        <select
          value={resolvedCategoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          {(s.categories || []).map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.icon ? `${cat.icon} ` : ''}{cat.name}
            </option>
          ))}
        </select>

        <div className="row" style={{ marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Start date *</label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>End date *</label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <label>Location / Place</label>
        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="e.g. Powai Lake, Home, Gym, Online"
        />

        <label>Your Commitment Oath *</label>
        <textarea
          rows="2"
          required
          value={oathText}
          onChange={(e) => setOathText(e.target.value)}
          placeholder="Write your personal commitment statement…"
        />

        <div style={{ background: 'var(--acs)', padding: '14px 16px', borderRadius: 12, marginTop: 12 }}>
          <label className="row" style={{ margin: 0, cursor: 'pointer', fontWeight: 700, color: 'var(--ac)' }}>
            <input
              type="checkbox"
              style={{ width: 'auto', marginRight: 10 }}
              checked={oathAccepted}
              onChange={(e) => setOathAccepted(e.target.checked)}
            />
            I hereby take this oath and commit to completing this challenge.
          </label>
        </div>

        <label>Visibility</label>
        <div className="row">
          <label className="row" style={{ margin: 0, fontWeight: 400, cursor: 'pointer' }}>
            <input
              type="radio"
              name="visibility"
              value="PUBLIC"
              checked={visibility === 'PUBLIC'}
              onChange={() => setVisibility('PUBLIC')}
              style={{ width: 'auto', marginRight: 6 }}
            />
            Public (Appears in community feed)
          </label>
          <label className="row" style={{ margin: 0, fontWeight: 400, cursor: 'pointer' }}>
            <input
              type="radio"
              name="visibility"
              value="PRIVATE"
              checked={visibility === 'PRIVATE'}
              onChange={() => setVisibility('PRIVATE')}
              style={{ width: 'auto', marginRight: 6 }}
            />
            Private (Only visible to you)
          </label>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn p big"
          style={{ marginTop: 24, width: '100%' }}
        >
          {submitting ? 'Publishing Challenge…' : '🚀 Take Oath & Start Challenge'}
        </button>
      </form>
    </>
  );
}

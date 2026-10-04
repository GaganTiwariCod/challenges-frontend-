import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useStore, normalizeChallenge } from '../store';
import { challengeService } from '../services/challengeService';
import ChallengeHeader from '../components/ChallengeHeader';
import CommentSection from '../components/CommentSection';
import { LikeButton, EmptyState } from '../components/ui';

export default function ChallengeDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { s, actions } = useStore();

  const [challenge, setChallenge] = useState(() => s.ch.find((x) => x.id === id) || null);
  const [loading, setLoading] = useState(!challenge);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadChallenge() {
      try {
        setLoading(true);
        const data = await challengeService.get(id);
        if (isMounted) {
          const normalized = normalizeChallenge(data, s.auth);
          setChallenge(normalized);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Challenge not found.');
          setLoading(false);
        }
      }
    }

    loadChallenge();
    return () => {
      isMounted = false;
    };
  }, [id, s.auth]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this challenge?')) return;
    setCancelling(true);
    try {
      await challengeService.cancel(id);
      actions.say('Challenge cancelled.');
      await actions.refreshChallenges();
      nav('/challenges');
    } catch (err) {
      actions.say(err.message || 'Could not cancel challenge.');
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 32 }}>🔥</div>
        <p className="mut" style={{ marginTop: 12 }}>Loading challenge details…</p>
      </div>
    );
  }

  if (error || !challenge) {
    return <EmptyState title="Not found" text={error || 'This challenge does not exist or is private.'} />;
  }

  const isCompleted = challenge.status === 'COMPLETED' || challenge.st === 'completed';
  const isCancelled = challenge.status === 'CANCELLED' || challenge.st === 'cancelled';
  const isMine = challenge.own;

  return (
    <>
      <ChallengeHeader c={challenge} me={s.me} />

      {isCompleted && (
        <div className="card done">
          <div className="t">🏆</div>
          <h2 style={{ margin: '8px 0' }}>Challenge complete</h2>
          <p><b>{challenge.title}</b></p>
          <p className="mut">Goal reached · 100% complete</p>
          <p style={{ margin: '12px 0 18px' }}>You started. You committed. You finished.</p>
          <Link className="btn p" to="/challenges/create">Create new challenge</Link>
        </div>
      )}

      {isCancelled && (
        <div className="card" style={{ textAlign: 'center', background: 'var(--bads)', borderColor: 'transparent' }}>
          <h2>Challenge cancelled</h2>
          <p className="mut" style={{ margin: '6px 0 14px' }}>
            This challenge was cancelled by its creator.
          </p>
          <Link className="btn p" to="/challenges/create">Start a new challenge</Link>
        </div>
      )}

      {/* Oath & Commitment Card */}
      <div className="card hero" style={{ marginTop: 16, textAlign: 'left' }}>
        <div className="row sb">
          <span className="tag ok">📜 Oath of Commitment</span>
          {challenge.place && <span className="mut">📍 {challenge.place}</span>}
        </div>
        <p style={{ fontSize: 18, fontStyle: 'italic', margin: '14px 0 8px', color: 'var(--ink)' }}>
          “{challenge.oathText || 'I commit to completing this challenge.'}”
        </p>
        <div className="row sb mut" style={{ fontSize: 13, borderTop: '1px solid var(--line)', paddingTop: 12, marginTop: 12 }}>
          <span>Category: <b>{challenge.cat}</b></span>
          <span>{challenge.remainingTime?.label || `${challenge.left} days left`}</span>
        </div>
      </div>

      <div className="row wrap" style={{ margin: '16px 0' }}>
        <span className="card" style={{ padding: '6px 8px', borderRadius: 14 }}>
          <LikeButton k={challenge.id} n={challenge.likeCount || challenge.likes} />
        </span>
        <button
          type="button"
          className="btn"
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            actions.say('Link copied to clipboard! 📋');
          }}
        >
          Share
        </button>

        {isMine && !isCancelled && !isCompleted && (
          <button
            type="button"
            disabled={cancelling}
            className="btn"
            style={{ color: 'var(--bad)', marginLeft: 'auto' }}
            onClick={handleCancel}
          >
            {cancelling ? 'Cancelling…' : 'Cancel Challenge'}
          </button>
        )}
      </div>

      <CommentSection cid={challenge.id} />
    </>
  );
}

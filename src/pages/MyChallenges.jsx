import { useState } from 'react';
import { useStore } from '../store';
import ChallengeCard from '../components/ChallengeCard';
import { EmptyState } from '../components/ui';

export default function MyChallenges() {
  const { s } = useStore();
  const [tab, setTab] = useState('active');

  const myChallenges = (s.ch || []).filter((c) => {
    if (!c.own) return false;
    if (tab === 'active') return c.status === 'ACTIVE' || c.status === 'UPCOMING' || c.st === 'active';
    if (tab === 'completed') return c.status === 'COMPLETED' || c.st === 'completed';
    if (tab === 'cancelled' || tab === 'failed') return c.status === 'CANCELLED' || c.status === 'FAILED' || c.st === 'failed';
    return true;
  });

  return (
    <>
      <h1>My challenges</h1>
      <div className="tabs">
        {['active', 'completed', 'cancelled'].map((t) => (
          <button
            key={t}
            type="button"
            className={tab === t ? 'on' : ''}
            onClick={() => setTab(t)}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="cols two">
        {myChallenges.length > 0 ? (
          myChallenges.map((c) => <ChallengeCard key={c.id} c={c} />)
        ) : (
          <EmptyState
            title="No challenges here"
            text={`You do not have any ${tab} challenges right now. Start a new one today!`}
          />
        )}
      </div>
    </>
  );
}

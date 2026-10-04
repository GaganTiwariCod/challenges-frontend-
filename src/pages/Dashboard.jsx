import { Link } from 'react-router-dom';
import { useStore } from '../store';
import ChallengeCard from '../components/ChallengeCard';
import { EmptyState } from '../components/ui';

export default function Dashboard() {
  const { s } = useStore();
  const act = s.ch ? s.ch.filter((c) => c.own && (c.st === 'active' || c.status === 'ACTIVE' || c.status === 'UPCOMING')) : [];
  const community = s.ch ? s.ch.slice(0, 4) : [];

  if (s.loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: 32 }}>🔥</div>
        <p className="mut" style={{ marginTop: 12 }}>Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <>
      <div className="row sb wrap">
        <div>
          <h1>Good morning, {s.me} 👋</h1>
          <p className="mut" style={{ fontSize: 16, marginTop: 6 }}>
            What are you going to accomplish today?
          </p>
        </div>
        <Link className="btn p big" to="/challenges/create">
          + Create challenge
        </Link>
      </div>

      <div className="stats">
        <div>🔥 {s.streak}<span>day streak</span></div>
        <div>🏆 {s.done}<span>completed</span></div>
        <div>🎯 {act.length}<span>active</span></div>
        <div>✍️ {s.commits}<span>commits</span></div>
      </div>

      <div className="sec">
        <h2>Your active challenges</h2>
        <Link to="/challenges">View all →</Link>
      </div>

      <div className="cols two">
        {act.length > 0 ? (
          act.map((c) => <ChallengeCard key={c.id} c={c} />)
        ) : (
          <EmptyState
            title="No active challenges yet"
            text="Make a commitment today. Take the oath and start your journey."
          />
        )}
      </div>

      <div className="sec">
        <h2>Community Challenges</h2>
        <Link to="/explore">Explore all →</Link>
      </div>

      <div className="cols two">
        {community.length > 0 ? (
          community.map((c) => <ChallengeCard key={c.id} c={c} />)
        ) : (
          <EmptyState
            title="No community challenges yet"
            text="Be the first person to publish a challenge on the platform."
          />
        )}
      </div>
    </>
  );
}

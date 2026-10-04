import { Link } from 'react-router-dom';
import { UserAvatar, Countdown, StatusTag } from './ui';

export default function ChallengeHeader({ c, me }) {
  const who = c?.by || (c?.creator?.name) || me;
  const title = c?.title || c?.t || 'Challenge';
  const description = c?.description || c?.d || '';

  return (
    <>
      <Link className="mut" to="/challenges">
        ← Back
      </Link>
      <div className="row sb wrap" style={{ margin: '10px 0 16px' }}>
        <div>
          <h1>🔥 {title}</h1>
          {description && (
            <p className="mut" style={{ fontSize: 16, margin: '6px 0 10px' }}>
              {description}
            </p>
          )}
          <div className="row">
            <UserAvatar name={who} />
            <b>{who}</b>
            {c?.cat && <span className="tag" style={{ marginLeft: 8 }}>{c.cat}</span>}
          </div>
        </div>
        <div>
          <StatusTag c={c} />
        </div>
      </div>
    </>
  );
}

import { Link } from 'react-router-dom';
import { StatusTag, LikeButton } from './ui';

export default function ChallengeCard({ c }) {
  if (!c) return null;

  const title = c.title || c.t || 'Challenge';
  const description = c.description || c.d || '';
  const categoryName = c.category?.name || c.cat || 'General';
  const creatorName = c.creator?.name || c.by || '';
  const isCancelled = c.status === 'CANCELLED' || c.st === 'cancelled';
  const isCompleted = c.status === 'COMPLETED' || c.st === 'completed';

  return (
    <article className="card cc">
      <div className="row sb">
        <span className="mut">
          <b>{categoryName}</b>
          {creatorName ? ` · ${creatorName}` : ''}
          {c.place ? ` · 📍 ${c.place}` : ''}
        </span>
        <StatusTag c={c} />
      </div>

      <Link to={`/challenges/${c.id}`}>
        <h3>🔥 {title}</h3>
      </Link>

      {description && <p className="mut">{description}</p>}

      {c.oathText && (
        <p style={{ fontSize: 13, fontStyle: 'italic', color: 'var(--mut)', margin: '4px 0 8px' }}>
          “{c.oathText.length > 75 ? `${c.oathText.substring(0, 75)}…` : c.oathText}”
        </p>
      )}

      <div className="row sb mut" style={{ marginTop: 'auto', paddingTop: 8 }}>
        <span>💬 {c.commentCount ?? c.cm ?? 0} comments</span>
        <div className="row" style={{ gap: 8 }}>
          <LikeButton k={c.id} n={c.likeCount ?? c.likes ?? 0} />
        </div>
      </div>

      <div className="row sb" style={{ marginTop: 6 }}>
        <Link className="btn" to={`/challenges/${c.id}`}>
          View challenge →
        </Link>
        {c.own && !isCancelled && !isCompleted && (
          <span className="tag ok">Your challenge</span>
        )}
      </div>
    </article>
  );
}

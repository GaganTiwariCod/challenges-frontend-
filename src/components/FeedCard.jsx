import {Link} from 'react-router-dom'
import {pct} from '../store'
import {UserAvatar, ProgressRow, LikeButton} from './ui'

export default function FeedCard({f, c}) {
  if (!f) return null
  return (
    <article className="card">
      <div className="row sb">
        <div className="row">
          <UserAvatar name={f.u} />
          <b>{f.u}</b>
        </div>
        <span className="mut">{f.ago}</span>
      </div>
      {c && (
        <p style={{marginTop: 12}}>
          <Link to={`/challenges/${c.id}`}>
            <b>🔥 {c.t}</b>
          </Link>
        </p>
      )}
      <p className="mut">Day {f.day} commit</p>
      <p style={{fontSize: 17, margin: '8px 0 14px'}}>“{f.tx}”</p>
      {c && <ProgressRow value={pct(c)} />}
      <div className="row" style={{marginTop: 10}}>
        <LikeButton k={'f' + f.u} n={f.l || 0} />
        <span className="mut">💬 {f.cm || 0}</span>
      </div>
    </article>
  )
}

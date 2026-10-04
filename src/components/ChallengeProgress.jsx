import {pct, fin} from '../store'
import {ProgressBar, StreakBadge} from './ui'
export default function ChallengeProgress({c}) {
  const p = pct(c)
  return (
    <div className="card hero" style={{marginTop: 16}}>
      <div className="big-p">{p}%</div>
      <div style={{maxWidth: 420, margin: '18px auto 12px'}}><ProgressBar value={p} ok={p === 100} /></div>
      <p><b>{fin(c)} / {c.ms.length}</b> milestones</p>
      <p style={{marginTop: 6}}><StreakBadge n={c.sk} /></p>
    </div>
  )
}

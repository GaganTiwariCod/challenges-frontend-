import {LikeButton, ProgressBar} from './ui'
export default function CommitCard({l, p}) {
  return (<><div className="day">{l.w}</div><div className="card"><b>🔥 Day {l.day}</b><p style={{margin: '6px 0 12px'}}>{l.tx}</p><ProgressBar value={Math.min(p, l.day * 4)} /><div className="row" style={{marginTop: 8}}><LikeButton k={'l' + l.id} n={l.l} /><span className="mut">💬 {l.cm}</span></div></div></>)
}

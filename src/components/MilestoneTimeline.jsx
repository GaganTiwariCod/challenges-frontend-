import {useStore} from '../store'
export default function MilestoneTimeline({c, editable}) {
  const {actions} = useStore(), cur = c.ms.findIndex((m) => !m.d)
  return (
    <div className="card"><div className="tl">
      {c.ms.map((m, i) => (
        <div key={i} className={'ms ' + (m.d ? 'd' : i === cur ? 'c' : '')}>
          <i onClick={() => editable && actions.toggleMilestone(c.id, i)}>{m.d ? '✓' : ''}</i>
          <div><div className="nm">{m.n}</div>{i === cur && <span className="tag">Current</span>}</div>
        </div>
      ))}
    </div></div>
  )
}

import {useStore} from '../store'

export const UserAvatar = ({name, large}) => (
  <span className={'av' + (large ? ' l' : '')}>{name ? name[0] : 'U'}</span>
)

export const ProgressBar = ({value = 0, ok}) => (
  <div className={'pb' + (ok ? ' ok' : '')}>
    <b style={{width: `${Math.min(100, Math.max(0, value))}%`}} />
  </div>
)

export const ProgressRow = ({value = 0, ok}) => (
  <div className="pl">
    <ProgressBar value={value} ok={ok} />
    <strong>{value}%</strong>
  </div>
)

export const StreakBadge = ({n = 0}) => <span>🔥 {n} day streak</span>

export const Countdown = ({days = 0, big}) => (
  <span className={'tag' + (days <= 3 ? ' warn' : '')} style={big ? {fontSize: 14, padding: '6px 14px'} : null}>
    {big ? `${days} DAYS LEFT` : `${days} days left`}
  </span>
)

export const EmptyState = ({title, text}) => (
  <div className="card" style={{textAlign: 'center', padding: 36, gridColumn: '1/-1'}}>
    <div style={{fontSize: 34}}>🌱</div>
    <h2 style={{margin: '8px 0 4px'}}>{title}</h2>
    <p className="mut">{text}</p>
  </div>
)

export function LikeButton({k, n = 0}) {
  const {s, actions} = useStore()
  const on = !!s?.likes?.[k]
  return (
    <button className={'like' + (on ? ' on' : '')} onClick={() => actions?.toggleLike?.(k)}>
      <i>{on ? '♥' : '♡'}</i> {n + (on ? 1 : 0)}
    </button>
  )
}

export const StatusTag = ({c}) => {
  if (!c) return null
  return c.st === 'completed' ? (
    <span className="tag ok">🏆 Completed</span>
  ) : c.st === 'failed' ? (
    <span className="tag bad">Ended</span>
  ) : (
    <Countdown days={c.left ?? 0} />
  )
}

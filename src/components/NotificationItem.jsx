export default function NotificationItem({n}) {
  return <div className="nt"><div className="e">{n[0]}</div><div style={{flex: 1}}><b style={{fontWeight: 600}}>{n[1]}</b><p className="mut">{n[2]}</p></div></div>
}

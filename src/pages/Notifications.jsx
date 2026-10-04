import {useStore} from '../store'
import NotificationItem from '../components/NotificationItem'
export default function Notifications() {
  const {s} = useStore()
  return (<><h1>Notifications</h1><div className="card" style={{marginTop: 18}}>{s.notes.map((n, i) => <NotificationItem key={i} n={n} />)}</div></>)
}

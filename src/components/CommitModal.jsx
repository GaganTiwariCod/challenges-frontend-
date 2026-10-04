import {useState, useEffect} from 'react'
import {useStore, pct} from '../store'
import {ProgressRow} from './ui'

export default function CommitModal({c, onClose}) {
  const {actions} = useStore()
  const [tx, setTx] = useState('')
  const [mark, setMark] = useState(true)
  const cur = c?.ms?.find((m) => !m.d)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  const post = () => {
    if (!tx.trim()) return
    actions.postCommit(c.id, tx.trim(), mark && !!cur)
    onClose()
  }

  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="card" style={{borderRadius: 24}}>
        <div className="row sb">
          <h2>🔥 Add your commit</h2>
          <button className="ib" onClick={onClose} aria-label="Close">×</button>
        </div>
        <label>What did you accomplish today?</label>
        <textarea
          autoFocus
          rows="4"
          value={tx}
          onChange={(e) => setTx(e.target.value)}
          placeholder="Today I completed closures and solved 10 practice questions…"
        />
        <label>Current progress</label>
        <ProgressRow value={pct(c)} />
        {cur && (
          <label className="row" style={{fontWeight: 400}}>
            <input
              type="checkbox"
              style={{width: 'auto'}}
              checked={mark}
              onChange={(e) => setMark(e.target.checked)}
            />
            Mark “{cur.n}” complete
          </label>
        )}
        <button className="btn" style={{marginTop: 10}}>📷 Add proof</button>
        <div style={{textAlign: 'right', marginTop: 18}}>
          <button className="btn p big" onClick={post}>Post commit 🔥</button>
        </div>
      </div>
    </div>
  )
}

import { useStore } from '../store';
import { UserAvatar, LikeButton } from './ui';

export default function CommentItem({ x, all = [], cid, onDelete }) {
  const { s, actions } = useStore();
  const currentUserId = s.auth?.user?.id;
  const currentGuestId = s.auth?.guestId;
  const isAuthor = 
    (x.author?.id && (x.author.id === currentUserId || x.author.id === currentGuestId)) ||
    (x.userId && x.userId === currentUserId) ||
    (x.guestId && x.guestId === currentGuestId) ||
    (x.u && x.u === s.me);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(x.id);
    } else {
      actions.deleteComment(cid, x.id);
    }
  };

  return (
    <>
      <div className="cm">
        <div className="row">
          <UserAvatar name={x.u || x.author?.name || 'User'} />
          <b>{x.u || x.author?.name || 'User'}</b>
        </div>
        <p style={{ margin: '6px 0 4px 46px' }}>{x.tx || x.content}</p>
        <div className="row mut" style={{ marginLeft: 38 }}>
          <LikeButton k={'m' + x.id} n={x.l || 0} />
          {isAuthor && (
            <button
              type="button"
              className="like"
              onClick={handleDelete}
              style={{ color: '#ef4444' }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
      {Array.isArray(all) &&
        all
          .filter((r) => r.p === x.id)
          .map((r) => <div key={r.id} className="r"><CommentItem x={r} all={all} cid={cid} onDelete={onDelete} /></div>)}
    </>
  );
}

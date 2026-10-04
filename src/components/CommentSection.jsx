import { useState, useEffect } from 'react';
import { useStore } from '../store';
import { commentService } from '../services/commentService';
import CommentItem from './CommentItem';

export default function CommentSection({ cid }) {
  const { s, actions } = useStore();
  const [commentInput, setCommentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(() => s.cmt[cid] || []);

  useEffect(() => {
    let isMounted = true;
    async function loadComments() {
      try {
        setLoading(true);
        const list = await commentService.list(cid);
        if (isMounted) {
          const formatted = (list || []).map((item) => ({
            id: item.id,
            u: item.author?.name || 'User',
            author: item.author,
            tx: item.content,
            content: item.content,
            createdAt: item.createdAt
          }));
          setComments(formatted);
          setLoading(false);
        }
      } catch {
        if (isMounted) setLoading(false);
      }
    }

    if (cid) {
      loadComments();
    }

    return () => {
      isMounted = false;
    };
  }, [cid]);

  const handleSend = async () => {
    if (!commentInput.trim()) return;
    const text = commentInput.trim();
    setCommentInput('');

    // Prepend to local view
    const tempItem = {
      id: 'temp_' + Date.now(),
      u: s.me || 'User',
      tx: text,
      content: text,
      createdAt: new Date().toISOString()
    };
    setComments((prev) => [tempItem, ...prev]);

    try {
      await actions.addComment(cid, text);
    } catch {
      setComments((prev) => prev.filter((c) => c.id !== tempItem.id));
    }
  };

  const handleDelete = async (commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    await actions.deleteComment(cid, commentId);
  };

  return (
    <>
      <div className="sec">
        <h2>💬 Comments ({comments.length})</h2>
      </div>

      <div className="card">
        <div className="row" style={{ marginBottom: 16 }}>
          <input
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Write an encouraging comment or question…"
          />
          <button type="button" className="btn p" onClick={handleSend}>
            Send
          </button>
        </div>

        {loading && comments.length === 0 ? (
          <p className="mut" style={{ textAlign: 'center', padding: '12px 0' }}>
            Loading comments…
          </p>
        ) : comments.length > 0 ? (
          comments.map((x) => (
            <CommentItem
              key={x.id}
              x={x}
              cid={cid}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="mut" style={{ textAlign: 'center', padding: '12px 0' }}>
            No comments yet. Be the first to start the conversation!
          </p>
        )}
      </div>
    </>
  );
}

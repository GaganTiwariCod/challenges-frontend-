import { useState } from 'react';
import { useStore } from '../store';
import ChallengeCard from '../components/ChallengeCard';
import { EmptyState } from '../components/ui';

const FILTERS = ['Trending', 'New', 'Ending Soon', 'Completed'];

export default function Explore() {
  const { s } = useStore();
  const [cat, setCat] = useState('All');
  const [flt, setFlt] = useState('Trending');
  const [q, setQ] = useState('');

  const categoryNames = ['All', ...(s.categories?.map((c) => c.name) || ['Fitness', 'Programming', 'Study', 'Career', 'Personal Growth'])];

  let list = s.ch || [];

  // Filter by category
  if (cat !== 'All') {
    list = list.filter((c) => (c.category?.name || c.cat || '').toLowerCase() === cat.toLowerCase());
  }

  // Filter by search query
  if (q.trim()) {
    const query = q.trim().toLowerCase();
    list = list.filter(
      (c) =>
        (c.title || c.t || '').toLowerCase().includes(query) ||
        (c.description || c.d || '').toLowerCase().includes(query) ||
        (c.place || '').toLowerCase().includes(query)
    );
  }

  // Sorting / Filter options
  if (flt === 'Completed') {
    list = list.filter((c) => c.status === 'COMPLETED' || c.st === 'completed');
  } else if (flt === 'Ending Soon') {
    list = list
      .filter((c) => c.status === 'ACTIVE' || c.status === 'UPCOMING' || c.st === 'active')
      .sort((a, b) => (a.left ?? 30) - (b.left ?? 30));
  } else if (flt === 'Trending') {
    list = [...list].sort((a, b) => (b.likeCount ?? b.likes ?? 0) - (a.likeCount ?? a.likes ?? 0));
  } else {
    // New
    list = [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  const renderChips = (arr, activeVal, onSelect) => (
    <div className="chips">
      {arr.map((x) => (
        <button
          key={x}
          type="button"
          className={'chip' + (activeVal === x ? ' on' : '')}
          onClick={() => onSelect(x)}
        >
          {x}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <h1>Explore challenges</h1>
      <p className="mut" style={{ fontSize: 16, margin: '6px 0 16px' }}>
        Find something worth committing to.
      </p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="🔍 Search challenges by title, goal, or place…"
      />

      {renderChips(categoryNames, cat, setCat)}
      {renderChips(FILTERS, flt, setFlt)}

      <div className="cols" style={{ marginTop: 14 }}>
        {list.length > 0 ? (
          list.map((c) => <ChallengeCard key={c.id} c={c} />)
        ) : (
          <EmptyState
            title="No challenges found"
            text="Try adjusting your search or category filter, or create a new challenge."
          />
        )}
      </div>
    </>
  );
}

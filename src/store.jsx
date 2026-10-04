import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { challengeService } from './services/challengeService';
import { authService } from './services/authService';
import { likeService } from './services/likeService';
import { commentService } from './services/commentService';
import { tokenStorage } from './api/client';

const Ctx = createContext();

export const useStore = () => useContext(Ctx) || { s: {}, actions: {}, toast: '' };

export function normalizeChallenge(c, currentAuth = null) {
  if (!c) return null;
  const isCompleted = c.status === 'COMPLETED' || c.st === 'completed';
  const isFailed = c.status === 'FAILED' || c.st === 'failed';
  const daysLeft = c.remainingTime?.daysLeft ?? c.left ?? 30;

  // Determine ownership
  let own = false;
  if (currentAuth) {
    if (currentAuth.type === 'user' && currentAuth.user?.id) {
      own = c.userId === currentAuth.user.id || c.creator?.id === currentAuth.user.id;
    } else if (currentAuth.type === 'guest' && currentAuth.guestId) {
      own = c.guestId === currentAuth.guestId || c.creator?.id === currentAuth.guestId;
    }
  }

  const title = c.title || c.t || 'Untitled Challenge';
  const description = c.description || c.d || '';
  const categoryName = c.category?.name || c.cat || 'General';
  const creatorName = c.creator?.name || c.by || (own ? 'You' : 'Creator');

  return {
    ...c,
    id: String(c.id),
    title,
    t: title,
    description,
    d: description,
    category: c.category || { name: categoryName, slug: 'general', icon: '🎯' },
    cat: categoryName,
    creator: c.creator || { id: c.userId || c.guestId, name: creatorName, type: own ? 'user' : 'guest' },
    by: creatorName,
    status: c.status || (isCompleted ? 'COMPLETED' : isFailed ? 'FAILED' : 'ACTIVE'),
    st: (c.status?.toLowerCase() || c.st || 'active'),
    likes: c.likeCount ?? c.likes ?? 0,
    likeCount: c.likeCount ?? c.likes ?? 0,
    commentsCount: c.commentCount ?? c.cm ?? 0,
    cm: c.commentCount ?? c.cm ?? 0,
    sk: c.streak ?? c.sk ?? 0,
    left: daysLeft,
    startAt: c.startAt,
    endAt: c.endAt,
    place: c.place || '',
    oathText: c.oathText || '',
    oathAcceptedAt: c.oathAcceptedAt,
    isLiked: !!c.isLiked,
    ms: c.ms || [],
    own
  };
}

export const fin = (c) => {
  if (!c) return 0;
  if (c.ms && Array.isArray(c.ms) && c.ms.length > 0) {
    return c.ms.filter((m) => m && m.d).length;
  }
  return c.status === 'COMPLETED' || c.st === 'completed' ? 1 : 0;
};

export const pct = (c) => {
  if (!c) return 0;
  if (c.status === 'COMPLETED' || c.st === 'completed') return 100;
  if (c.ms && Array.isArray(c.ms) && c.ms.length > 0) {
    return Math.round((fin(c) / c.ms.length) * 100);
  }
  if (c.startAt && c.endAt) {
    const start = new Date(c.startAt).getTime();
    const end = new Date(c.endAt).getTime();
    const now = Date.now();
    if (now <= start) return 0;
    if (now >= end) return 100;
    const total = end - start;
    if (total > 0) return Math.min(100, Math.max(0, Math.round(((now - start) / total) * 100)));
  }
  return 0;
};

const initialFeed = [
  { u: 'Rahul', ago: '2h ago', c: '1', day: 12, tx: 'Consistency is unlocking everything.', cm: 6, l: 24 },
  { u: 'Priya', ago: '5h ago', c: '2', day: 17, tx: 'Completed another key milestone today!', cm: 3, l: 18 },
  { u: 'Ankit', ago: 'Yesterday', c: '3', day: 9, tx: 'Staying dedicated to the oath.', cm: 8, l: 31 }
];

export function Store({ children }) {
  const [s, setS] = useState({
    me: 'Guest',
    auth: { isAuthenticated: false, type: 'guest', user: null, guestId: null },
    streak: 7,
    commits: 24,
    done: 0,
    ch: [],
    categories: [],
    feed: initialFeed,
    log: {},
    cmt: {},
    notes: [
      ['❤️', 'Your challenge received new likes', '2m ago'],
      ['💬', 'Someone commented on your challenge', '1h ago'],
      ['🔥', 'Keep your daily momentum alive', 'Yesterday']
    ],
    likes: {},
    loading: true,
    error: null
  });

  const [toast, setToast] = useState('');
  const up = (f) => setS((p) => { const n = structuredClone(p); f(n); return n; });
  const say = (t) => { setToast(t); setTimeout(() => setToast(''), 2200); };

  // 1. Initialize Auth and Load Data on Mount
  const initApp = useCallback(async () => {
    try {
      let currentAuth = null;
      const hasToken = !!tokenStorage.getAccessToken();

      if (hasToken) {
        try {
          const meRes = await authService.me();
          if (meRes.authenticated) {
            currentAuth = {
              isAuthenticated: true,
              type: meRes.type,
              user: meRes.user || null,
              guestId: meRes.guestId || null
            };
          }
        } catch {
          // Token expired or invalid
          tokenStorage.clear();
        }
      }

      // If no valid session, initialize guest session
      if (!currentAuth) {
        try {
          const guestSession = await authService.createGuest();
          currentAuth = {
            isAuthenticated: true,
            type: 'guest',
            user: null,
            guestId: guestSession.guestId
          };
        } catch (guestErr) {
          console.warn('Guest initialization deferred:', guestErr.message);
          currentAuth = {
            isAuthenticated: false,
            type: 'guest',
            user: null,
            guestId: null
          };
        }
      }

      const savedGuestName = localStorage.getItem('challenge_guest_name') || '';
      const userName =
        currentAuth.type === 'user'
          ? (currentAuth.user?.name || currentAuth.user?.email || 'User')
          : (savedGuestName || 'Guest');

      // Load Categories and Challenges
      let categories = [];
      let challenges = [];

      try {
        const [catData, feedData] = await Promise.all([
          challengeService.getCategories().catch(() => []),
          challengeService.list().catch(() => ({ items: [] }))
        ]);

        categories = catData || [];
        const rawItems = Array.isArray(feedData) ? feedData : (feedData.items || []);
        challenges = rawItems.map((item) => normalizeChallenge(item, currentAuth));
      } catch (loadErr) {
        console.warn('Initial data load warning:', loadErr.message);
      }

      const doneCount = challenges.filter((c) => c.status === 'COMPLETED' || c.st === 'completed').length;

      setS((prev) => ({
        ...prev,
        auth: { ...currentAuth, isGuestNamed: !!savedGuestName },
        me: userName,
        categories,
        ch: challenges,
        done: doneCount,
        loading: false,
        error: null
      }));
    } catch (err) {
      setS((prev) => ({ ...prev, loading: false, error: err.message }));
    }
  }, []);

  useEffect(() => {
    initApp();
  }, [initApp]);

  const refreshChallenges = async () => {
    try {
      const feedData = await challengeService.list();
      const rawItems = Array.isArray(feedData) ? feedData : (feedData.items || []);
      const normalized = rawItems.map((item) => normalizeChallenge(item, s.auth));
      const doneCount = normalized.filter((c) => c.status === 'COMPLETED' || c.st === 'completed').length;

      setS((prev) => ({
        ...prev,
        ch: normalized,
        done: doneCount
      }));
    } catch (err) {
      console.error('Failed to refresh challenges:', err);
    }
  };

  const actions = {
    say,
    refreshChallenges,

    setGuestName: (name) => {
      const trimmed = (name || '').trim();
      if (trimmed) {
        localStorage.setItem('challenge_guest_name', trimmed);
        setS((prev) => ({
          ...prev,
          me: trimmed,
          auth: { ...prev.auth, isGuestNamed: true }
        }));
      }
    },

    // Toggle Like
    toggleLike: async (challengeId) => {
      const targetChallenge = s.ch.find((c) => c.id === challengeId);
      const wasLiked = !!s.likes[challengeId] || !!targetChallenge?.isLiked;
      const nextLiked = !wasLiked;

      // Optimistic state update
      up((n) => {
        n.likes[challengeId] = nextLiked;
        const ch = n.ch.find((c) => c.id === challengeId);
        if (ch) {
          ch.isLiked = nextLiked;
          ch.likes = Math.max(0, (ch.likes || 0) + (nextLiked ? 1 : -1));
          ch.likeCount = ch.likes;
        }
      });

      try {
        await likeService.toggle(challengeId, wasLiked);
      } catch (err) {
        // Rollback on failure
        up((n) => {
          n.likes[challengeId] = wasLiked;
          const ch = n.ch.find((c) => c.id === challengeId);
          if (ch) {
            ch.isLiked = wasLiked;
            ch.likes = Math.max(0, (ch.likes || 0) + (wasLiked ? 1 : -1));
            ch.likeCount = ch.likes;
          }
        });
        say(err.message || 'Could not update like.');
      }
    },

    // Create Challenge
    createChallenge: async ({ t, title, d, description, categoryId, cat, startAt, endAt, place, visibility, oathText }) => {
      const challengeTitle = (title || t || '').trim();
      const challengeDesc = (description || d || '').trim();

      // Find or match category ID
      let resolvedCategoryId = categoryId;
      if (!resolvedCategoryId && s.categories?.length > 0) {
        const foundCat = s.categories.find((c) => c.name?.toLowerCase() === (cat || '').toLowerCase());
        resolvedCategoryId = foundCat ? foundCat.id : s.categories[0].id;
      }

      const defaultStart = new Date(Date.now() + 1000 * 60 * 5).toISOString(); // 5 minutes from now
      const defaultEnd = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 days

      const payload = {
        title: challengeTitle,
        description: challengeDesc || 'I commit myself to completing this challenge.',
        categoryId: resolvedCategoryId || (s.categories[0]?.id),
        oathText: oathText || `I solemnly commit to: ${challengeTitle}`,
        startAt: startAt || defaultStart,
        endAt: endAt || defaultEnd,
        place: place || null,
        visibility: visibility || 'PUBLIC',
        status: 'UPCOMING'
      };

      try {
        const created = await challengeService.create(payload);
        const normalized = normalizeChallenge(created, s.auth);

        up((n) => {
          n.ch.unshift(normalized);
        });

        say('Challenge started with oath 🚀');
        return normalized.id;
      } catch (err) {
        say(err.message || 'Failed to create challenge.');
        throw err;
      }
    },

    // Add Comment
    addComment: async (challengeId, content) => {
      if (!content || !content.trim()) return;
      const text = content.trim();

      // Optimistic comment item
      const tempId = 'temp_' + Date.now();
      const tempAuthor = s.me || 'User';

      up((n) => {
        n.cmt[challengeId] = n.cmt[challengeId] || [];
        n.cmt[challengeId].push({
          id: tempId,
          u: tempAuthor,
          tx: text,
          content: text,
          l: 0,
          p: 0,
          createdAt: new Date().toISOString()
        });

        const ch = n.ch.find((c) => c.id === challengeId);
        if (ch) {
          ch.cm = (ch.cm || 0) + 1;
          ch.commentCount = ch.cm;
        }
      });

      try {
        const serverComment = await commentService.create(challengeId, text);
        up((n) => {
          if (n.cmt[challengeId]) {
            const idx = n.cmt[challengeId].findIndex((c) => c.id === tempId);
            if (idx !== -1 && serverComment) {
              n.cmt[challengeId][idx] = {
                ...serverComment,
                u: serverComment.author?.name || tempAuthor,
                tx: serverComment.content || text
              };
            }
          }
        });
      } catch (err) {
        // Rollback on failure
        up((n) => {
          if (n.cmt[challengeId]) {
            n.cmt[challengeId] = n.cmt[challengeId].filter((c) => c.id !== tempId);
          }
          const ch = n.ch.find((c) => c.id === challengeId);
          if (ch && ch.cm > 0) {
            ch.cm -= 1;
            ch.commentCount = ch.cm;
          }
        });
        say(err.message || 'Could not post comment.');
      }
    },

    // Delete Comment
    deleteComment: async (challengeId, commentId) => {
      up((n) => {
        if (n.cmt[challengeId]) {
          n.cmt[challengeId] = n.cmt[challengeId].filter((x) => x.id !== commentId);
        }
        const ch = n.ch.find((c) => c.id === challengeId);
        if (ch && ch.cm > 0) {
          ch.cm -= 1;
          ch.commentCount = ch.cm;
        }
      });

      try {
        await commentService.remove(challengeId, commentId);
      } catch (err) {
        say(err.message || 'Could not delete comment.');
      }
    },

    // Authentication Actions
    login: async (creds) => {
      try {
        const res = await authService.login(creds);
        const user = res.user;
        setS((prev) => ({
          ...prev,
          auth: { isAuthenticated: true, type: 'user', user, guestId: null },
          me: user.name || user.email
        }));
        await refreshChallenges();
        say(`Welcome back, ${user.name || 'User'}! 👋`);
        return user;
      } catch (err) {
        say(err.message || 'Login failed.');
        throw err;
      }
    },

    register: async (data) => {
      try {
        const res = await authService.register(data);
        const user = res.user;
        setS((prev) => ({
          ...prev,
          auth: { isAuthenticated: true, type: 'user', user, guestId: null },
          me: user.name || user.email
        }));
        await refreshChallenges();
        say(`Account created! Welcome, ${user.name} 🚀`);
        return user;
      } catch (err) {
        say(err.message || 'Registration failed.');
        throw err;
      }
    },

    convertGuest: async (data) => {
      try {
        const res = await authService.convertGuest(data);
        const user = res.user;
        setS((prev) => ({
          ...prev,
          auth: { isAuthenticated: true, type: 'user', user, guestId: null },
          me: user.name || user.email
        }));
        await refreshChallenges();
        say('Account converted successfully! Your challenges are preserved. 🎉');
        return user;
      } catch (err) {
        say(err.message || 'Conversion failed.');
        throw err;
      }
    },

    logout: async () => {
      try {
        await authService.logout();
        const guestSession = await authService.createGuest();
        setS((prev) => ({
          ...prev,
          auth: { isAuthenticated: true, type: 'guest', user: null, guestId: guestSession.guestId },
          me: 'Guest'
        }));
        await refreshChallenges();
        say('Logged out successfully.');
      } catch (err) {
        say('Logged out.');
      }
    }
  };

  return <Ctx.Provider value={{ s, actions, toast }}>{children}</Ctx.Provider>;
}
